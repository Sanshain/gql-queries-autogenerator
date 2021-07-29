//@ts-check

const fs = require('fs');

const getTypes = require("./utils").getTypes;

/** */
function createQueries(targetFile, options){

	// getTypes((/** @type {any} */ data) => console.log(data))
	getTypes((/** @type {any} */ response) => {
		console.log(response)

		let types = response.data['__schema'].types;
		// console.log(types);

		let acceptedTypes = ['ID', 'String', 'Int', 'Boolean', 'DateTime'];

		const queries = types.shift().fields;

		let jsDeclarations = '\n';

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
					else return false;
				}) || [];
	
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