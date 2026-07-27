import { jsonErrorHintFromResponse } from '$/lib/http.ts'
import { Source } from '$/sources/Source.ts'
import { sourceFetch } from '$/sources/_runtime/http.ts'
import type { SwarmBrowseResult } from '$/sources/Swarm/Rest/types.ts'
import bindings from '$/sources/Swarm/bindings.ts'

const binding = bindings[Source.Swarm_Rest]

const swarmGatewayEndpoints = () => binding.endpoints

const stripHexPrefix = (value: string) => (
	value.toLowerCase().startsWith('0x') ?
		value.slice(2)
	:
		value
)

const trimSlashes = (value: string) => (
	value.replace(/^\/+|\/+$/g, '')
)

const normalizeReference = (reference: string) => {
	const trimmed = reference.trim()
	const withoutScheme = (
		trimmed.toLowerCase().startsWith('bzz://') ?
			trimmed.slice('bzz://'.length)
		:
			trimmed.toLowerCase().startsWith('swarm://') ?
				trimmed.slice('swarm://'.length)
			:
				trimmed
	)
	return stripHexPrefix(trimSlashes(withoutScheme))
}

const getGatewayUrl = ({
	reference,
	contentPath,
	gatewayOrigin,
}: {
	reference: string
	contentPath?: string
	gatewayOrigin: string
}): string => {
	const trimmedReference = normalizeReference(reference)
	const trimmedPath = trimSlashes(contentPath?.trim() ?? '')
	return `${gatewayOrigin}/bzz/${trimmedReference}${trimmedPath ? `/${trimmedPath}` : ''}`
}

export const fetchBrowseResult = async ({
	reference,
	contentPath,
	signal,
}: {
	reference: string
	contentPath?: string
	signal?: AbortSignal
}): Promise<SwarmBrowseResult> => {
	const trimmedReference = normalizeReference(reference)
	const trimmedPath = trimSlashes(contentPath?.trim() ?? '')
	const failures: string[] = []

	for (const endpoint of swarmGatewayEndpoints()) {
		const gatewayUrl = getGatewayUrl({
			reference: trimmedReference,
			contentPath: trimmedPath,
			gatewayOrigin: endpoint.locator,
		})

		const response = await sourceFetch(binding, gatewayUrl, { signal })
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
			fileName: (
				trimmedPath !== '' ?
					trimmedPath.split('/').at(-1)
				:
					undefined
			),
		})

		return {
			reference: trimmedReference,
			contentPath: trimmedPath,
			gatewayOrigin: endpoint.origin,
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
		`Unable to load bzz://${trimmedReference}${trimmedPath ? `/${trimmedPath}` : ''} from public gateways: ${failures.join('; ')}`
	)
}

export const getGatewayReachability = async ({
	signal,
}: {
	signal?: AbortSignal
} = {}) => {
	const endpoints = swarmGatewayEndpoints()
	const reachableAccessEndpointCount = (
		await Promise.all(endpoints.map(async (endpoint) => {
			try {
				return (
					await sourceFetch(binding, endpoint.locator, {
						method: 'HEAD',
						signal,
					})
				).ok
			} catch {
				return false
			}
		}))
	).filter(Boolean).length

	return {
		declaredAccessEndpointCount: endpoints.length,
		reachableAccessEndpointCount,
		reachable: reachableAccessEndpointCount > 0,
	}
}
