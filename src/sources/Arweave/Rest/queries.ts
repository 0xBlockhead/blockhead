import { corsFetch, jsonErrorHintFromResponse } from '$/lib/http.ts'
import {
	arweaveGatewayEndpoints,
	arweaveGatewayOrigins,
} from '$/sources/Arweave/Rest/constants.ts'
import type { ArweaveBrowseResult } from '$/sources/Arweave/Rest/types.ts'

const gatewayUrlLastSegment = /([^/]+)$/

const trimSlashes = (value: string) => value.replace(/^\/+|\/+$/g, '')

export const getGatewayUrl = ({
	transactionId,
	contentPath,
	gatewayOrigin,
}: {
	transactionId: string
	contentPath?: string
	gatewayOrigin: string
}): string => {
	const trimmedTransactionId = trimSlashes(transactionId.trim())
	const trimmedPath = trimSlashes(contentPath?.trim() ?? '')
	return `${gatewayOrigin}/${trimmedTransactionId}${trimmedPath ? `/${trimmedPath}` : ''}`
}

export const fetchBrowseResult = async ({
	transactionId,
	contentPath,
	signal,
}: {
	transactionId: string
	contentPath?: string
	signal?: AbortSignal
}): Promise<ArweaveBrowseResult> => {
	const trimmedTransactionId = trimSlashes(transactionId.trim())
	const trimmedPath = trimSlashes(contentPath?.trim() ?? '')
	const failures: string[] = []

	for (const endpoint of arweaveGatewayEndpoints) {
		const gatewayUrl = getGatewayUrl({
			transactionId: trimmedTransactionId,
			contentPath: trimmedPath,
			gatewayOrigin: endpoint.origin,
		})

		const response = await corsFetch(gatewayUrl, {
			origins: arweaveGatewayOrigins,
			init: { signal },
		})
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
					gatewayUrlLastSegment.exec(gatewayUrl)?.[1]
			),
		})

		return {
			transactionId: trimmedTransactionId,
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
		`Unable to load ar://${trimmedTransactionId}${trimmedPath ? `/${trimmedPath}` : ''} from public gateways: ${failures.join('; ')}`
	)
}
