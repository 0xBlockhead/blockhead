import { corsFetch, jsonErrorHintFromResponse } from '$/lib/http.ts'
import { gatewayUrls } from '$/sources/Swarm/Rest/constants.ts'
import Swarm from '$/sources/Swarm/index.ts'
import type { SwarmBrowseResult } from '$/sources/Swarm/Rest/types.ts'

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

	for (const gatewayOrigin of gatewayUrls) {
		const gatewayUrl = getGatewayUrl({
			reference: trimmedReference,
			contentPath: trimmedPath,
			gatewayOrigin,
		})

		const response = await corsFetch(gatewayUrl, {
			origins: Swarm.origins,
			init: { signal },
		})
		if (!response.ok) {
			const hint = await jsonErrorHintFromResponse(response)
			failures.push(
				hint ?
					`${gatewayOrigin} (${response.status}): ${hint}`
				:
					`${gatewayOrigin} (${response.status} ${response.statusText})`
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
		`Unable to load bzz://${trimmedReference}${trimmedPath ? `/${trimmedPath}` : ''} from public gateways: ${failures.join('; ')}`
	)
}
