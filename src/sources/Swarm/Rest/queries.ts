import { Source } from '$/sources/Source.ts'
import { sourceEndpointOrigin } from '$/sources/SourceBinding.ts'
import bindings from '$/sources/Swarm/bindings.ts'
import { swarmOnlyReferencePattern } from '$/sources/Swarm/Rest/constants.ts'
import {
	fetchOrderedGatewayContent,
	getGatewayReachability as probeGatewayReachability,
	stripOptionalHexPrefix,
	trimGatewayPathSlashes,
} from '$/sources/_shared/interfaces/ContentGateway/queries.ts'
import { ContentGatewayFamily } from '$/sources/_shared/interfaces/ContentGateway/types.ts'

const binding = bindings[Source.Swarm_Rest][0]

export const normalizeSwarmReference = (
	reference: string
) => {
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
	return stripOptionalHexPrefix(trimGatewayPathSlashes(withoutScheme))
}

export const assertSwarmGatewayReference = (
	reference: string
) => {
	const normalizedReference = normalizeSwarmReference(reference)
	if (!swarmOnlyReferencePattern.test(normalizedReference))
		throw new Error(`Swarm_Rest: invalid reference ${reference}`)
	return normalizedReference
}

export const getGatewayUrl = ({
	reference,
	contentPath,
	gatewayOrigin,
}: {
	reference: string
	contentPath?: string
	gatewayOrigin: string
}) => {
	const trimmedReference = normalizeSwarmReference(reference)
	const trimmedPath = trimGatewayPathSlashes(contentPath?.trim() ?? '')
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
}) => {
	const trimmedReference = assertSwarmGatewayReference(reference)
	const trimmedPath = trimGatewayPathSlashes(contentPath?.trim() ?? '')

	const browseResult = await fetchOrderedGatewayContent({
		binding,
		family: ContentGatewayFamily.Swarm,
		buildGatewayUrl: (gatewayOrigin) => (
			getGatewayUrl({
				reference: trimmedReference,
				contentPath: trimmedPath,
				gatewayOrigin,
			})
		),
		fileNameFromGatewayUrl: () => (
			trimmedPath !== '' ?
				trimmedPath.split('/').at(-1)
			:
				undefined
		),
		signal,
	})

	return {
		reference: trimmedReference,
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
	binding.endpoints.flatMap((endpoint) => {
		const origin = sourceEndpointOrigin(endpoint)
		return origin == null ? [] : [origin]
	})
)
