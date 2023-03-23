//@ts-check

import commonjs from '@rollup/plugin-commonjs';
// import resolve from '@rollup/plugin-node-resolve';
// import { terser } from 'rollup-plugin-terser';

import { writeFileSync } from 'fs';
import path from 'path';





let targets = [
	{
		input: './bin.js',
		output: {
			// name: 'app',
			format: 'cjs',
			file: './bin/generate_queries',
		},
	},
]



module.exports = targets.map(options => ({	
	input: options.input,
	output: {		
		format: options.output.format || 'iife',
		name: options.output.name,
		file: options.output.file,

		sourcemap: true,	
		
		// inlineDynamicImports: true,	
		// sourcemapPathTransform: mapfile => `maps/${mapfile}`
	},
	plugins: [		
		// resolve({}),
		commonjs(),
		{
			name: 'rollup-plugin-shebang-insert',
			/**
			 * @param {{file: string}} opts - options
			 * @param {{[fileName: string]: {code: string}}} bundle 
			 */
			generateBundle(opts, bundle) {                        

				 const file = path.parse(opts.file).base
				 let code = bundle[file].code;
				 bundle[file].code = '#!/usr/bin/env node\n\n' + bundle[file].code
			}
	   },		
		// terser(),
	],
	watch: {
		clearScreen: false
	}
}));
