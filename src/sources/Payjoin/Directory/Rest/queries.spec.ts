import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import {
	getOhttpKeyConfigBase64,
	ohttpGatewayUrlForDirectory,
} from '$/sources/Payjoin/Directory/Rest/queries.ts'

const sourceFetch = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_runtime/http.ts', () => ({
	sourceFetch,
}))

describe('Payjoin directory OHTTP keys', () => {
	beforeEach(() => {
		sourceFetch.mockReset()
	})

	it('loads the canonical gateway key document as browser-safe base64', async () => {
		sourceFetch.mockResolvedValueOnce(new Response(Uint8Array.from([
			0,
			1,
			2,
			253,
			254,
			255,
		]), {
			status: 200,
		}))

		await expect(getOhttpKeyConfigBase64({
			directoryUrl: 'https://payjo.in/',
		})).resolves.toBe('AAEC/f7/')
		expect(sourceFetch).toHaveBeenCalledWith(
			expect.objectContaining({
				source: 'PayjoinDirectory_Rest',
			}),
			'https://payjo.in/.well-known/ohttp-gateway',
			{
				headers: {
					accept: 'application/ohttp-keys',
				},
				redirect: 'manual',
			}
		)
	})

	it('keeps the directory origin and fails HTTP errors closed', async () => {
		expect(ohttpGatewayUrlForDirectory('https://payjo.in')).toBe(
			'https://payjo.in/.well-known/ohttp-gateway'
		)
		sourceFetch.mockResolvedValueOnce(new Response('unavailable', {
			status: 503,
		}))

		await expect(getOhttpKeyConfigBase64({
			directoryUrl: 'https://payjo.in',
		})).rejects.toThrow('503')
	})

	it.each([
		'http://payjo.in/',
		'https://payjo.in:8443/',
		'https://user:password@payjo.in/',
		'https://payjo.in/directory',
		'https://payjo.in/?directory=other',
		'https://directory.example/',
		'http://127.0.0.1:8080/',
		'http://localhost:8080/',
	])('rejects noncanonical or local directory authority %s before transport', async (directoryUrl) => {
		await expect(getOhttpKeyConfigBase64({
			directoryUrl,
		})).rejects.toThrow('directory URL must be a registered public HTTPS origin')

		expect(sourceFetch).not.toHaveBeenCalled()
	})
})
