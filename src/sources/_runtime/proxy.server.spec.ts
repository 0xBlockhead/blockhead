import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'
import type { SourceServerCredentialDefinition } from '$/sources/SourceBinding.ts'

const {
	privateEnv,
	oauthCredentialDefinition,
} = vi.hoisted(() => ({
	privateEnv: {
		HEADER_SECRET: 'header-secret',
		QUERY_SECRET: 'query secret',
		TEMPLATE_SECRET: 'template/secret',
		OAUTH_CLIENT_ID: 'oauth-client',
		OAUTH_CLIENT_SECRET: 'oauth-secret',
	},
	oauthCredentialDefinition: {
		envKey: 'OAUTH_CLIENT_SECRET',
		injection: {
			header: {
				name: 'Authorization',
				prefix: 'Bearer ',
			},
		},
		oauthClientCredentials: {
			clientIdEnvKey: 'OAUTH_CLIENT_ID',
			tokenEndpoint: 'https://identity.example.test/oauth/token',
			userAgent: 'Blockhead/1.0.0 (+https://blockhead.vision) by /u/blockhead',
		},
	},
}))

vi.mock('$env/dynamic/private', () => ({
	env: privateEnv,
}))

vi.mock('$/sources/$sourceServerCredentials.server.ts', () => ({
	default: new Map<string, SourceServerCredentialDefinition>([
		['header', {
			envKey: 'HEADER_SECRET',
			injection: {
				header: {
					name: 'Authorization',
					prefix: 'Bearer ',
				},
			},
		}],
		['query', {
			envKey: 'QUERY_SECRET',
			injection: {
				query: {
					name: 'api_key',
				},
			},
		}],
		['template', {
			envKey: 'TEMPLATE_SECRET',
			injection: {
				endpointTemplate: {
					slot: 'token',
				},
			},
		}],
		['oauth', oauthCredentialDefinition],
		['oauth-cache', oauthCredentialDefinition],
		['oauth-concurrent', oauthCredentialDefinition],
		['oauth-malformed', oauthCredentialDefinition],
		['oauth-rotation', oauthCredentialDefinition],
		['oauth-config-rotation', oauthCredentialDefinition],
		['oauth-failure', oauthCredentialDefinition],
	]),
}))

vi.mock('$/sources/index.server.ts', () => ({
	httpProxyBindingByProxyId: new Map<string, {
		endpoints: {
			endpointKind: string
			locator: string
		}[]
		wireProtocol?: string
	}>([
		['header', {
			endpoints: [{
				endpointKind: 'HttpUrl',
				locator: 'https://api.example.test/v1',
			}],
		}],
		['query', {
			endpoints: [{
				endpointKind: 'HttpUrl',
				locator: 'https://api.example.test/v1',
			}],
		}],
		['template', {
			endpoints: [{
				endpointKind: 'HttpUrl',
				locator: 'https://api.example.test/tenant/{token}/v1',
			}],
		}],
		['fallback', {
			endpoints: [
				{
					endpointKind: 'HttpUrl',
					locator: 'https://primary.example.test/v1',
				},
				{
					endpointKind: 'HttpUrl',
					locator: 'https://fallback.example.test/api',
				},
			],
		}],
		['json-rpc', {
			endpoints: [{
				endpointKind: 'HttpUrl',
				locator: 'https://rpc.example.test',
			}],
			wireProtocol: 'JsonRpc2',
		}],
		['other', {
			endpoints: [{
				endpointKind: 'HttpUrl',
				locator: 'https://other.example.test/v1',
			}],
		}],
		['oauth', {
			endpoints: [{
				endpointKind: 'HttpUrl',
				locator: 'https://oauth-api.example.test',
			}],
		}],
		['oauth-cache', {
			endpoints: [{
				endpointKind: 'HttpUrl',
				locator: 'https://oauth-api.example.test',
			}],
		}],
		['oauth-rotation', {
			endpoints: [{
				endpointKind: 'HttpUrl',
				locator: 'https://oauth-api.example.test',
			}],
		}],
		['oauth-config-rotation', {
			endpoints: [{
				endpointKind: 'HttpUrl',
				locator: 'https://oauth-api.example.test',
			}],
		}],
		['oauth-concurrent', {
			endpoints: [{
				endpointKind: 'HttpUrl',
				locator: 'https://oauth-api.example.test',
			}],
		}],
		['oauth-malformed', {
			endpoints: [{
				endpointKind: 'HttpUrl',
				locator: 'https://oauth-api.example.test',
			}],
		}],
		['oauth-failure', {
			endpoints: [{
				endpointKind: 'HttpUrl',
				locator: 'https://oauth-api.example.test',
			}],
		}],
	]),
}))

import { proxySourceHttpRequest } from '$/sources/_runtime/proxy.server.ts'

const proxyEvent = (
	proxyId: string,
	endpointIndex: number,
	upstreamUrl: string,
	upstream: Response = new Response('ok'),
	headers?: HeadersInit
) => {
	const url = new URL(
		`http://localhost/api-proxy/${encodeURIComponent(proxyId)}/${endpointIndex}/${encodeURIComponent(upstreamUrl)}`
	)
	return {
		event: {
			url,
			request: new Request(url, {
				headers,
			}),
			fetch: vi.fn().mockResolvedValue(upstream),
		},
	}
}

describe('runtime secret proxy', () => {
	beforeEach(() => {
		privateEnv.OAUTH_CLIENT_ID = 'oauth-client'
		privateEnv.OAUTH_CLIENT_SECRET = 'oauth-secret'
		vi.restoreAllMocks()
	})

	it('replaces spoofed protected headers and applies the configured prefix', async () => {
		const { event } = proxyEvent(
			'header',
			0,
			'https://api.example.test/v1/blocks',
			new Response('ok'),
			{
				Authorization: 'Bearer client-secret',
				Cookie: 'session=client-secret',
				'X-Api-Key': 'client-secret',
			}
		)

		await proxySourceHttpRequest(event)

		const headers = event.fetch.mock.calls[0]?.[1]?.headers as Headers
		expect(headers.get('Authorization')).toBe('Bearer header-secret')
		expect(headers.has('Cookie')).toBe(false)
		expect(headers.has('X-Api-Key')).toBe(false)
	})

	it('deduplicates query credentials before injection', async () => {
		const { event } = proxyEvent(
			'query',
			0,
			'https://api.example.test/v1/blocks?api_key=first&api_key=second&limit=1'
		)

		await proxySourceHttpRequest(event)

		const url = event.fetch.mock.calls[0]?.[0] as URL
		expect(url.searchParams.getAll('api_key')).toEqual(['query secret'])
		expect(url.searchParams.get('limit')).toBe('1')
	})

	it('encodes endpoint-template credentials exactly once', async () => {
		const { event } = proxyEvent(
			'template',
			0,
			'https://api.example.test/tenant/{token}/v1/blocks'
		)

		await proxySourceHttpRequest(event)

		expect(String(event.fetch.mock.calls[0]?.[0]))
			.toBe('https://api.example.test/tenant/template%2Fsecret/v1/blocks')
	})

	it('performs the OAuth client-credentials grant server-side and replaces spoofed authorization', async () => {
		const { event } = proxyEvent(
			'oauth',
			0,
			'https://oauth-api.example.test/r/ethereum/hot',
			undefined,
			{
				Authorization: 'Bearer browser-spoof',
				'User-Agent': 'browser-spoof',
				'X-Api-Key': 'browser-spoof',
			}
		)
		event.fetch
			.mockReset()
			.mockResolvedValueOnce(new Response(JSON.stringify({
				access_token: 'server-access-token',
				expires_in: 3_600,
			}), {
				headers: {
					'Content-Type': 'application/json',
				},
			}))
			.mockResolvedValueOnce(new Response('ok'))

		await expect(proxySourceHttpRequest(event)).resolves.toBeInstanceOf(Response)

		const tokenRequest = new Request(event.fetch.mock.calls[0]?.[0], event.fetch.mock.calls[0]?.[1])
		expect(tokenRequest.url).toBe('https://identity.example.test/oauth/token')
		expect(tokenRequest.method).toBe('POST')
		expect(tokenRequest.headers.get('Authorization'))
			.toBe('Basic b2F1dGgtY2xpZW50Om9hdXRoLXNlY3JldA==')
		expect(tokenRequest.headers.get('Content-Type'))
			.toBe('application/x-www-form-urlencoded')
		expect(tokenRequest.headers.get('User-Agent'))
			.toBe('Blockhead/1.0.0 (+https://blockhead.vision) by /u/blockhead')
		expect(await tokenRequest.text()).toBe('grant_type=client_credentials')

		const apiRequest = new Request(event.fetch.mock.calls[1]?.[0], event.fetch.mock.calls[1]?.[1])
		expect(apiRequest.headers.get('Authorization')).toBe('Bearer server-access-token')
		expect(apiRequest.headers.get('User-Agent'))
			.toBe('Blockhead/1.0.0 (+https://blockhead.vision) by /u/blockhead')
		expect(apiRequest.headers.has('X-Api-Key')).toBe(false)
		expect([
			event.url.href,
			JSON.stringify([...event.request.headers]),
			await event.request.clone().text(),
		].join('\n')).not.toMatch(/oauth-client|oauth-secret|server-access-token/)
	})

	it('deduplicates concurrent OAuth grants for one binding and credential set', async () => {
		let releaseGrant: (() => void) | undefined
		const grantReleased = new Promise<void>((resolve) => {
			releaseGrant = resolve
		})
		const first = proxyEvent('oauth-concurrent', 0, 'https://oauth-api.example.test/api/one')
		const second = proxyEvent('oauth-concurrent', 0, 'https://oauth-api.example.test/api/two')
		for (const event of [first.event, second.event]) {
			event.fetch.mockReset().mockImplementationOnce(async () => {
				await grantReleased
				return new Response(JSON.stringify({ access_token: 'shared-token' }))
			}).mockResolvedValueOnce(new Response('ok'))
		}

		const firstRequest = proxySourceHttpRequest(first.event)
		const secondRequest = proxySourceHttpRequest(second.event)
		releaseGrant?.()
		await Promise.all([firstRequest, secondRequest])

		expect(first.event.fetch).toHaveBeenCalledTimes(2)
		expect(second.event.fetch).toHaveBeenCalledTimes(1)
		expect(new Headers(second.event.fetch.mock.calls[0]?.[1]?.headers).get('Authorization'))
			.toBe('Bearer shared-token')
	})

	it('fails closed on malformed OAuth JSON and does not cache the failure', async () => {
		const failed = proxyEvent('oauth-malformed', 0, 'https://oauth-api.example.test/api/info')
		failed.event.fetch.mockReset().mockResolvedValueOnce(new Response('{'))
		await expect(proxySourceHttpRequest(failed.event)).rejects.toMatchObject({ status: 502 })

		const retry = proxyEvent('oauth-malformed', 0, 'https://oauth-api.example.test/api/info')
		retry.event.fetch.mockReset()
			.mockResolvedValueOnce(new Response(JSON.stringify({ access_token: 'after-malformed' })))
			.mockResolvedValueOnce(new Response('ok'))
		await expect(proxySourceHttpRequest(retry.event)).resolves.toBeInstanceOf(Response)
		expect(retry.event.fetch).toHaveBeenCalledTimes(2)
	})

	it('reuses OAuth access tokens only until the runtime-owned default expiry skew', async () => {
		vi.spyOn(Date, 'now').mockReturnValue(100_000)
		const first = proxyEvent(
			'oauth-cache',
			0,
			'https://oauth-api.example.test/api/info'
		)
		first.event.fetch
			.mockReset()
			.mockResolvedValueOnce(new Response(JSON.stringify({
				access_token: 'cached-access-token',
			}), {
				headers: {
					'Content-Type': 'application/json',
				},
			}))
			.mockResolvedValueOnce(new Response('first'))
		await proxySourceHttpRequest(first.event)
		expect(first.event.fetch).toHaveBeenCalledTimes(2)

		vi.mocked(Date.now).mockReturnValue(3_694_999)
		const cached = proxyEvent(
			'oauth-cache',
			0,
			'https://oauth-api.example.test/api/info'
		)
		await proxySourceHttpRequest(cached.event)
		expect(cached.event.fetch).toHaveBeenCalledTimes(1)
		expect(new Headers(cached.event.fetch.mock.calls[0]?.[1]?.headers).get('Authorization'))
			.toBe('Bearer cached-access-token')

		vi.mocked(Date.now).mockReturnValue(3_695_000)
		const expired = proxyEvent(
			'oauth-cache',
			0,
			'https://oauth-api.example.test/api/info'
		)
		expired.event.fetch
			.mockReset()
			.mockResolvedValueOnce(new Response(JSON.stringify({
				access_token: 'refreshed-access-token',
			}), {
				headers: {
					'Content-Type': 'application/json',
				},
			}))
			.mockResolvedValueOnce(new Response('expired'))
		await proxySourceHttpRequest(expired.event)
		expect(expired.event.fetch).toHaveBeenCalledTimes(2)
		expect(new Headers(expired.event.fetch.mock.calls[1]?.[1]?.headers).get('Authorization'))
			.toBe('Bearer refreshed-access-token')
	})

	it('invalidates the OAuth cache when private credentials rotate', async () => {
		const first = proxyEvent(
			'oauth-rotation',
			0,
			'https://oauth-api.example.test/api/info'
		)
		first.event.fetch
			.mockReset()
			.mockResolvedValueOnce(new Response(JSON.stringify({
				access_token: 'first-rotation-token',
				expires_in: 3_600,
			}), {
				headers: {
					'Content-Type': 'application/json',
				},
			}))
			.mockResolvedValueOnce(new Response('first'))
		await proxySourceHttpRequest(first.event)

		privateEnv.OAUTH_CLIENT_SECRET = 'rotated-secret'
		const rotated = proxyEvent(
			'oauth-rotation',
			0,
			'https://oauth-api.example.test/api/info'
		)
		rotated.event.fetch
			.mockReset()
			.mockResolvedValueOnce(new Response(JSON.stringify({
				access_token: 'second-rotation-token',
				expires_in: 3_600,
			}), {
				headers: {
					'Content-Type': 'application/json',
				},
			}))
			.mockResolvedValueOnce(new Response('rotated'))
		await proxySourceHttpRequest(rotated.event)

		expect(rotated.event.fetch).toHaveBeenCalledTimes(2)
		expect(new Request(
			rotated.event.fetch.mock.calls[0]?.[0],
			rotated.event.fetch.mock.calls[0]?.[1]
		).headers.get('Authorization')).not.toBe(
			'Basic b2F1dGgtY2xpZW50Om9hdXRoLXNlY3JldA=='
		)
		expect(new Headers(rotated.event.fetch.mock.calls[1]?.[1]?.headers).get('Authorization'))
			.toBe('Bearer second-rotation-token')
	})

	it('invalidates the OAuth cache when server OAuth configuration rotates', async () => {
		const first = proxyEvent('oauth-config-rotation', 0, 'https://oauth-api.example.test/api/info')
		first.event.fetch
			.mockReset()
			.mockResolvedValueOnce(new Response(JSON.stringify({ access_token: 'old-config-token' })))
			.mockResolvedValueOnce(new Response('first'))
		await proxySourceHttpRequest(first.event)

		oauthCredentialDefinition.oauthClientCredentials.tokenEndpoint = 'https://identity-rotated.example.test/oauth/token'
		const rotated = proxyEvent('oauth-config-rotation', 0, 'https://oauth-api.example.test/api/info')
		rotated.event.fetch
			.mockReset()
			.mockResolvedValueOnce(new Response(JSON.stringify({ access_token: 'new-config-token' })))
			.mockResolvedValueOnce(new Response('rotated'))
		await proxySourceHttpRequest(rotated.event)

		expect(rotated.event.fetch).toHaveBeenCalledTimes(2)
		expect(String(rotated.event.fetch.mock.calls[0]?.[0])).toBe('https://identity-rotated.example.test/oauth/token')
		oauthCredentialDefinition.oauthClientCredentials.tokenEndpoint = 'https://identity.example.test/oauth/token'
	})

	it('fails closed on OAuth exchange errors, avoids poisoning the cache, and redacts every credential form', async () => {
		const failed = proxyEvent(
			'oauth-failure',
			0,
			'https://oauth-api.example.test/api/info'
		)
		failed.event.fetch
			.mockReset()
			.mockResolvedValueOnce(new Response(
				'oauth-secret Basic b2F1dGgtY2xpZW50Om9hdXRoLXNlY3JldA==',
				{ status: 401 }
			))

		await expect(proxySourceHttpRequest(failed.event)).rejects.toMatchObject({
			status: 502,
			body: {
				message: 'Proxy OAuth credential exchange failed.',
			},
		})
		expect(failed.event.fetch).toHaveBeenCalledTimes(1)

		const retried = proxyEvent(
			'oauth-failure',
			0,
			'https://oauth-api.example.test/api/info'
		)
		retried.event.fetch
			.mockReset()
			.mockResolvedValueOnce(new Response(JSON.stringify({
				access_token: 'recovered-access-token',
				expires_in: 3_600,
			}), {
				headers: {
					'Content-Type': 'application/json',
				},
			}))
			.mockResolvedValueOnce(new Response(
				'oauth-secret Basic b2F1dGgtY2xpZW50Om9hdXRoLXNlY3JldA== Bearer recovered-access-token',
				{
					headers: {
						'Content-Type': 'text/plain',
						'X-Upstream-Diagnostic': 'oauth-secret recovered-access-token',
					},
				}
			))

		const response = await proxySourceHttpRequest(retried.event)

		expect(response.headers.has('X-Upstream-Diagnostic')).toBe(false)
		expect(await response.text()).toBe('[redacted] [redacted] Bearer [redacted]')
		expect(retried.event.fetch).toHaveBeenCalledTimes(2)
	})

	it('fails over transient failures within one credential-free binding', async () => {
		const { event } = proxyEvent(
			'fallback',
			0,
			'https://primary.example.test/v1/blocks?height=latest'
		)
		event.request = new Request(event.url, {
			method: 'POST',
			body: '{"jsonrpc":"2.0"}',
		})
		event.fetch
			.mockResolvedValueOnce(new Response('upstream unavailable', { status: 502 }))
			.mockResolvedValueOnce(new Response('{"result":"0x1"}', {
				status: 200,
				headers: {
					'Content-Type': 'application/json',
				},
			}))

		const response = await proxySourceHttpRequest(event)

		expect(response.status).toBe(200)
		expect(await response.text()).toBe('{"result":"0x1"}')
		expect(event.fetch).toHaveBeenCalledTimes(2)
		expect(String(event.fetch.mock.calls[1]?.[0]))
			.toBe('https://fallback.example.test/api/blocks?height=latest')
		for (const call of event.fetch.mock.calls) {
			const request = new Request(call[0], call[1])
			expect(request.method).toBe('POST')
			expect(await request.text()).toBe('{"jsonrpc":"2.0"}')
			expect(request.headers.has('Host')).toBe(false)
		}
		expect(event.fetch.mock.calls[0]?.[1]?.signal)
			.toBeInstanceOf(AbortSignal)
	})

	it.each([302, 408, 425, 429, 502])('does not reuse a discarded %s response when the final endpoint throws', async (status) => {
		const { event } = proxyEvent(
			'fallback',
			0,
			'https://primary.example.test/v1/blocks'
		)
		event.fetch
			.mockResolvedValueOnce(new Response('discarded upstream body', { status }))
			.mockRejectedValueOnce(new Error('terminal transport failure'))

		await expect(proxySourceHttpRequest(event)).rejects.toMatchObject({
			status: 502,
			body: { message: 'Proxy upstream request failed.' },
		})
		expect(event.fetch).toHaveBeenCalledTimes(2)
	})

	it('forwards proxied JSON-RPC bodies as application/json', async () => {
		const { event } = proxyEvent(
			'json-rpc',
			0,
			'https://rpc.example.test',
			new Response(JSON.stringify({
				jsonrpc: '2.0',
				id: 1,
				result: '0x1',
			}))
		)
		const body = JSON.stringify({
			jsonrpc: '2.0',
			id: 1,
			method: 'eth_getCode',
			params: [
				'0x0000000000000000000000000000000000000000',
				'latest',
			],
		})
		event.request = new Request(event.url, {
			method: 'POST',
			headers: {
				'Content-Type': 'text/plain',
			},
			body,
		})

		await proxySourceHttpRequest(event)

		const upstreamRequest = new Request(
			event.fetch.mock.calls[0]?.[0],
			event.fetch.mock.calls[0]?.[1]
		)
		expect(upstreamRequest.headers.get('Content-Type')).toBe('application/json')
		expect(await upstreamRequest.text()).toBe(body)
	})

	it.each([
		['unknown proxy identity', 'missing', 0, 'https://api.example.test/v1'],
		['wrong endpoint index', 'header', 1, 'https://api.example.test/v1'],
		['origin owned by another binding', 'header', 0, 'https://other.example.test/v1'],
		['wrong locator', 'header', 0, 'https://api.example.test/v2'],
	])('fails closed for %s', async (_label, proxyId, endpointIndex, upstreamUrl) => {
		const { event } = proxyEvent(proxyId, endpointIndex, upstreamUrl)

		await expect(proxySourceHttpRequest(event)).rejects.toMatchObject({ status: 403 })
		expect(event.fetch).not.toHaveBeenCalled()
	})

	it('fails closed when the runtime secret is blank', async () => {
		privateEnv.HEADER_SECRET = ' '
		const { event } = proxyEvent('header', 0, 'https://api.example.test/v1')

		await expect(proxySourceHttpRequest(event)).rejects.toMatchObject({ status: 502 })
		expect(event.fetch).not.toHaveBeenCalled()
		privateEnv.HEADER_SECRET = 'header-secret'
	})

	it('redacts transport failure diagnostics instead of exposing upstream errors', async () => {
		const { event } = proxyEvent(
			'header',
			0,
			'https://api.example.test/v1',
		)
		event.fetch.mockRejectedValue(new Error('upstream saw header-secret and client token'))

		await expect(proxySourceHttpRequest(event)).rejects.toMatchObject({
			status: 502,
			body: {
				message: 'Proxy upstream request failed.',
			},
		})
	})

	it('keeps injected secret material out of local responses and request URLs', async () => {
		const { event } = proxyEvent(
			'header',
			0,
			'https://api.example.test/v1',
			new Response('upstream echoed header-secret', {
				headers: {
					'Content-Type': 'text/plain',
					'X-Upstream-Diagnostic': 'header-secret',
				},
			})
		)

		const response = await proxySourceHttpRequest(event)

		expect(await response.text()).toBe('upstream echoed [redacted]')
		expect(response.headers.has('X-Upstream-Diagnostic')).toBe(false)
		expect(event.url.href).not.toContain('header-secret')
	})

	it.each([301, 302, 307, 308])('rejects upstream %s redirects without forwarding Location', async (status) => {
		const { event } = proxyEvent(
			'header',
			0,
			'https://api.example.test/v1',
			new Response(null, {
				status,
				headers: {
					Location: 'https://redirect.example/header-secret',
				},
			})
		)

		const response = await proxySourceHttpRequest(event)

		expect(response.status).toBe(502)
		expect(response.headers.has('Location')).toBe(false)
		expect(await response.text()).not.toContain('header-secret')
		expect(event.url.href).not.toContain('header-secret')
		expect(event.fetch.mock.calls[0]?.[1]).toMatchObject({ redirect: 'manual' })
	})
})
