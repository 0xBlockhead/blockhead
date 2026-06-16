import {
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import {
	corsFetch,
	fetchFailedMessage,
	jsonErrorHintFromResponse,
	throwHttpError,
} from '$/lib/http.ts'

const jsonResponse = (body: object, status = 500) => new Response(
	JSON.stringify(body),
	{
		status,
		statusText: 'Internal Server Error',
		headers: {
			'content-type': 'application/json',
		},
	}
)

describe('HTTP error helpers', () => {
	it('extracts top-level JSON message hints', async () => {
		await expect(jsonErrorHintFromResponse(jsonResponse({
			message: ' Upstream failed ',
		}))).resolves.toBe('Upstream failed')
	})

	it('extracts nested JSON error message hints', async () => {
		await expect(jsonErrorHintFromResponse(jsonResponse({
			error: {
				message: ' RPC rejected ',
			},
		}))).resolves.toBe('RPC rejected')
	})

	it('ignores blank, non-json, and non-string message hints', async () => {
		await expect(jsonErrorHintFromResponse(jsonResponse({
			message: '   ',
		}))).resolves.toBeUndefined()
		await expect(jsonErrorHintFromResponse(jsonResponse({
			error: {
				message: 123,
			},
		}))).resolves.toBeUndefined()
		await expect(jsonErrorHintFromResponse(new Response('failure', {
			status: 500,
			headers: {
				'content-type': 'text/plain',
			},
		}))).resolves.toBeUndefined()
	})

	it('adds JSON message hints to fetch and context errors', async () => {
		await expect(fetchFailedMessage('https://example.com', jsonResponse({
			message: 'denied',
		}, 403))).resolves.toBe('Fetch failed (403 Internal Server Error) for https://example.com: denied')
		await expect(throwHttpError('Provider request', jsonResponse({
			error: {
				message: 'rate limited',
			},
		}, 429))).rejects.toThrow('Provider request (429): rate limited')
	})

	it('rejects unregistered absolute provider origins before fetch', async () => {
		const fetchMock = vi.fn<typeof fetch>()
		vi.stubGlobal('fetch', fetchMock)
		try {
			await expect(corsFetch('https://not-registered.example/data', {
				origins: [{
					origin: 'https://registered.example',
					corsEnabled: true,
				}],
			})).rejects.toThrow('Unregistered source origin for https://not-registered.example/data')
			expect(fetchMock).not.toHaveBeenCalled()
		} finally {
			vi.unstubAllGlobals()
		}
	})

	it('uses the browser proxy only for registered non-CORS provider origins', async () => {
		const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(new Response('ok'))
		vi.stubGlobal('fetch', fetchMock)
		vi.stubGlobal('window', {})
		try {
			await corsFetch('https://registered.example/data', {
				origins: [{
					origin: 'https://registered.example',
					corsEnabled: false,
				}],
			})
			expect(fetchMock).toHaveBeenCalledWith(
				'/api-proxy/https://registered.example/data',
				expect.objectContaining({
					signal: expect.any(AbortSignal),
				})
			)
		} finally {
			vi.unstubAllGlobals()
		}
	})
})
