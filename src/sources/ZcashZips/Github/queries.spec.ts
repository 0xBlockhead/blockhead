import { describe, expect, it, vi } from 'vitest'

import bindings from '$/sources/ZcashZips/bindings.ts'
import { Source } from '$/sources/Source.ts'

const httpRuntime = vi.hoisted(() => ({
	sourceGetJson: vi.fn(),
	sourceGetText: vi.fn(),
}))

vi.mock('$/sources/_runtime/http.ts', () => httpRuntime)

const {
	getContentsUrl,
	getProposalRstText,
} = await import('$/sources/ZcashZips/Github/queries.ts')

const binding = bindings[Source.ZcashZips_Github][0]

describe('Zcash ZIPs GitHub queries', () => {
	it('fetches the discovered rst proposal file', async () => {
		httpRuntime.sourceGetJson.mockResolvedValueOnce([
			{
				name: 'zip-0032.rst',
				path: 'zips/zip-0032.rst',
				type: 'file',
			},
		])
		httpRuntime.sourceGetText.mockResolvedValueOnce('ZIP')

		await getProposalRstText({
			number: 32,
		})

		expect(getContentsUrl()).toBe(
			'https://api.github.com/repos/zcash/zips/contents/zips?ref=master'
		)
		expect(httpRuntime.sourceGetText).toHaveBeenCalledWith(
			binding,
			'https://raw.githubusercontent.com/zcash/zips/master/zips/zip-0032.rst'
		)
	})

	it('rejects a proposal-shaped directory', async () => {
		httpRuntime.sourceGetJson.mockResolvedValueOnce([
			{
				name: 'zip-0032.rst',
				path: 'zips/zip-0032.rst',
				type: 'dir',
			},
		])

		await expect(getProposalRstText({
			number: 32,
		})).rejects.toThrow('ZcashZips_Github: proposal path is not a file for ZIP 32: zip-0032.rst')
	})

	it('rejects duplicate proposal files for the same ZIP number', async () => {
		httpRuntime.sourceGetJson.mockResolvedValueOnce([
			{
				name: 'zip-0032.rst',
				path: 'zips/zip-0032.rst',
				type: 'file',
			},
			{
				name: 'zip-0032.rst',
				path: 'drafts/zip-0032.rst',
				type: 'file',
			},
		])

		await expect(getProposalRstText({
			number: 32,
		})).rejects.toThrow('ZcashZips_Github: duplicate proposal files for ZIP 32: zip-0032.rst, zip-0032.rst')
	})

	it('rejects unsafe proposal coordinates before listing repository contents', async () => {
		vi.clearAllMocks()
		await expect(getProposalRstText({
			number: 0,
		})).rejects.toThrow('ZIP number must be a positive safe integer')
		await expect(getProposalRstText({
			number: Number.MAX_SAFE_INTEGER + 1,
		})).rejects.toThrow('ZIP number must be a positive safe integer')
		expect(httpRuntime.sourceGetJson).not.toHaveBeenCalled()
	})
})

