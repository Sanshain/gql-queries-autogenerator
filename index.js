//@ts-check

const fs = require('fs');

const getTypes = require("./utils").getTypes;

/** */
function createQueries(targetFile, options){

	// getTypes((/** @type {any} */ data) => console.log(data))
	getTypes((/** @type {any} */ response) => {
		console.log(response)

		// let types = response.data['__schema'].types;		
		let {types, mutationType: mutationTypes} = response.data['__schema'];
		// console.log(types);


		let acceptedTypes = ['ID', 'String', 'Int', 'Boolean', 'DateTime'];

		const queries = types.shift().fields;  
		const mutations = mutationTypes.fields.filter(m => m.description.startsWith(':::'));

		let jsDeclarations = '\n';

		for (const mutation of mutations){

			let inputFields = mutation.description.substring(3).split('\n')
				.filter(item => item.trim())
				.map(item => item.trim().split(':'));

			const fieldTypes = mutation.type.fields;
			let declTypes = []

			for (let fieldType of fieldTypes){
				
				let subFields = ' '.repeat(16) + fieldType.type.fields.map(f => f.name).join(',\n' + ' '.repeat(16));
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
			if (typeName && !(options?.exclude || []).includes(queryName)){

				let declType = {name: typeName.slice(0, 1).toLowerCase() + typeName.slice(1)};
				
				let type = types.find(type => type.name == typeName);
				let fields = type?.fields?.filter(field => {					
					if (~acceptedTypes.indexOf(field.type.name) || ~acceptedTypes.indexOf(field.type.ofType?.name ?? (null + ''))){
						return true;
					}
					else if(field.description?.toLowerCase().startsWith('nested')) return true;
					else return false;
				}) || [];

				fields = fields.map(field => {
					if (field.description?.toLowerCase().startsWith('nested')){

						let subType = types.find(type => field.type.name == type.name);
						let subFields = subType.fields
							.map(f => f.name)
							.reduce((acc, f) => acc + ' '.repeat(16) + f + ',\n', '')
						field.name = `${field.name} {\n${subFields}${' '.repeat(12)}}`
						return field;
					}
					else return field;
				})
	
				if (!fields.length) declType.query = '';
				else{

					let fieldsDecl = fields.map(field => ' '.repeat(12) + field.name).join(',\n');
					let rootFieldDecl = ' '	.repeat(8) + `${queryName} (id: $id) {\n${fieldsDecl}\n${' '.repeat(8)}}`
					declType.query = `${' '.repeat(3)} query ${type.name} {\n${rootFieldDecl}\n ${' '.repeat(3)}}`;					
				}

				jsDeclarations += `export const ${declType.name} = gql\`\n${declType.query}\n\`;\n\n`
			}
		}

		targetFile = targetFile || process.argv[2];

		if (options.template){
			let imports = fs.readFileSync(options.template).toString()
			jsDeclarations = imports + jsDeclarations;
		}

		fs.writeFileSync(targetFile, jsDeclarations);

		console.log(`queries generated to "${targetFile}"`)

	})

};

module.exports = {createQueries};



if (process.argv.slice(1).shift() === __filename)
{
	createQueries('d.js', {
		template: './template.js',
		exclude: ['me']
	});
} 