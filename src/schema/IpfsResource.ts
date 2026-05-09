import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'

export default {
	entityType: EntityType.IpfsResource,

	label: 'IPFS Resource',
	labelPlural: 'IPFS Resources',

	id: type({
		namespace: '"ipfs" | "ipns"',
		target: 'string',
		contentPath: 'string',
	}),

	fields: [
		{
			name: 'canonicalUri',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
			defaultSources: [
				Source.Ipfs_Rest,
			],
		},
		{
			name: 'gatewayOrigin',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
			defaultSources: [
				Source.Ipfs_Rest,
			],
		},
		{
			name: 'gatewayUrl',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
			defaultSources: [
				Source.Ipfs_Rest,
			],
		},
		{
			name: 'fileName',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Ipfs_Rest,
			],
		},
		{
			name: 'extension',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Ipfs_Rest,
			],
		},
		{
			name: 'contentType',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Ipfs_Rest,
			],
		},
		{
			name: 'contentLength',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Ipfs_Rest,
			],
		},
		{
			name: 'displayType',
			type: EntityFieldType.Primitive,
			primitiveType: type('"text" | "image" | "video" | "audio" | "json" | "xml" | "pdf" | "iframe" | "binary"'),
			cardinality: EntityFieldCardinality.One,
			defaultSources: [
				Source.Ipfs_Rest,
			],
		},
		{
			name: 'isContentTypeInferred',
			type: EntityFieldType.Primitive,
			primitiveType: type('boolean'),
			cardinality: EntityFieldCardinality.One,
			defaultSources: [
				Source.Ipfs_Rest,
			],
		},
		{
			name: 'text',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Ipfs_Rest,
			],
		},
		{
			name: 'cidVersion',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Ipfs_Rest,
			],
		},
		{
			name: 'cidMultibase',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Ipfs_Rest,
			],
		},
		{
			name: 'cidMulticodecCode',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Ipfs_Rest,
			],
		},
		{
			name: 'cidMultihashCode',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Ipfs_Rest,
			],
		},
		{
			name: 'cidMultihashDigestHex',
			type: EntityFieldType.Primitive,
			primitiveType: type('string.hex' as type.cast<`0x${string}`>),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Ipfs_Rest,
			],
		},
		{
			name: 'isCidSubdomainSafe',
			type: EntityFieldType.Primitive,
			primitiveType: type('boolean'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Ipfs_Rest,
			],
		},
		{
			name: '$media',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Media,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Ipfs_Rest,
			],
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
