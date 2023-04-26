//@ts-check

const { default: createQueries } = require("../source");

if (process.argv.slice(1).shift() === __filename) {
	createQueries('./tests/example.r.ts', {
		template: './tests/template.ts',
		// template: './template.js',
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