import { error, type RequestEvent } from '@sveltejs/kit'
import { env as privateEnv } from '$env/dynamic/private'

import { sourceServerCredentialsById } from '$/sources/$sourceServerCredentials.server.ts'
import type { SourceServerCredentialDefinition } from '$/sources/SourceBinding.ts'
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
	const credentialDefinition = binding.serverCredentialId == null ?
		undefined
	:
		Object.entries<SourceServerCredentialDefinition>(sourceServerCredentialsById)
			.find(([serverCredentialId]) => serverCredentialId === binding.serverCredentialId)?.[1]

	const endpoint = binding.endpoints.at(endpointIndex)
	if (endpoint == null)
		throw error(403, 'Request Forbidden.')

	const secret = credentialDefinition == null ? undefined : privateEnv[credentialDefinition.envKey]?.trim()
	if (credentialDefinition != null && (secret == null || secret === ''))
		throw error(502, 'Proxy credential unavailable.')

	let upstreamUrl = decodeURIComponent(upstreamUrlSegment)
	if (credentialDefinition?.injection.endpointTemplate != null) {
		const placeholder = `{${credentialDefinition.injection.endpointTemplate.slot}}`
		if (
			endpoint.locator.split(placeholder).length !== 2
			|| upstreamUrl.split(placeholder).length !== 2
			|| !upstreamUrl.startsWith(endpoint.locator.slice(0, endpoint.locator.indexOf(placeholder)))
		)
			throw error(403, 'Request Forbidden.')

		upstreamUrl = upstreamUrl.replace(placeholder, encodeURIComponent(secret))
	}

	const url = new URL(upstreamUrl)
	const locatorUrl = new URL(endpoint.locator)

	if (
		!httpProxyOrigins.has(url.origin)
		|| url.origin !== endpoint.origin
		|| (
			credentialDefinition?.injection.endpointTemplate == null
			&& (
				url.pathname !== locatorUrl.pathname
				&& !url.pathname.startsWith(
					locatorUrl.pathname.endsWith('/') ? locatorUrl.pathname : `${locatorUrl.pathname}/`
				)
			)
		)
	)
		throw error(403, 'Request Forbidden.')

	const headers = new Headers(event.request.headers)
	for (const header of [
		'authorization',
		'connection',
		'cookie',
		'host',
		'proxy-authorization',
		'x-api-key',
	])
		headers.delete(header)
	headers.set('Host', url.host)
	headers.delete('accept-encoding')
	if (credentialDefinition?.injection.header != null) {
		headers.delete(credentialDefinition.injection.header.name)
		headers.set(
			credentialDefinition.injection.header.name,
			`${credentialDefinition.injection.header.prefix ?? ''}${secret}`
		)
	}
	if (credentialDefinition?.injection.query != null) {
		url.searchParams.delete(credentialDefinition.injection.query.name)
		url.searchParams.set(credentialDefinition.injection.query.name, secret)
	}

	const upstream = await event.fetch(url, {
		method: event.request.method,
		headers,
		body: event.request.body,
		cache: event.request.cache,
		redirect: 'manual',
		signal: AbortSignal.timeout(PROXY_UPSTREAM_TIMEOUT_MS),
		...(event.request.body != null && {
			duplex: 'half',
		}),
	})
	if (upstream.status >= 300 && upstream.status < 400)
		return new Response('Upstream redirect rejected.', { status: 502 })

	const responseHeaders = new Headers(upstream.headers)
	responseHeaders.delete('content-encoding')
	responseHeaders.delete('content-length')
	responseHeaders.delete('transfer-encoding')
	if (secret != null)
		for (const [header, value] of responseHeaders)
			if (value.includes(secret))
				responseHeaders.delete(header)

	const contentType = upstream.headers.get('content-type') ?? ''
	const body = (
		secret != null
		&& (
			contentType.startsWith('text/')
			|| contentType.includes('json')
			|| contentType.includes('xml')
		)
	) ?
		(await upstream.text()).replaceAll(secret, '[redacted]')
	:
		upstream.body

	return new Response(body, {
		status: upstream.status === 403 ? 502 : upstream.status,
		statusText: upstream.statusText,
		headers: responseHeaders,
	})
}
