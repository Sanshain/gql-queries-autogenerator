//@ts-check

const fs = require('fs');

const getTypes = require("./utils").getTypes;

/** */
function createQueries(targetFile){

	// getTypes((/** @type {any} */ data) => console.log(data))
	getTypes((/** @type {any} */ response) => {
		console.log(response)

		let types = response.data['__schema'].types;
		// console.log(types);

		let acceptedTypes = ['ID', 'String', 'Int', 'Boolean', 'DateTime'];

		let declTypes =  types.map(type => {

			let fields = type?.fields?.filter(field => {
				// if (field.type.ofType !== null){
				// 	console.log('id');
				// }
				if (~acceptedTypes.indexOf(field.type.name) || ~acceptedTypes.indexOf(field.type.ofType?.name ?? (null + ''))){
					return true;
				}
				else return false;
			}) || [];

			if (!fields.length) return '';

			let fieldsDecl = fields.map(field => ' '.repeat(8) + field.name).join(',\n');

			let query = `${' '.repeat(3)} query ${type.name} {\n${fieldsDecl}\n ${' '.repeat(3)}}`;

			return {name: type.name.slice(0, 1).toLowerCase() + type.name.slice(1), query};
		})

		// console.log(declTypes.filter(type => type));

		let jsDeclarations = '\n';

		declTypes.filter(type => type.query).forEach(declType => {
			
			jsDeclarations += `export const ${declType.name} = gql\`\n${declType.query}\n\`;\n\n`
		});

		targetFile = targetFile || process.argv[2];

		fs.writeFileSync(targetFile, jsDeclarations);

		console.log(`queries generated to "${targetFile}"`)

	})

};

module.exports = {createQueries};

// createQueries('d.js')