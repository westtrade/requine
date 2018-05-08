import requine, { caller } from '../src/requine'

describe('require simple module with requine', function(): void {
	it('synchronous and asynchronous sholud be equal', async function(): void {
		requine()
	})

	it('synchronous and asynchronous sholud be equal', async function(): void {
		requine(module)
	})

	it('synchronous and asynchronous sholud be equal', async function(): void {
		requine('./fixtures')
	})

	it('synchronous and asynchronous sholud be equal', async function(): void {
		const modulesPath = './fixtures/recurse'
		const resolve = function() {
			console.log(this.exports)
			if (this.exports && this.exports.default) {
				this.exports = this.exports.default({
					logger,
					name: this.basename,
				})
			}
		}

		const resultSync = requine(modulesPath, {
			recurse: true,
			resolve,
		})

		const resultAsync = await requine(modulesPath, {
			async: true,
			recurse: true,
			resolve,
		})

		expect(resultSync).toEqual(resultAsync)
	})

	it('synchronous and asynchronous sholud be equal', async function(): void {
		// requine('typescript')
	})
})

// describe('getInitialPath', function() {
// 	it('must point to file in the current directory', function() {
// 		const initialPath: string = caller()
//
// 		expect(initialPath).toBe(__filename)
// 	})
// })
