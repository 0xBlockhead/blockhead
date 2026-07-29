import { error, type RequestEvent } from '@sveltejs/kit'
import { env as privateEnv } from '$env/dynamic/private'

import sourceServerCredentialsById from '$/sources/$sourceServerCredentials.server.ts'
import {
	SourceEndpointKind,
	type SourceServerCredentialDefinition,
} from '$/sources/SourceBinding.ts'
import {
	httpProxyBindingByProxyId,
	httpProxyOrigins,
} from '$/sources/index.server.ts'

const PROXY_UPSTREAM_TIMEOUT_MS = 30_000

export const proxySourceHttpRequest = async (
	event: Pick<RequestEvent, 'fetch' | 'request' | 'url'>
): Promise<Response> => {
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
		}
		| undefined
	if (credential == null)
		credentialDefinition = undefined
	else {
		const secret = privateEnv[credential.envKey]?.trim()
		if (secret == null || secret === '')
			throw error(502, 'Proxy credential unavailable.')

		credentialDefinition = {
			definition: credential,
			secret,
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
		!httpProxyOrigins.has(url.origin)
		|| url.origin !== endpoint.origin
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
	if (credentialDefinition?.definition.injection.header != null) {
		requestHeaders.delete(credentialDefinition.definition.injection.header.name)
		requestHeaders.set(
			credentialDefinition.definition.injection.header.name,
			`${credentialDefinition.definition.injection.header.prefix ?? ''}${credentialDefinition.secret}`
		)
	}
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
				binding.endpoints.filter((candidate) => candidate !== endpoint)
			:
				[]
		),
	]
	const candidateTimeoutMs = Math.max(
		1_000,
		Math.floor(PROXY_UPSTREAM_TIMEOUT_MS / candidateEndpoints.length)
	)
	for (const [candidateIndex, candidateEndpoint] of candidateEndpoints.entries()) {
		if (
			candidateEndpoint.endpointKind !== SourceEndpointKind.HttpUrl
			|| candidateEndpoint.origin == null
			|| !httpProxyOrigins.has(candidateEndpoint.origin)
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
			if (value.includes(credentialDefinition.secret))
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
			(await upstream.text()).replaceAll(credentialDefinition.secret, '[redacted]')
		:
			upstream.body

	return new Response(body, {
		status: upstream.status === 403 ? 502 : upstream.status,
		statusText: upstream.statusText,
		headers: responseHeaders,
	})
}
