//@ts-check

const fs = require('fs');

const getTypes = require("./utils").getTypes;

/** */
function createQueries(targetFile, options) {

	let includeTypes = Array.isArray(options?.include)
		? options.include
		: (options?.include?.base || []).concat(Object.keys(options?.include?.complex || {}))

	// getTypes((/** @type {any} */ data) => console.log(data))
	getTypes((/** @type {any} */ response) => {
		console.log(response)

		// let types = response.data['__schema'].types;		
		let { types, mutationType: mutationTypes } = response.data['__schema'];
		// console.log(types);


		let acceptedTypes = ['ID', 'String', 'Int', 'Boolean', 'DateTime', 'JSONString'];

		const queries = types.shift().fields;
		const mutations = mutationTypes.fields.filter(m => m.description.startsWith(':::'));

		let jsDeclarations = '\n';

		for (const mutation of mutations) {

			let inputFields = mutation.description.substring(3).split('\n')
				.filter(item => item.trim())
				.map(item => item.trim().split(':'));

			const fieldTypes = mutation.type.fields;
			let declTypes = []

			for (let fieldType of fieldTypes) {

				let subFieldsList = fieldType.type.fields.filter(f => ~acceptedTypes.indexOf(f.type.ofType?.name))
				let subFields = ' '.repeat(16) + subFieldsList.map(f => f.name).join(',\n' + ' '.repeat(16));
				let typeDecl = ' '.repeat(12) + fieldType.name + `{\n${subFields + '\n' + ' '.repeat(12)}}`

				declTypes.push(typeDecl);
			}

			let argsWrapper = `(${inputFields
				.map(([field, type]) => field + ': $' + field)
				.join(', ')})` + `{\n${declTypes.join(',') + '\n' + ' '.repeat(8)}}`

			let mutationDecl = `mutation ${mutation.name} {\n${' '.repeat(8)}${mutation.name}${argsWrapper}\n${' '.repeat(4)}}`;

			jsDeclarations += `export const ${mutation.name} = gql\`\n${' '.repeat(4) + mutationDecl}\n\`;\n\n`
		}


		for (const query of queries) {

			let queryName = query.name;
			let typeName = query.type.name; // ?? queries.fields[0].type.ofType.name;
			let inInclude = includeTypes ? ~includeTypes.indexOf(queryName) : false
			
			let complexFields = []
			if (inInclude){
				complexFields = Object.keys(options?.include?.complex?.[queryName]?.fields)
			}			

			if ((typeName && !(options?.exclude || []).includes(queryName)) || inInclude) {

				if (inInclude) typeName = query.type.ofType.name;

				let declType = { name: typeName.slice(0, 1).toLowerCase() + typeName.slice(1) };

				let type = types.find(type => type.name == typeName);
				let fields = type?.fields?.filter(field => {
					if (~acceptedTypes.indexOf(field.type.name) || ~acceptedTypes.indexOf(field.type.ofType?.name ?? (null + ''))) {
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
						let _subTypeFields = []
						if (!_typeName){
							_typeName = field.type.ofType.name;
							_subTypeFields = options?.include?.complex?.[queryName]?.fields[field.name]
							if (!_subTypeFields.length){
								console.log(`Attention: fields for "${field.name}" field is not specified in "${queryName}" query`);
							}
						}						

						let subType = types.find(type => _typeName == type.name);

						let subFields = subType.fields
							.map(f => f.name)
						if (_subTypeFields?.length) subFields = subFields
							.filter(f => ~_subTypeFields.indexOf(f))
						subFields = subFields
							.reduce((acc, f) => acc + ' '.repeat(16) + f + ',\n', '')

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
						let inputFields = options?.include?.complex?.[queryName]?.args;

						if (inputFields.length){

							args = `(${inputFields.map(i => `${i}: $${i}`).join(', ')})`
						}

						// if (inputFields.fields?.length){}						
					}

					let fieldsDecl = fields.map(field => ' '.repeat(12) + field.name).join(',\n');
					let rootFieldDecl = ' '.repeat(8) + `${queryName} ${args} {\n${fieldsDecl}\n${' '.repeat(8)}}`
					declType.query = `${' '.repeat(3)} query ${type.name} {\n${rootFieldDecl}\n ${' '.repeat(3)}}`;
				}

				jsDeclarations += `export const ${declType.name} = gql\`\n${declType.query}\n\`;\n\n`
			}
		}

		targetFile = targetFile || process.argv[2];

		if (options.template) {
			let imports = fs.readFileSync(options.template).toString()
			jsDeclarations = imports + jsDeclarations;
		}

		fs.writeFileSync(targetFile, jsDeclarations);

		console.log(`queries generated to "${targetFile}"`)

	})

};

module.exports = { createQueries };



if (process.argv.slice(1).shift() === __filename) {
	createQueries('d.js', {
		template: './template.js',
		exclude: ['me'],
		include: {
			base: [],
			complex: {
				posts: {
					args: ['user'],
					fields: {
						by: ['id']
					}
				}
			}
		}
	});
}