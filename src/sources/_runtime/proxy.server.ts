import { Buffer } from 'node:buffer'
import { createHash } from 'node:crypto'

import { error, type RequestEvent } from '@sveltejs/kit'
import { env as privateEnv } from '$env/dynamic/private'
import { type as arktype } from 'arktype'

import sourceServerCredentialsById from '$/sources/$sourceServerCredentials.server.ts'
import {
	SourceEndpointKind,
	sourceEndpointOrigin,
	type SourceServerCredentialDefinition,
	WireProtocol,
} from '$/sources/SourceBinding.ts'
import {
	httpProxyBindingByProxyId,
} from '$/sources/index.server.ts'

const PROXY_UPSTREAM_TIMEOUT_MS = 30_000
const OAUTH_CLIENT_CREDENTIALS_DEFAULT_EXPIRES_IN_SECONDS = 3_600
const OAUTH_CLIENT_CREDENTIALS_EXPIRY_SKEW_MS = 5_000

const oauthClientCredentialsTokenResponseWire = arktype({
	access_token: 'string > 0',
	'expires_in?': 'number.integer > 0',
})

const oauthAccessTokenPromiseByProxyId = new Map<string, Promise<{
	credentialFingerprint: string
	accessToken: string
	expiresAtMs: number
}>>()

const oauthAccessTokenFor = async ({
	fetch,
	proxyId,
	definition,
	clientId,
	clientSecret,
	basicAuthorization,
}: {
	fetch: RequestEvent['fetch']
	proxyId: string
	definition: NonNullable<SourceServerCredentialDefinition['oauthClientCredentials']>
	clientId: string
	clientSecret: string
	basicAuthorization: string
}) => {
	const credentialFingerprint = createHash('sha256')
		.update(clientId)
		.update('\0')
		.update(clientSecret)
		.update('\0')
		.update(definition.tokenEndpoint)
		.update('\0')
		.update(definition.userAgent ?? '')
		.digest('base64url')
	const cachedAccessTokenPromise = oauthAccessTokenPromiseByProxyId.get(proxyId)
	if (cachedAccessTokenPromise != null) {
		try {
			const cachedAccessToken = await cachedAccessTokenPromise
			if (
				cachedAccessToken.credentialFingerprint === credentialFingerprint
				&& cachedAccessToken.expiresAtMs > Date.now()
			)
				return cachedAccessToken.accessToken
		} catch {
			if (oauthAccessTokenPromiseByProxyId.get(proxyId) === cachedAccessTokenPromise)
				oauthAccessTokenPromiseByProxyId.delete(proxyId)
		}
	}

	const accessTokenPromise = (async () => {
		const tokenEndpoint = new URL(definition.tokenEndpoint)
		if (tokenEndpoint.protocol !== 'https:')
			throw new Error('OAuth token endpoint must use HTTPS')

		const response = await fetch(tokenEndpoint, {
			method: 'POST',
			headers: {
				Authorization: basicAuthorization,
				'Content-Type': 'application/x-www-form-urlencoded',
				...(definition.userAgent != null && {
					'User-Agent': definition.userAgent,
				}),
			},
			body: new URLSearchParams({
				grant_type: 'client_credentials',
			}),
			redirect: 'manual',
			signal: AbortSignal.timeout(PROXY_UPSTREAM_TIMEOUT_MS),
		})
		if (!response.ok)
			throw new Error('OAuth token exchange failed')

		const tokenResponse = oauthClientCredentialsTokenResponseWire.assert(await response.json())
		return {
			credentialFingerprint,
			accessToken: tokenResponse.access_token,
			expiresAtMs: (
				Date.now()
				+ (tokenResponse.expires_in ?? OAUTH_CLIENT_CREDENTIALS_DEFAULT_EXPIRES_IN_SECONDS) * 1_000
				- OAUTH_CLIENT_CREDENTIALS_EXPIRY_SKEW_MS
			),
		}
	})()
	oauthAccessTokenPromiseByProxyId.set(proxyId, accessTokenPromise)

	try {
		return (await accessTokenPromise).accessToken
	} catch {
		if (oauthAccessTokenPromiseByProxyId.get(proxyId) === accessTokenPromise)
			oauthAccessTokenPromiseByProxyId.delete(proxyId)

		throw error(502, 'Proxy OAuth credential exchange failed.')
	}
}

export const proxySourceHttpRequest = async (
	event: Pick<RequestEvent, 'fetch' | 'request' | 'url'>
) => {
	const segments = event.url.pathname
		.replace('/api-proxy/', '')
		.split('/')
	if (
		segments.length !== 3
		|| event.url.search !== ''
	)
		throw error(403, 'Request Forbidden.')

	const [proxyIdSegment, endpointIndexSegment, upstreamUrlSegment] = segments
	const proxyId = decodeURIComponent(proxyIdSegment)
	const endpointIndex = Number(endpointIndexSegment)
	const binding = httpProxyBindingByProxyId.get(proxyId)
	if (binding == null || !Number.isSafeInteger(endpointIndex))
		throw error(403, 'Request Forbidden.')
	const credential = sourceServerCredentialsById.get(proxyId)

	const endpoint = binding.endpoints.at(endpointIndex)
	if (endpoint == null)
		throw error(403, 'Request Forbidden.')

	let credentialDefinition:
		| {
			definition: SourceServerCredentialDefinition
			secret: string
			redactValues: readonly string[]
		}
		| undefined
	if (credential == null)
		credentialDefinition = undefined
	else {
		const secret = privateEnv[credential.envKey]?.trim()
		if (secret == null || secret === '')
			throw error(502, 'Proxy credential unavailable.')

		if (credential.oauthClientCredentials == null)
			credentialDefinition = {
				definition: credential,
				secret,
				redactValues: [secret],
			}
		else {
			const clientId = privateEnv[credential.oauthClientCredentials.clientIdEnvKey]?.trim()
			if (clientId == null || clientId === '')
				throw error(502, 'Proxy credential unavailable.')

			const basicAuthorization = `Basic ${Buffer.from(`${clientId}:${secret}`).toString('base64')}`
			const accessToken = await oauthAccessTokenFor({
				fetch: event.fetch,
				proxyId,
				definition: credential.oauthClientCredentials,
				clientId,
				clientSecret: secret,
				basicAuthorization,
			})
			credentialDefinition = {
				definition: credential,
				secret: accessToken,
				redactValues: [
					secret,
					basicAuthorization,
					accessToken,
				],
			}
		}
	}

	let upstreamUrl = decodeURIComponent(upstreamUrlSegment)
	if (credentialDefinition?.definition.injection.endpointTemplate != null) {
		const placeholder = `{${credentialDefinition.definition.injection.endpointTemplate.slot}}`
		if (
			endpoint.locator.split(placeholder).length !== 2
			|| upstreamUrl.split(placeholder).length !== 2
			|| !upstreamUrl.startsWith(endpoint.locator.slice(0, endpoint.locator.indexOf(placeholder)))
			)
			throw error(403, 'Request Forbidden.')

		upstreamUrl = upstreamUrl.replace(
			placeholder,
			encodeURIComponent(credentialDefinition.secret)
		)
	}

	const url = new URL(upstreamUrl)
	const locatorUrl = new URL(endpoint.locator)

	if (
		url.origin !== sourceEndpointOrigin(endpoint)
		|| (
			credentialDefinition?.definition.injection.endpointTemplate == null
			&& (
				url.pathname !== locatorUrl.pathname
				&& !url.pathname.startsWith(
					locatorUrl.pathname.endsWith('/') ? locatorUrl.pathname : `${locatorUrl.pathname}/`
				)
			)
		)
	)
		throw error(403, 'Request Forbidden.')

	const requestHeaders = new Headers(event.request.headers)
	for (const header of [
		'authorization',
		'connection',
		'cookie',
		'host',
		'proxy-authorization',
		'x-api-key',
	])
		requestHeaders.delete(header)
	requestHeaders.delete('accept-encoding')
	if (binding.wireProtocol === WireProtocol.JsonRpc2)
		requestHeaders.set('content-type', 'application/json')
	if (credentialDefinition?.definition.injection.header != null) {
		requestHeaders.delete(credentialDefinition.definition.injection.header.name)
		requestHeaders.set(
			credentialDefinition.definition.injection.header.name,
			`${credentialDefinition.definition.injection.header.prefix ?? ''}${credentialDefinition.secret}`
		)
	}
	if (credentialDefinition?.definition.oauthClientCredentials?.userAgent != null)
		requestHeaders.set('user-agent', credentialDefinition.definition.oauthClientCredentials.userAgent)

	if (credentialDefinition?.definition.injection.query != null) {
		url.searchParams.delete(credentialDefinition.definition.injection.query.name)
		url.searchParams.set(
			credentialDefinition.definition.injection.query.name,
			credentialDefinition.secret
		)
	}

	const locatorPath = locatorUrl.pathname.endsWith('/') ?
		locatorUrl.pathname.slice(0, -1)
	:
		locatorUrl.pathname
	const relativePath = url.pathname.slice(locatorPath.length)
	const requestBody = event.request.body == null ?
		undefined
	:
		await event.request.arrayBuffer()
	let upstream: Response | undefined
	let upstreamError: unknown
	const candidateEndpoints = [
		endpoint,
		...(
				credentialDefinition == null ?
				[...binding.endpoints].filter((candidate) => candidate !== endpoint)
			:
				[]
		),
	]
	const candidateTimeoutMs = Math.max(
		1_000,
		Math.floor(PROXY_UPSTREAM_TIMEOUT_MS / candidateEndpoints.length)
	)
	for (const [candidateIndex, candidateEndpoint] of candidateEndpoints.entries()) {
		const candidateOrigin = sourceEndpointOrigin(candidateEndpoint)
		if (
			candidateEndpoint.endpointKind !== SourceEndpointKind.HttpUrl
			|| candidateOrigin == null
		)
			continue

		const candidateUrl = candidateEndpoint === endpoint ?
			new URL(url)
		:
			new URL(candidateEndpoint.locator)
		if (candidateEndpoint !== endpoint) {
			candidateUrl.pathname = `${
				candidateUrl.pathname.endsWith('/') ?
					candidateUrl.pathname.slice(0, -1)
				:
					candidateUrl.pathname
			}${relativePath}`
			candidateUrl.search = url.search
		}
		const headers = new Headers(requestHeaders)

		try {
			upstream = await event.fetch(candidateUrl, {
				method: event.request.method,
				headers,
				body: requestBody,
				cache: event.request.cache,
				redirect: 'manual',
				signal: AbortSignal.timeout(candidateTimeoutMs),
				...(requestBody != null && {
					duplex: 'half',
				}),
			})
		} catch (error) {
			upstreamError = error
			continue
		}

		if (
			(upstream.status >= 300 && upstream.status < 400)
			|| upstream.status === 408
			|| upstream.status === 425
			|| upstream.status === 429
			|| upstream.status >= 500
		) {
			if (candidateIndex < candidateEndpoints.length - 1)
				await upstream.body?.cancel()
			continue
		}

		break
	}
	if (upstream == null)
		throw upstreamError ?? new Error('Proxy upstream unavailable.')
	if (upstream.status >= 300 && upstream.status < 400)
		return new Response('Upstream redirect rejected.', { status: 502 })

	const responseHeaders = new Headers(upstream.headers)
	responseHeaders.delete('content-encoding')
	responseHeaders.delete('content-length')
	responseHeaders.delete('transfer-encoding')
	if (credentialDefinition != null)
		for (const [header, value] of responseHeaders)
			if (credentialDefinition.redactValues.some((redactValue) => value.includes(redactValue)))
				responseHeaders.delete(header)

	const contentType = upstream.headers.get('content-type') ?? ''
	const body = (
			credentialDefinition != null
			&& (
				contentType.startsWith('text/')
				|| contentType.includes('json')
			|| contentType.includes('xml')
			)
		) ?
			credentialDefinition.redactValues.reduce(
				(redactedBody, redactValue) => redactedBody.replaceAll(redactValue, '[redacted]'),
				await upstream.text()
			)
		:
			upstream.body

	return new Response(body, {
		status: upstream.status === 403 ? 502 : upstream.status,
		statusText: upstream.statusText,
		headers: responseHeaders,
	})
}
