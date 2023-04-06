
export type GenerateOptions = {
	port?: number,
	host?: string,
	template?: string,
	exclude?: string[],
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
	},
	/** @deprecated */
	mutArgsFromDescMarks?: string,	
}

declare function createQueries(targetFile: string, options? : GenerateOptions)

// export = createQueries;
export default createQueries;
export {
	createQueries
}


