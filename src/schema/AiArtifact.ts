// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { ZeroExHex } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export enum AiArtifactSelector {
	Digest = 'Digest',
	OciDigest = 'OciDigest',
	IpfsCid = 'IpfsCid',
	ArweaveId = 'ArweaveId',
	GitObject = 'GitObject',
}
export const AiArtifact = entity({
	entityType: EntityType.AiArtifact,
	labels: {
		singular: 'AI artifact',
		plural: 'AI artifacts',
	},
})({
	digestAlgorithm: {
		label: 'digest algorithm',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	digest: {
		label: 'digest',
		type: EntityFieldType.Primitive,
		primitiveType: (ZeroExHex),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	ociDigest: {
		label: 'OCI digest',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	ipfsCid: {
		label: 'IPFS CID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	arweaveId: {
		label: 'Arweave ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	gitObject: {
		label: 'Git object',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	uri: {
		label: 'URI',
		type: EntityFieldType.Primitive,
		primitiveType: (UrlString),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	mediaType: {
		label: 'media type',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	artifactType: {
		label: 'artifact type',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	configDescriptor: {
		label: 'config descriptor',
		type: EntityFieldType.Primitive,
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	layerDescriptors: {
		label: 'layer descriptors',
		type: EntityFieldType.Primitive,
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	subjectDescriptor: {
		label: 'subject descriptor',
		type: EntityFieldType.Primitive,
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	annotations: {
		label: 'annotations',
		type: EntityFieldType.Primitive,
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	size: {
		label: 'size',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$documents: {
		label: 'documents',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.AiDocument,
		cardinality: EntityFieldCardinality.Many,
	},
	$$attestations: {
		label: 'attestations',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.AiArtifactAttestation,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
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
