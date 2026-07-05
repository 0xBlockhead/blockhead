// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum IcpCanisterMetadata_TimestampSelector {
	MetadataTimestampMsSource = 'MetadataTimestampMsSource',
}
export default {
	entityType: EntityType.IcpCanisterMetadata_Timestamp,
	label: 'icp canister metadata timestamp',
	labelPlural: 'icp canister metadata observations',
	selectors: [
		{
			name: IcpCanisterMetadata_TimestampSelector.MetadataTimestampMsSource,
			fields: [
				'$metadata',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
				name: '$metadata',
				label: 'metadata',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.IcpCanisterMetadata,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'timestampMs',
				label: 'Timestamp',
				description: 'The observation time in Unix milliseconds.',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'source',
				label: 'Source',
				description: 'The source that produced this observation.',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'visibility',
				label: 'visibility',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'contentHash',
				label: 'content hash',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'contentType',
				label: 'content type',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'value',
				label: 'Value',
				description: 'The source-domain value.',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
