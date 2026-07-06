import { corsFetch, jsonErrorHintFromResponse } from '$/lib/http.ts'
import {
	ipfsNamespaceForTarget,
	trimIpfsSlashes,
} from '$/lib/ipfs.ts'
import { ipfsBindings } from '$/sources/Ipfs/bindings.ts'
import type {
	IpfsBrowseResult,
	IpfsNamespace,
} from '$/sources/Ipfs/Rest/types.ts'

const gatewayUrlLastSegment = /([^/]+)$/

const ipfsGatewayEndpoints = ipfsBindings[0].endpoints

const ipfsGatewayOrigins = ipfsGatewayEndpoints.flatMap((endpoint) => (
	[{
		origin: endpoint.origin,
		corsEnabled: endpoint.corsEnabled,
	}]
))

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

	for (const endpoint of ipfsGatewayEndpoints) {
		const gatewayUrl = getGatewayUrl({
			namespace: resolvedNamespace,
			target: trimmedTarget,
			contentPath: trimmedPath,
			gatewayOrigin: endpoint.origin,
		})

		let response: Response
		try {
			response = await corsFetch(gatewayUrl, {
				origins: ipfsGatewayOrigins,
				init: { signal },
			})
		}
		catch (error) {
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
			fileName: gatewayUrlLastSegment.exec(gatewayUrl)?.[1],
		})

		return {
			namespace: resolvedNamespace,
			target: trimmedTarget,
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
		`Unable to load ${resolvedNamespace}://${trimmedTarget}${trimmedPath ? `/${trimmedPath}` : ''} from public gateways: ${failures.join('; ')}`
	)
}
