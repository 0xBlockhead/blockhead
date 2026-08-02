import { jsonErrorHintFromResponse } from '$/lib/http.ts'
import {
	ipfsNamespaceForTarget,
	trimIpfsSlashes,
} from '$/lib/ipfs.ts'
import type { IpfsNamespace } from '$/lib/ipfs.ts'
import { Source } from '$/sources/Source.ts'
import { sourceEndpointOrigin } from '$/sources/SourceBinding.ts'
import bindings from '$/sources/Ipfs/bindings.ts'
import { sourceFetch } from '$/sources/_runtime/http.ts'

const binding = bindings[Source.Ipfs_Rest][0]

const gatewayUrlLastSegment = /([^/]+)$/

const ipfsGatewayEndpoints = () => binding.endpoints

const resolvedIpfsNamespace = ({
	target,
	namespace,
}: {
	target: string
	namespace?: IpfsNamespace
}) => (
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
}) => {
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
}) => {
	const trimmedTarget = trimIpfsSlashes(target.trim())
	const trimmedPath = trimIpfsSlashes(contentPath?.trim() ?? '')
	const resolvedNamespace = resolvedIpfsNamespace({
		target: trimmedTarget,
		namespace,
	})
	const failures: string[] = []

	for (const endpoint of ipfsGatewayEndpoints()) {
		const gatewayUrl = getGatewayUrl({
			namespace: resolvedNamespace,
			target: trimmedTarget,
			contentPath: trimmedPath,
			gatewayOrigin: endpoint.locator,
		})

		let response: Response
		try {
			response = await sourceFetch(binding, gatewayUrl, { signal })
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
			gatewayOrigin: sourceEndpointOrigin(endpoint),
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
