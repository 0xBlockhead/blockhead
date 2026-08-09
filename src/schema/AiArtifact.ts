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
		entityType: EntityType.AiModelProvider,
		cardinality: EntityFieldCardinality.One,
	},
	providerArtifactId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	digestAlgorithm: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	digest: {
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.One,
	},
	ociDigest: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	ipfsCid: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	arweaveId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	gitObject: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	uri: {
		primitiveType: UrlString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	mediaType: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	artifactType: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	configDescriptor: {
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	layerDescriptors: {
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	subjectDescriptor: {
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	annotations: {
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	size: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$documents: {
		entityType: EntityType.AiDocument,
		cardinality: EntityFieldCardinality.Many,
	},
	$$attestations: {
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
