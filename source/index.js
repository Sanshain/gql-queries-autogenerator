//@ts-check

const fs = require('fs');

const { getTypes: loadTypes } = require("./utils");


/**
 * Generate queries to target file (main entrypoint function)
 * @param {string} targetFile - target file name 
 * @param {import('.').GenerateOptions} options
 */
function createQueries(targetFile, options) {

	options = options || {}

	let includeTypes = Array.isArray(options?.include)
		? options.include
		: (options?.include?.base || []).concat(Object.keys(options?.include?.complex || {}))
	
	loadTypes((/** @type {{data: any, errors?: any}} */ response) => {
		// console.log(response)

		// let types = response.data['__schema'].types;		
		let { types, mutationType: mutationTypes } = response.data['__schema'];
		// console.log(types);


		let baseTypes = ['ID', 'String', 'Boolean', 'Int', 'Date', 'DateTime', 'JSONString'];

		const queries = types.shift().fields;
		let mutations = mutationTypes.fields;
		
		/** @legacy condition */
		if (options.mutArgsFromDescMarks) mutations = mutationTypes.fields.filter(mutationFilter(options));		

		let jsDeclarations = '\n';

		for (const mutation of mutations) {

			let inputFields = []

			/** @legacy condition */
			if (options.mutArgsFromDescMarks){
				/** @legacy */
				inputFields = mutation.description.substring(3).split('\n')
					.filter(item => item.trim())
					.map(item => item.trim().split(':'));
			}
			else{
				inputFields = mutation.args.map((tp, i) => {

					if (~baseTypes.indexOf(tp.type.ofType?.name)){
						return [tp.name, tp.type.ofType.name]
					}

					let paramType = types.find(c => c.name == tp.type.ofType?.name);
					if (paramType){
						if (paramType.fields){
							console.warn('Not implemented!!!! TODO!');
							// debugger
							return [tp.name, tp.type.ofType.name]
						}
						else if(mutation.description?.trimLeft().startsWith(':::')) {
							var argType = mutation.description.split(/:::\d?/g)
								.filter(item => item.trim())[i]
								.split('\n')
								.filter(item => item.trim())
								.map(item => item.trim().split(':'));						
						}
					}
					else if(mutation.description?.trimLeft().startsWith(':::')){
						var argType = mutation.description.split(':::')
							.filter(item => item.trim())[i]
							.split('\n')
							.filter(item => item.trim())
							.map(item => item.trim().split(':'));	
					}
					return [tp.name, argType]
				})
			}


			const fieldTypes = mutation.type.fields;
			let declTypes = [];

			for (let fieldType of fieldTypes) {

				try{
					let subFieldsList = null;

					if (fieldType.type.fields){
						subFieldsList = fieldType.type.fields?.filter(f => ~baseTypes.indexOf(f.type.ofType?.name))
					}
					else if (fieldType.type.ofType && !~baseTypes.indexOf(fieldType.type.ofType.name)){
						let localType = types.find(c => c.name==fieldType.type.ofType.name);
						if (localType){
							subFieldsList = localType.fields?.filter(f => ~baseTypes.indexOf(f.type.ofType?.name))
						}
					}
					let subFields = ' '.repeat(16) + subFieldsList?.map(f => f.name).join(',\n' + ' '.repeat(16));
					let typeDecl = ' '.repeat(12) + fieldType.name + (subFieldsList ? `{\n${subFields + '\n' + ' '.repeat(12)}}` : '');

					declTypes.push(typeDecl);					
				}
				catch (e){
					console.warn(`error on ${fieldType.name}: ${e}`);
				}
				
			}

			let argsWrapper = `(${inputFields
				.map(([field, type]) => field + (Array.isArray(type) 
					? `: {${type.map(ar => ar[0] + ': $' + ar[0]).join(', ')}}`
					: (': $' + field)))
				.join(', ')})` + `{\n${declTypes.join(',\n') + '\n' + ' '.repeat(8)}}`				

			// console.log(mutation);

			let mutationDecl = `mutation ${mutation.type.name} {\n${' '.repeat(8)}${mutation.name}${argsWrapper}\n${' '.repeat(4)}}`;

			let asType = ''
			if (targetFile.endsWith('.ts')){
				asType = ` as QueryString<'${mutation.type.name}'>`
			}

			jsDeclarations += `export const ${mutation.name} = gql\`\n${' '.repeat(4) + mutationDecl}\n\`` + 
									`${asType};\n\n\n`
		}


		for (const query of queries) {

			let queryName = query.name;
			let typeName = query.type.name; // ?? queries.fields[0].type.ofType.name;
			let inInclude = includeTypes ? ~includeTypes.indexOf(queryName) : false
			
			let complexFields = []
			if (inInclude){
				complexFields = Object.keys(options?.include?.complex?.[queryName]?.fields ?? [])
			}			

			if ((typeName && !(options?.exclude || []).includes(queryName)) || inInclude) {

				if (inInclude) typeName = query.type.ofType.name;

				let declType = { name: typeName.slice(0, 1).toLowerCase() + typeName.slice(1) };

				let type = types.find(type => type.name == typeName);
				let fields = type?.fields?.filter(field => {
					if (~baseTypes.indexOf(field.type.name) || ~baseTypes.indexOf(field.type.ofType?.name ?? (null + ''))) {
						return true;
					}
					else if (field.description?.toLowerCase().startsWith('nested') || ~complexFields.indexOf(field.name)) {
						return true;
					}
					else return false;
				}) || [];

				fields = fields.map(field => {

					if (field.description?.toLowerCase().startsWith('nested') || ~complexFields.indexOf(field.name)) {

						let _typeName = field.type.name;
						/** @type {string[] | undefined}} */
						let _subTypeFields = []
						if (!_typeName) {
							_typeName = field.type.ofType.name;
							_subTypeFields = options.include?.complex?.[queryName]?.fields[field.name]
							if (!_subTypeFields?.length){
								console.log(`Attention: fields for "${field.name}" field is not specified in "${queryName}" query`);
							}
						}						

						const subType = types.find(type => _typeName == type.name);
						let subFields = subType.fields.map(f => f.name)

						if (_subTypeFields?.length) {
							//@ts-expect-error
							subFields = subFields.filter(f => ~_subTypeFields.indexOf(f))
						}
						
						subFields = subFields.reduce((acc, f) => acc + ' '.repeat(16) + f + ',\n', '')
						
						field.name = `${field.name} {\n${subFields}${' '.repeat(12)}}`

						return field;
						
					}
					else return field;
				})

				if (!fields.length) declType.query = '';
				else 
				{

					let args = `(id: $id)`
					if (inInclude && options?.include?.complex) 
					{						
						let inputFields = options.include?.complex?.[queryName]?.args;

						if (inputFields?.length){

							args = `(${inputFields.map(i => `${i}: $${i}`).join(', ')})`
						}

						// if (inputFields.fields?.length){}						
					}

					let fieldsDecl = fields.map(field => ' '.repeat(12) + field.name).join(',\n');
					let rootFieldDecl = ' '.repeat(8) + `${queryName} ${args} {\n${fieldsDecl}\n${' '.repeat(8)}}`
					declType.query = `${' '.repeat(3)} query ${type.name} {\n${rootFieldDecl}\n ${' '.repeat(3)}}`;
				}

				const asType = targetFile.endsWith('.ts') ? ` as QueryString<'${typeName}'>` : '';

				jsDeclarations += `export const ${declType.name} = gql\`\n${declType.query}\n\`${asType};\n\n\n`
			}
		}

		targetFile = targetFile || process.argv[2];

		if (options.template) {
			let imports = fs.readFileSync(options.template).toString()

			// if (targetFile.endsWith('.ts') && !~imports.indexOf('QueryString')){

			if (targetFile.endsWith('.ts') && options.template.endsWith('.ts') && !~imports.indexOf('QueryString')){
				imports += "\n\ntype QueryString<T extends string> = `\n    ${'mutation'|'query'} ${T}${string}`\n\n"
			}
			jsDeclarations = imports + jsDeclarations;
		}

		fs.writeFileSync(targetFile, jsDeclarations);

		console.log(`queries generated to "${targetFile}"`)

	},
	{
		port: options.port,
		host: options.host,
	})

};

module.exports = { default: createQueries, createQueries };






/**
 * @depreacted
 * @param {*} options 
 * @returns 
 */
function mutationFilter(options) {

	let mark = options.mutArgsFromDescMarks || ':::';

	return m => {

		if (!m.description) {

			console.log("\x1b[31m");

			console.warn(`${m.name} has no description with types. Use types description with following:`);

			console.log("\x1b[34m");
			console.log(`				
					""":::
					value: String
					files: JSONString
					"""				
				`);

			console.log("\x1b[0m");

			return '';
		}
		return m.description.startsWith(':::');
	};
}
