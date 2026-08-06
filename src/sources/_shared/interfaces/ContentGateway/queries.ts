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


export const fetchOrderedGatewayContent = async ({
	binding,
	family,
	buildGatewayUrl,
	fileNameFromGatewayUrl,
	signal,
}: {
	binding: SourceBinding
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
	binding: SourceBinding
	signal?: AbortSignal
}) => {
	const endpoints = [...binding.endpoints]
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
