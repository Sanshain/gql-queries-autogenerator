
export type GenerateOptions = {
	template?: string,
	exclude?: string[],
	mutArgsFromDescMarks?: string,
	include?: {
		base?: string[],
		complex? : {
			[k: string]: {
				args?: string[],
				fields: {
					[k: string]: Array<string>
				}
			}
		}
	}
}

declare function createQueries(targetFile: string, options? : GenerateOptions)

// export = createQueries;
export default createQueries;
export {
	createQueries
}


