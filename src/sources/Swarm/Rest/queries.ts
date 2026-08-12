import { Source } from '$/sources/Source.ts'
import bindings from '$/sources/Swarm/bindings.ts'
import { swarmDocsLandingReference, swarmOnlyReferencePattern } from '$/sources/Swarm/Rest/constants.ts'
import {
	assertGatewayContentPath,
	fetchOrderedGatewayContent,
	getGatewayReachability as probeGatewayReachability,
	listDeclaredGatewayOrigins as listBindingGatewayOrigins,
	stripOptionalHexPrefix,
	trimGatewayPathSlashes,
} from '$/sources/_shared/interfaces/ContentGateway/queries.ts'
import { ContentGatewayFamily } from '$/sources/_shared/interfaces/ContentGateway/types.ts'
import { swarmManifestPathPattern } from '$/sources/Swarm/Rest/constants.ts'
import {
	swarmManifestWire,
	swarmReference,
	type SwarmManifest,
} from '$/sources/Swarm/Rest/types.ts'

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
	return stripOptionalHexPrefix(trimGatewayPathSlashes(withoutScheme)).toLowerCase()
}

export const parseSwarmManifest = (text: string): SwarmManifest => {
	let parsed: unknown
	try {
		parsed = JSON.parse(text)
	} catch {
		throw new Error('Swarm_Rest: invalid manifest JSON')
	}
	let manifest: SwarmManifest
	try {
		manifest = swarmManifestWire.assert(parsed)
	} catch {
		throw new Error('Swarm_Rest: invalid manifest envelope')
	}
	for (const path of [manifest.manifest.indexDocument, manifest.manifest.errorDocument].filter((value) => value != null)) {
		if (path === '' || !swarmManifestPathPattern.test(path))
			throw new Error(`Swarm_Rest: invalid manifest document path ${path}`)
	}
	for (const entry of manifest.entries) {
		if (entry.path === '' || !swarmManifestPathPattern.test(entry.path))
			throw new Error(`Swarm_Rest: invalid manifest entry path ${entry.path}`)
		try {
			swarmReference.assert(entry.hash)
		} catch {
			throw new Error(`Swarm_Rest: invalid manifest entry hash ${entry.path}`)
		}
	}
	if (new Set(manifest.entries.map((entry) => entry.path)).size !== manifest.entries.length)
		throw new Error('Swarm_Rest: duplicate manifest entry path')
	return manifest
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
	const trimmedPath = assertGatewayContentPath({
		family: ContentGatewayFamily.Swarm,
		contentPath,
	})
	return `${gatewayOrigin}/bzz/${trimmedReference}${trimmedPath ? `/${trimmedPath.split('/').map(encodeURIComponent).join('/')}` : ''}`
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
	const trimmedPath = assertGatewayContentPath({
		family: ContentGatewayFamily.Swarm,
		contentPath,
	})

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
	listBindingGatewayOrigins(binding)
)

export const listSeededExampleResources = () => (
	[
		{
			reference: swarmDocsLandingReference,
			contentPath: '',
		},
	]
)
