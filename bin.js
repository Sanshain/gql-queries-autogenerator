//@ts-check

// const { createQueries } = require("./index");
import createQueries from "./source/index";
import path from "path";
import fs from "fs";





const Helpers = {
	t: 'target file',
	p: 'server port',
	'-template': 'template file'
}


let target = resolveFile('-t', 1);

let r = getArgv('-p', r => Number(r))

createQueries(target, {
	template: process.argv.indexOf('--template') ? resolveFile('--template', true) : void 0,
	port: getArgv('-p', r => Number(r), v => v > 0)
})




/**
 * @param {`-${string}`} flag 
 * @param {boolean|1} [requiredFlag=undefined] 
 * @returns {string}
 */
 function resolveFile(flag, requiredFlag) {

	let target = getArgv('-' + flag) || (typeof requiredFlag == 'number' && (Number.isInteger(requiredFlag))
		? process.argv[requiredFlag + 1] 
		: null)

	if (!target) {
		 const errMessage = `the path is not specified (use the -${flag} <filename> option for specify ${Helpers[flag.slice(1)]})`;
		 console.warn('\x1B[31m' + errMessage + '\x1B[0m')
		 process.exit(1)
	}

	if (!path.isAbsolute(target)) {
		 target = path.resolve(process.cwd(), target);
	}

	if (requiredFlag && requiredFlag !== undefined && !fs.existsSync(target)) {
		 console.log(process.cwd);
		 console.warn('\x1B[31m' + `${target} file not found` + '\x1B[0m')
		 // throw new Error(`${target} file not found`);
		 process.exit(1)
	}

	return target;
}


/**
 * @param {string} argk
 * @param {(arg: string) => T} [converter=null]
 * @param {(v: T) => boolean} [validator=null]
 * @template T
 * @returns {converter extends undefined ? string : T}
 */
function getArgv(argk, converter, validator) {
	let r;
	let index = process.argv.indexOf(argk) + 1
	if (index) {		
		if (converter) r = converter(process.argv[index])
		else {			
			r = process.argv[index]
		}
	}
	//@ts-expect-error
	if (validator && !validator(r)){
		console.warn('\x1B[31m' + `wrong ${Helpers[argk.slice(1)]}` + '\x1B[0m');
		//@ts-expect-error
		return null;
	}
	//@ts-expect-error
	return r;	
}