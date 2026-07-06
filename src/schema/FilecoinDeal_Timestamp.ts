// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum FilecoinDeal_TimestampSelector {
	DealTimestampMsSource = 'DealTimestampMsSource',
}
export default {
	entityType: EntityType.FilecoinDeal_Timestamp,
	label: 'filecoin deal timestamp',
	labelPlural: 'filecoin deal observations',
	selectors: [
		{
			name: FilecoinDeal_TimestampSelector.DealTimestampMsSource,
			fields: [
				'$deal',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
			name: '$deal',
			label: 'Deal',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.FilecoinDeal,
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
			name: 'height',
			label: 'Height',
			description: 'The block height.',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'tipsetKey',
			label: 'Tipset key',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$tipset',
			label: 'Tipset',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.FilecoinTipset,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'sectorStartEpoch',
			label: 'Sector start epoch',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'lastUpdatedEpoch',
			label: 'Last updated epoch',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'slashEpoch',
			label: 'Slash epoch',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'verifiedDeal',
			label: 'Verified deal',
			type: EntityFieldType.Primitive,
			primitiveType: type('boolean'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'providerCollateralAttoFil',
			label: 'Provider collateral attoFIL',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'clientCollateralAttoFil',
			label: 'Client collateral attoFIL',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
