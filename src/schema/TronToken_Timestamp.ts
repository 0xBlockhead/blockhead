// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum TronToken_TimestampSelector {
	TokenTimestampMsSource = 'TokenTimestampMsSource',
}
export default {
	entityType: EntityType.TronToken_Timestamp,
	label: 'tron token timestamp',
	labelPlural: 'tron token observations',
	selectors: [
		{
			name: TronToken_TimestampSelector.TokenTimestampMsSource,
			fields: [
				'$token',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
				name: '$token',
				label: 'Token',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.TronToken,
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
				name: 'blockHeight',
				label: 'Block height',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'name',
				label: 'Name',
				description: 'The human-readable name of the subject.',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.TronScan_Rest,
				],
		},
		{
				name: 'symbol',
				label: 'Symbol',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.TronScan_Rest,
				],
		},
		{
				name: 'decimals',
				label: 'Decimals',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.TronScan_Rest,
				],
		},
		{
				name: 'totalSupply',
				label: 'Total supply',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.TronScan_Rest,
				],
		},
		{
				name: 'holderCount',
				label: 'Holders',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.TronScan_Rest,
				],
		},
		{
				name: 'transferCount',
				label: 'Transfers',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'contractVerified',
				label: 'Contract verified',
				type: EntityFieldType.Primitive,
				primitiveType: type('boolean'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
