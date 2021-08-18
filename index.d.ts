
type Options = {
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
	}
}

declare function createQueries(targetFile: string, options? : Options)

export = typesGenerate;

