// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum ElementsAsset_TimestampSelector {
	AssetTimestampMsSource = 'AssetTimestampMsSource',
}
export default {
	entityType: EntityType.ElementsAsset_Timestamp,
	label: 'Elements asset observation',
	labelPlural: 'Elements asset observations',
	selectors: [
		{
			name: ElementsAsset_TimestampSelector.AssetTimestampMsSource,
			fields: [
				'$asset',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
				name: '$asset',
				label: 'Asset',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.ElementsAsset,
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
				name: 'issuedAmount',
				label: 'Issued amount',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'burnedAmount',
				label: 'Burned amount',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'reissuanceTokenCount',
				label: 'Reissuance tokens',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
