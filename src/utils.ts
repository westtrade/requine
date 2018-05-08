export const toHyphen = input =>
	input.replace(/-([a-z])/g, g => g[1].toUpperCase())

export const getStack = () => {
	const _ = Error.prepareStackTrace
	Error.prepareStackTrace = (err, stack) =>
		(Error.prepareStackTrace = _) && stack
	return new Error().stack
}

export async function loop(asyncIterator, isAsync = false) {
	for (let promise of asyncIterator) {
		isAsync && (await promise)
	}
}
