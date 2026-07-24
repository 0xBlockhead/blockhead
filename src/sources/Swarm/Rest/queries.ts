import { jsonErrorHintFromResponse } from '$/lib/http.ts'
import { Source } from '$/sources/Source.ts'
import {
	ApiFamily,
	SourceEndpointKind,
	SourceTargetKind,
	type SourceBinding,
} from '$/sources/SourceBinding.ts'
import { sourceFetch } from '$/sources/_runtime/http.ts'
import type { SwarmBrowseResult } from '$/sources/Swarm/Rest/types.ts'

const swarmGatewayEndpoints = (binding: SourceBinding) => {
	if (
		binding.source !== Source.Swarm_Rest
		|| binding.target.kind !== SourceTargetKind.ContentAddressScheme
		|| binding.target.key !== 'swarm'
		|| binding.apiFamily !== ApiFamily.SwarmGateway
	)
		throw new Error('Swarm_Rest: expected canonical Swarm gateway binding')

	const endpoints = binding.endpoints.filter((endpoint) => (
		endpoint.endpointKind === SourceEndpointKind.HttpUrl
		&& endpoint.origin != null
	))
	if (endpoints.length === 0)
		throw new Error('Swarm_Rest: canonical gateway binding has no HTTP endpoints')

	return endpoints
}

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
	binding,
	reference,
	contentPath,
	signal,
}: {
	binding: SourceBinding
	reference: string
	contentPath?: string
	signal?: AbortSignal
}): Promise<SwarmBrowseResult> => {
	const trimmedReference = normalizeReference(reference)
	const trimmedPath = trimSlashes(contentPath?.trim() ?? '')
	const failures: string[] = []

	for (const endpoint of swarmGatewayEndpoints(binding)) {
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
	binding,
	signal,
}: {
	binding: SourceBinding
	signal?: AbortSignal
}) => {
	const endpoints = swarmGatewayEndpoints(binding)
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
