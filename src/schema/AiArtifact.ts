// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
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
export default {
	entityType: EntityType.AiArtifact,
	label: 'AI artifact',
	labelPlural: 'AI artifacts',
	selectors: [
		{
			name: AiArtifactSelector.Digest,
			fields: [
				'digestAlgorithm',
				'digest',
			],
		},
		{
			name: AiArtifactSelector.OciDigest,
			fields: [
				'ociDigest',
			],
		},
		{
			name: AiArtifactSelector.IpfsCid,
			fields: [
				'ipfsCid',
			],
		},
		{
			name: AiArtifactSelector.ArweaveId,
			fields: [
				'arweaveId',
			],
		},
		{
			name: AiArtifactSelector.GitObject,
			fields: [
				'gitObject',
			],
		},
	],
	fields: [
		{
				name: 'digestAlgorithm',
				label: 'digest algorithm',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'digest',
				label: 'digest',
				type: EntityFieldType.Primitive,
				primitiveType: (ZeroExHex),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'ociDigest',
				label: 'OCI digest',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'ipfsCid',
				label: 'IPFS CID',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'arweaveId',
				label: 'Arweave ID',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'gitObject',
				label: 'Git object',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'uri',
				label: 'URI',
				type: EntityFieldType.Primitive,
				primitiveType: (UrlString),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'mediaType',
				label: 'media type',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'artifactType',
				label: 'artifact type',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'configDescriptor',
				label: 'config descriptor',
				type: EntityFieldType.Primitive,
				primitiveType: type('unknown'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'layerDescriptors',
				label: 'layer descriptors',
				type: EntityFieldType.Primitive,
				primitiveType: type('unknown'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'subjectDescriptor',
				label: 'subject descriptor',
				type: EntityFieldType.Primitive,
				primitiveType: type('unknown'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'annotations',
				label: 'annotations',
				type: EntityFieldType.Primitive,
				primitiveType: type('unknown'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'size',
				label: 'size',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$$documents',
				label: 'documents',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.AiDocument,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$$attestations',
				label: 'attestations',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.AiArtifactAttestation,
				cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
