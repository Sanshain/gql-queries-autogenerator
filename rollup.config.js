//@ts-check

// import commonjs from '@rollup/plugin-commonjs';
// import resolve from '@rollup/plugin-node-resolve';
// import { terser } from 'rollup-plugin-terser';

import { writeFileSync } from 'fs';
import path from 'path';





let targets = [
	{
		input: './bin.js',
		output: {
			// name: 'app',
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
		// commonjs(),
		// terser(),
	],
	watch: {
		clearScreen: false
	}
}));
