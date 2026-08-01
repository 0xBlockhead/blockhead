// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { ZeroExHex } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.AiArtifact,
	labels: {
		singular: 'AI artifact',
		plural: 'AI artifacts',
	},
})({
	$provider: {
		label: 'provider',
		entityType: EntityType.AiModelProvider,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	providerArtifactId: {
		label: 'provider artifact ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	digestAlgorithm: {
		label: 'digest algorithm',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	digest: {
		label: 'digest',
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	ociDigest: {
		label: 'OCI digest',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	ipfsCid: {
		label: 'IPFS CID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	arweaveId: {
		label: 'Arweave ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	gitObject: {
		label: 'Git object',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	uri: {
		label: 'URI',
		primitiveType: UrlString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	mediaType: {
		label: 'media type',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	artifactType: {
		label: 'artifact type',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	configDescriptor: {
		label: 'config descriptor',
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	layerDescriptors: {
		label: 'layer descriptors',
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	subjectDescriptor: {
		label: 'subject descriptor',
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	annotations: {
		label: 'annotations',
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	size: {
		label: 'size',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$documents: {
		label: 'documents',
		entityType: EntityType.AiDocument,
		cardinality: EntityFieldCardinality.Many,
	},
	$$attestations: {
		label: 'attestations',
		entityType: EntityType.AiArtifactAttestation,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		ProviderArtifactId: [
			'$provider',
			'providerArtifactId',
		],
		Digest: [
			'digestAlgorithm',
			'digest',
		],
		OciDigest: [
			'ociDigest',
		],
		IpfsCid: [
			'ipfsCid',
		],
		ArweaveId: [
			'arweaveId',
		],
		GitObject: [
			'gitObject',
		],
	},
})
