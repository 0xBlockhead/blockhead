import {
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import {
	corsFetch,
	fetchFailedMessage,
	getJson,
	getText,
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

	it('uses direct browser fetch for registered CORS-enabled provider origins', async () => {
		const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(new Response('ok'))
		vi.stubGlobal('fetch', fetchMock)
		vi.stubGlobal('window', {})
		try {
			await corsFetch('https://registered.example/data', {
				origins: [{
					origin: 'https://registered.example',
					corsEnabled: true,
				}],
			})
			expect(fetchMock).toHaveBeenCalledWith(
				'https://registered.example/data',
				expect.objectContaining({
					signal: expect.any(AbortSignal),
				})
			)
		} finally {
			vi.unstubAllGlobals()
		}
	})

	it('does not require source origin metadata for same-origin relative URLs', async () => {
		const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(new Response('ok'))
		vi.stubGlobal('fetch', fetchMock)
		try {
			await corsFetch('/api/local', {
				origins: [],
			})
			expect(fetchMock).toHaveBeenCalledWith(
				'/api/local',
				expect.objectContaining({
					signal: expect.any(AbortSignal),
				})
			)
		} finally {
			vi.unstubAllGlobals()
		}
	})

	it('retries provider 429 responses within the source-aware fetch path', async () => {
		const fetchMock = vi.fn<typeof fetch>()
			.mockResolvedValueOnce(new Response('rate limited', {
				status: 429,
				headers: {
					'retry-after': '0',
				},
			}))
			.mockResolvedValueOnce(new Response('ok'))
		vi.stubGlobal('fetch', fetchMock)
		try {
			await expect(corsFetch('https://registered.example/data', {
				origins: [{
					origin: 'https://registered.example',
					corsEnabled: true,
				}],
				retry: {
					maxRetries: 1,
				},
			})).resolves.toHaveProperty('ok', true)
			expect(fetchMock).toHaveBeenCalledTimes(2)
		} finally {
			vi.unstubAllGlobals()
		}
	})

	it('preserves provider HTTP failures through JSON and text helpers', async () => {
		const fetchMock = vi.fn<typeof fetch>()
			.mockResolvedValueOnce(jsonResponse({
				message: 'json failed',
			}, 500))
			.mockResolvedValueOnce(new Response('nope', {
				status: 502,
				statusText: 'Bad Gateway',
			}))
		vi.stubGlobal('fetch', fetchMock)
		try {
			await expect(getJson('https://registered.example/json', {
				origins: [{
					origin: 'https://registered.example',
					corsEnabled: true,
				}],
			})).rejects.toThrow('Fetch failed (500 Internal Server Error) for https://registered.example/json: json failed')
			await expect(getText('https://registered.example/text', {
				origins: [{
					origin: 'https://registered.example',
					corsEnabled: true,
				}],
			})).rejects.toThrow('Fetch failed (502 Bad Gateway) for https://registered.example/text')
		} finally {
			vi.unstubAllGlobals()
		}
	})
})
