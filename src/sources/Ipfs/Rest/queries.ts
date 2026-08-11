import {
	ipfsNamespaceForTarget,
	trimIpfsSlashes,
} from '$/lib/ipfs.ts'
import type { IpfsNamespace } from '$/lib/ipfs.ts'
import { parseIpfsCid } from '$/lib/multiformats.ts'
import { Source } from '$/sources/Source.ts'
import bindings from '$/sources/Ipfs/bindings.ts'
import {
	ipfsDocsIpnsName,
	ipfsGatewaySampleCid,
} from '$/sources/Ipfs/Rest/constants.ts'
import {
	assertGatewayContentPath,
	fetchOrderedGatewayContent,
	getGatewayReachability as probeGatewayReachability,
	listDeclaredGatewayOrigins as listBindingGatewayOrigins,
} from '$/sources/_shared/interfaces/ContentGateway/queries.ts'
import { ContentGatewayFamily } from '$/sources/_shared/interfaces/ContentGateway/types.ts'

const binding = bindings[Source.Ipfs_Rest][0]

const gatewayUrlLastSegment = /([^/]+)$/

const resolvedIpfsNamespace = ({
	target,
	namespace,
}: {
	target: string
	namespace?: IpfsNamespace
}) => (
	namespace ?? ipfsNamespaceForTarget(target)
)

export const assertIpfsGatewayTarget = ({
	namespace,
	target,
}: {
	namespace: IpfsNamespace
	target: string
}) => {
	const trimmedTarget = trimIpfsSlashes(target.trim())
	if (trimmedTarget === '')
		throw new Error('Ipfs_Rest: empty content target')

	if (namespace === 'ipfs' && parseIpfsCid(trimmedTarget) == null)
		throw new Error(`Ipfs_Rest: invalid IPFS CID target ${trimmedTarget}`)

	if (namespace === 'ipns' && /[\u0000-\u001f\u007f]/.test(trimmedTarget))
		throw new Error('Ipfs_Rest: IPNS target contains control characters')

	return trimmedTarget
}

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
	const resolvedNamespace = resolvedIpfsNamespace({
		target: trimmedTarget,
		namespace,
	})
	const trimmedPath = assertGatewayContentPath({
		family: ContentGatewayFamily.Ipfs,
		contentPath,
	})
	return `${gatewayOrigin}/${resolvedNamespace}/${assertIpfsGatewayTarget({
		namespace: resolvedNamespace,
		target: trimmedTarget,
	})}${trimmedPath ? `/${trimmedPath.split('/').map(encodeURIComponent).join('/')}` : ''}`
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
	const trimmedPath = assertGatewayContentPath({
		family: ContentGatewayFamily.Ipfs,
		contentPath,
	})
	const resolvedNamespace = resolvedIpfsNamespace({
		target: trimIpfsSlashes(target.trim()),
		namespace,
	})
	const trimmedTarget = assertIpfsGatewayTarget({
		namespace: resolvedNamespace,
		target,
	})

	const browseResult = await fetchOrderedGatewayContent({
		binding,
		family: ContentGatewayFamily.Ipfs,
		buildGatewayUrl: (gatewayOrigin) => (
			getGatewayUrl({
				namespace: resolvedNamespace,
				target: trimmedTarget,
				contentPath: trimmedPath,
				gatewayOrigin,
			})
		),
		fileNameFromGatewayUrl: (gatewayUrl) => (
			gatewayUrlLastSegment.exec(gatewayUrl)?.[1]
		),
		signal,
	})

	return {
		namespace: resolvedNamespace,
		target: trimmedTarget,
		contentPath: trimmedPath,
		gatewayOrigin: browseResult.gatewayOrigin,
		gatewayUrl: browseResult.gatewayUrl,
		fileName: browseResult.fileName,
		extension: browseResult.extension,
		contentType: browseResult.contentType,
		contentLength: browseResult.contentLength,
		displayType: browseResult.displayType,
		isContentTypeInferred: browseResult.isContentTypeInferred,
		text: browseResult.text,
	}
}

export const getGatewayReachability = async ({
	signal,
}: {
	signal?: AbortSignal
} = {}) => (
	probeGatewayReachability({
		binding,
		signal,
	})
)

export const listDeclaredGatewayOrigins = () => (
	listBindingGatewayOrigins(binding)
)

export const listSeededExampleResources = () => (
	[
		{
			namespace: 'ipfs' as const,
			target: ipfsGatewaySampleCid,
			contentPath: '',
		},
		{
			namespace: 'ipns' as const,
			target: ipfsDocsIpnsName,
			contentPath: '',
		},
	]
)
