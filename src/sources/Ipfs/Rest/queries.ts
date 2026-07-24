import { jsonErrorHintFromResponse } from '$/lib/http.ts'
import {
	ipfsNamespaceForTarget,
	trimIpfsSlashes,
} from '$/lib/ipfs.ts'
import { Source } from '$/sources/Source.ts'
import {
	ApiFamily,
	SourceEndpointKind,
	SourceTargetKind,
	type SourceBinding,
} from '$/sources/SourceBinding.ts'
import { sourceFetch } from '$/sources/_runtime/http.ts'
import type {
	IpfsBrowseResult,
	IpfsNamespace,
} from '$/sources/Ipfs/Rest/types.ts'

const gatewayUrlLastSegment = /([^/]+)$/

const ipfsGatewayEndpoints = (binding: SourceBinding) => {
	if (
		binding.source !== Source.Ipfs_Rest
		|| binding.target.kind !== SourceTargetKind.ContentAddressScheme
		|| binding.target.key !== 'ipfs'
		|| binding.apiFamily !== ApiFamily.IpfsGateway
	)
		throw new Error('Ipfs_Rest: expected canonical IPFS gateway binding')

	const endpoints = binding.endpoints.filter((endpoint) => (
		endpoint.endpointKind === SourceEndpointKind.HttpUrl
		&& endpoint.origin != null
	))
	if (endpoints.length === 0)
		throw new Error('Ipfs_Rest: canonical gateway binding has no HTTP endpoints')

	return endpoints
}

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
	binding,
	namespace,
	target,
	contentPath,
	signal,
}: {
	binding: SourceBinding
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

	for (const endpoint of ipfsGatewayEndpoints(binding)) {
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
