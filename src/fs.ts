import * as fs from 'fs'
import Module from 'module'
import vm from 'vm'

/**
 * readdir - Synchronous/asynchronous read contents of a directory
 *
 * @param  {<String> | <Buffer> | <URL>} path           input path
 * @param  {<Boolean>} async = false 					asynchronous flag
 * @return {Array.<String>|Promise<string[]>}  			Directory content
 */
export function readdir(path: string, async?: boolean = false): string[]|Promise<string[]> {
	if (!async) {
		return fs.readdirSync(path)
	}

	return new Promise((resolve, reject) =>
		fs.readdir(
			path,
			(err: Error, result: string[]) => (err ? reject(err) : resolve(result)),
		),
	)
}

/**
 * readFile - Synchronous/asynchronous read file content
 *
 * @param  {<String> | <Buffer> | <URL>} path           input path
 * @param  {<Boolean>} async = false 					asynchronous flag
 * @return {<String>|Promise<string[]>}  				File content
 */
export function readFile(path: string, async?: boolean = false): string|<Promise> {
	if (!async) {
		return fs.readFileSync(path, 'utf-8');
	}

	return new Promise((resolve, reject) => fs.readFile(path, 'utf-8', (err, content: string) => err ? reject(err) : resolve(content)));
}

/**
 * stat - Synchronous/asynchronous stat of file
 *
 * @param  {<String> | <Buffer> | <URL>} path           input path
 * @param  {<Boolean>} async = false 					asynchronous flag
 * @return {<fs.Stats>|Promise<fs.Stats>| <Void>}  		Path stats
 */
export function stat(path: string, async?: boolean = false): <fs.Stats>| <Promise> {
	if (!async) {
		let resultStat: void = null
		try {
			resultStat = fs.statSync(path)
		} catch (e) {}

		return resultStat;
	}

	return new Promise((resolve, reject) =>
		fs.stat(path, (_, stat) => resolve(stat))
	);
}

/**
 * rqex - Synchronous/asynchronous extended require js file
 *
 * @param  {<String> | <Buffer> | <URL>} path           input path
 * @param  {<Boolean>} async = false 					asynchronous flag
 * @return {<Object>|Promise<Object>}  					Module
 */
export function rqex(inputPath: string, async?: boolean = false): Object {
	const path: string = require.resolve(inputPath)
	if (!async) {
		const mod:Object = require(path);
		return mod;
	}

	if (require.cache[path]) {
		return Promise.resolve(require.cache[path]);
	}

	return Promise.resolve(readFile(path))
	.then((script:string) => {
		const sandboxModule = new Module(path, module.parent);
		const sandbox = {
			module: sandboxModule,
			exports: sandboxModule.exports
		}

		vm.runInNewContext(script, Object.assign({require}, global, sandbox));
		return sandbox.module.exports;
	});
}

export function isFile(path: string, async?:boolean = false): Object {
	if (!async) {
		const pathStat = stat(path)
		return pathStat && pathStat.isFile();
	}

	return stat(path, true).then(pathStat => pathStat && pathStat.isFile());
}
