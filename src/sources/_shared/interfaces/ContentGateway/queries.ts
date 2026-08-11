import { jsonErrorHintFromResponse } from '$/lib/http.ts'
import {
	sourceEndpointOrigin,
	type SourceBinding,
	type SourceEndpoint,
} from '$/sources/SourceBinding.ts'
import { sourceFetch } from '$/sources/_runtime/http.ts'
import {
	ContentGatewayFamily,
} from '$/sources/_shared/interfaces/ContentGateway/types.ts'


export const trimGatewayPathSlashes = (
	value: string
) => (
	value.replace(/^\/+|\/+$/g, '')
)


export const stripOptionalHexPrefix = (
	value: string
) => (
	value.toLowerCase().startsWith('0x') ?
		value.slice(2)
	:
		value
)


export const assertGatewayContentPath = ({
	family,
	contentPath,
}: {
	family: ContentGatewayFamily
	contentPath?: string
}) => {
	const trimmedPath = trimGatewayPathSlashes(contentPath?.trim() ?? '')
	if (/[\u0000-\u001f\u007f]/.test(trimmedPath))
		throw new Error(`${family}_Rest: content path contains control characters`)

	if (trimmedPath.split('/').some((segment) => segment === '.' || segment === '..'))
		throw new Error(`${family}_Rest: content path contains a traversal segment`)

	return trimmedPath
}


export type ContentGatewayBrowseResult = {
	gatewayOrigin: string
	gatewayUrl: string
	fileName?: string
	extension?: string
	contentType?: string
	contentLength?: number
	displayType: string
	isContentTypeInferred: boolean
	text?: string
}

type ContentGatewayBinding = SourceBinding & {
	endpoints: readonly SourceEndpoint[]
}


export const listDeclaredGatewayOrigins = (
	binding: ContentGatewayBinding
) => (
	binding.endpoints.flatMap((endpoint) => {
		const origin = sourceEndpointOrigin(endpoint)
		return origin == null ? [] : [origin]
	})
)


export const isGatewayEndpointReachable = async ({
	binding,
	endpoint,
	signal,
}: {
	binding: ContentGatewayBinding
	endpoint: SourceEndpoint
	signal?: AbortSignal
}) => {
	if (!binding.endpoints.includes(endpoint))
		throw new Error(`${binding.source}: gateway endpoint is not owned by the selected binding`)

	try {
		const headResponse = await sourceFetch(binding, endpoint.locator, {
			method: 'HEAD',
			signal,
		})
		if (headResponse.ok)
			return true

		// Some public gateways reject or withhold HEAD; a cheap GET proves the origin is up.
		if (
			headResponse.status === 405
			|| headResponse.status === 501
			|| headResponse.status === 403
		) {
			return (
				await sourceFetch(binding, endpoint.locator, {
					method: 'GET',
					signal,
				})
			).ok
		}

		return false
	} catch {
		try {
			return (
				await sourceFetch(binding, endpoint.locator, {
					method: 'GET',
					signal,
				})
			).ok
		} catch {
			return false
		}
	}
}


export const fetchOrderedGatewayContent = async ({
	binding,
	family,
	buildGatewayUrl,
	fileNameFromGatewayUrl,
	signal,
}: {
	binding: ContentGatewayBinding
	family: ContentGatewayFamily
	buildGatewayUrl: (gatewayOrigin: string) => string
	fileNameFromGatewayUrl?: (gatewayUrl: string) => string | undefined
	signal?: AbortSignal
}): Promise<ContentGatewayBrowseResult & {
	endpoint: SourceEndpoint
}> => {
	const failures: string[] = []

	for (const endpoint of binding.endpoints) {
		const gatewayOrigin = sourceEndpointOrigin(endpoint)
		if (gatewayOrigin == null) {
			failures.push(`${endpoint.locator}: missing HTTP origin`)
			continue
		}

		const gatewayUrl = buildGatewayUrl(gatewayOrigin)

		let response: Response
		try {
			response = await sourceFetch(binding, gatewayUrl, { signal })
		} catch (error) {
			failures.push(`${endpoint.locator}: ${error instanceof Error ? error.message : String(error)}`)
			continue
		}

		if (!response.ok) {
			const hint = await jsonErrorHintFromResponse(response)
			failures.push(
				hint ?
					`${endpoint.locator} (${response.status}): ${hint}`
				:
					`${endpoint.locator} (${response.status} ${response.statusText})`
			)
			continue
		}

		const { parseContentResponse } = await import('$/sources/contentResponse.ts')
		const parsedContent = await parseContentResponse({
			response,
			fileName: fileNameFromGatewayUrl?.(gatewayUrl),
		})

		return {
			endpoint,
			gatewayOrigin,
			gatewayUrl,
			fileName: parsedContent.fileName,
			extension: parsedContent.extension,
			contentType: parsedContent.contentType,
			contentLength: parsedContent.contentLength,
			displayType: parsedContent.displayType,
			isContentTypeInferred: parsedContent.isContentTypeInferred,
			text: parsedContent.text,
		}
	}

	throw new Error(
		`Unable to load ${family} content from public gateways: ${failures.join('; ')}`
	)
}


export const getGatewayReachability = async ({
	binding,
	signal,
}: {
	binding: ContentGatewayBinding
	signal?: AbortSignal
}) => {
	const endpoints = [...binding.endpoints]
	const reachableAccessEndpointCount = (
		await Promise.all(endpoints.map((endpoint) => (
			isGatewayEndpointReachable({
				binding,
				endpoint,
				signal,
			})
		)))
	).filter(Boolean).length

	return {
		declaredAccessEndpointCount: endpoints.length,
		reachableAccessEndpointCount,
		reachable: reachableAccessEndpointCount > 0,
	}
}
