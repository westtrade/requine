import * as fs from '../src/fs'
import { resolve } from 'path'

describe('fs', () => {
	it('.readdir result of sync and async should be equal', async function() {
		const testDirName: string = resolve(__dirname, './fixtures')
		const contentSync: string = fs.readdir(testDirName)
		const contentAsync: string = await fs.readdir(testDirName, true)
		expect(contentSync).toEqual(contentAsync)
	})

	it('.readFile result of sync and async should be equal', async function() {
		const testFileName: string = resolve(__dirname, './fixtures/test.txt')
		const contentSync: string = fs.readFile(testFileName)
		const contentAsync: string = await fs.readFile(testFileName, true)
		expect(contentSync).toEqual(contentAsync)
	})

	it('.stat result of sync and async should be equal', async function() {
		const testFileName: string = resolve(__dirname, './fixtures/test.txt')
		const contentSync: string = fs.stat(testFileName)
		const contentAsync: string = await fs.stat(testFileName, true)
		expect(contentSync).toEqual(contentAsync)
	})

	it('.rqex result of sync and async should be equal', async function() {
		const testFileName: string = resolve(
			__dirname,
			'./fixtures/hello-world.js',
		)
		const contentSync: string = fs.rqex(testFileName)
		const contentAsync: string = await fs.rqex(testFileName, true)
		expect(contentSync).toEqual(contentAsync)
	})
})
