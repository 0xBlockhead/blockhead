import { ipfsPublicGateways } from '$/constants/IpfsProtocol.ts'
import { corsFetch, jsonErrorHintFromResponse } from '$/lib/http.ts'
import {
	ipfsNamespaceForTarget,
	trimIpfsSlashes,
} from '$/lib/ipfs.ts'
import Ipfs from '$/sources/Ipfs/index.ts'
import type {
	IpfsBrowseResult,
	IpfsNamespace,
} from '$/sources/Ipfs/Rest/types.ts'

const gatewayUrlLastSegment = /([^/]+)$/

const resolvedIpfsNamespace = ({
	target,
	namespace,
}: {
	target: string
	namespace?: IpfsNamespace
}): IpfsNamespace => (
	namespace ?? ipfsNamespaceForTarget(target)
)

export const getGatewayUrl = ({
	namespace,
	target,
	contentPath,
	gatewayOrigin,
}: {
	namespace?: IpfsNamespace
	target: string
	contentPath?: string
	gatewayOrigin: string
}): string => {
	const trimmedTarget = trimIpfsSlashes(target.trim())
	const trimmedPath = trimIpfsSlashes(contentPath?.trim() ?? '')
	return `${gatewayOrigin}/${resolvedIpfsNamespace({
		target: trimmedTarget,
		namespace,
	})}/${trimmedTarget}${trimmedPath ? `/${trimmedPath}` : ''}`
}

export const fetchBrowseResult = async ({
	namespace,
	target,
	contentPath,
	signal,
}: {
	namespace?: IpfsNamespace
	target: string
	contentPath?: string
	signal?: AbortSignal
}): Promise<IpfsBrowseResult> => {
	const trimmedTarget = trimIpfsSlashes(target.trim())
	const trimmedPath = trimIpfsSlashes(contentPath?.trim() ?? '')
	const resolvedNamespace = resolvedIpfsNamespace({
		target: trimmedTarget,
		namespace,
	})
	const failures: string[] = []

	for (const { origin: gatewayOrigin } of ipfsPublicGateways) {
		const gatewayUrl = getGatewayUrl({
			namespace: resolvedNamespace,
			target: trimmedTarget,
			contentPath: trimmedPath,
			gatewayOrigin,
		})

		const response = await corsFetch(gatewayUrl, {
			origins: Ipfs.origins,
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
			fileName: gatewayUrlLastSegment.exec(gatewayUrl)?.[1],
		})

		return {
			namespace: resolvedNamespace,
			target: trimmedTarget,
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
		`Unable to load ${resolvedNamespace}://${trimmedTarget}${trimmedPath ? `/${trimmedPath}` : ''} from public gateways: ${failures.join('; ')}`
	)
}
