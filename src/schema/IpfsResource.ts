// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { type } from 'arktype'

export enum IpfsResourceSelector {
	ResourceAddress = 'ResourceAddress',
}
export default {
	entityType: EntityType.IpfsResource,
	label: 'IPFS resource',
	labelPlural: 'IPFS resources',
	selectors: [
		{
			name: IpfsResourceSelector.ResourceAddress,
			fields: [
				'namespace',
				'target',
				'contentPath',
			],
		},
	],
	fields: [
		{
				name: 'namespace',
				label: 'Namespace',
				description: 'The namespace that qualifies the identifier.',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'target',
				label: 'Target',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'contentPath',
				label: 'Content path',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'canonicalUri',
				label: 'Canonical URI',
				type: EntityFieldType.Primitive,
				primitiveType: (UrlString),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'gatewayOrigin',
				label: 'Gateway origin',
				type: EntityFieldType.Primitive,
				primitiveType: (UrlString),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'gatewayUrl',
				label: 'Gateway URL',
				type: EntityFieldType.Primitive,
				primitiveType: (UrlString),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'fileName',
				label: 'File name',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'extension',
				label: 'Extension',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'contentType',
				label: 'Content type',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'contentLength',
				label: 'Content length',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'displayType',
				label: 'Display type',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'isContentTypeInferred',
				label: 'Content type inferred',
				type: EntityFieldType.Primitive,
				primitiveType: type('boolean'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'text',
				label: 'Text',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$media',
				label: 'Media',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.Media,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'cidVersion',
				label: 'CID version',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'cidMultibase',
				label: 'CID multibase',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'cidMulticodecCode',
				label: 'CID multicodec code',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'cidMultihashCode',
				label: 'CID multihash code',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'cidMultihashDigestHex',
				label: 'CID multihash digest hex',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'isCidSubdomainSafe',
				label: 'CID subdomain safe',
				type: EntityFieldType.Primitive,
				primitiveType: type('boolean'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
