import * as fs from './fs'
import { dirname, resolve, extname, basename } from 'path'
import { toHyphen, getStack, loop } from './utils'

export type tModule = NodeModule | string

export interface iConfig {
	async?: boolean
	recurse?: boolean
	indexProp?: boolean
	indexName?: string
	export?: boolean | Function
	resolve?: Function
	safe?: boolean
	exclude?: {
		files?: Array<string>
		self?: boolean
		parents?: boolean
		siblings?: boolean
		children?: boolean
	}
}

export interface iModuleData {
	props?: typeStrings
	exports: any
	filename: string
	extname: string
	basename: string
	path: string
}

function* emitOnFile(
	path: string,
	onModule: function,
	isAsync: boolean = false,
) {
	if (extname(path) !== '.js') {
		return
	}

	let modulePayload

	if (!isAsync) {
		modulePayload = fs.rqex(path, isAsync)
	} else {
		yield fs.rqex(path, isAsync).then(_ => (modulePayload = _))
	}

	onModule(path, modulePayload)
}

function* moduleCompilerIterator(
	inputPathList: string[],
	options: iConfig = {},
	onModule: function = (path, payload) => {},
	isFirst: boolean = true,
) {
	const { excluded = [], recurse, async: isAsync = false } = options
	const promiseStack = []

	for (const path: string of inputPathList) {
		let isFile = true
		if (!isAsync) {
			isFile = fs.isFile(path, isAsync)
		} else {
			yield fs.isFile(path, isAsync).then(_ => (isFile = _))
		}

		if (isFile) {
			yield* emitOnFile(path, onModule, isAsync)
			continue
		}

		let fileList

		if (!isAsync) {
			fileList = fs.readdir(path, isAsync)
		} else {
			yield fs.readdir(path, isAsync).then(_ => (fileList = _))
		}

		fileList = fileList.map(_ => resolve(path, _))

		if (recurse) {
			const promise = loop(
				moduleCompilerIterator(fileList, options, onModule, !isFirst),
				isAsync,
			)
			promiseStack.push(promise)
		}
	}

	yield Promise.all(promiseStack)
}

export default function requine(
	inputModule: tModule,
	options: iConfig = {},
): Object | Promise {
	const [, , caller] = getStack()
	const moduleRoot: string = dirname(caller.getFileName())
	let modulePath: string = moduleRoot

	if (typeof inputModule === 'string') {
		try {
			modulePath = require.resolve(inputModule)
		} catch (e) {
			modulePath = resolve(moduleRoot, inputModule)
		}
	}

	const excluded: string[] = []
	if (inputModule && inputModule.filename) {
		excluded.push(inputModule.filename)
	}

	options.excluded = options.excluded
		? options.excluded.concat(excluded)
		: excluded

	const resultModule = {}
	let promiseStack = Promise.resolve(true)

	const compilerIterator = moduleCompilerIterator(
		[modulePath],
		options,
		(path, source) => {
			let moduleName = basename(path, '.js')
			moduleName = toHyphen(moduleName)

			const ext = extname(path)
			const moduleData: iModuleData = {
				exports: source,
				filename: basename(path),
				extname: extname(path),
				basename: basename(path, ext),
				path,
			}

			const modulePayload =
				typeof options.resolve === 'function'
					? options.resolve.apply(moduleData, moduleData)
					: modulePayload

			resultModule[moduleName] = modulePayload
		},
	)

	const resultPromise = loop(compilerIterator, options.async)
	return options.async ? resultPromise.then(_ => resultModule) : resultModule
}
