// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum TronAccountTokenBalance_TimestampSelector {
	AccountTokenTimestampMsSource = 'AccountTokenTimestampMsSource',
}
export default {
	entityType: EntityType.TronAccountTokenBalance_Timestamp,
	label: 'tron account token balance timestamp',
	labelPlural: 'tron account token balance observations',
	selectors: [
		{
			name: TronAccountTokenBalance_TimestampSelector.AccountTokenTimestampMsSource,
			fields: [
				'$account',
				'$token',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
				name: '$account',
				label: 'Account',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.TronAccount,
				cardinality: EntityFieldCardinality.One,
		},
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
				name: 'standard',
				label: 'Standard',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.TronScan_Rest,
				],
		},
		{
				name: 'balance',
				label: 'Balance',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.TronScan_Rest,
				],
		},
		{
				name: 'ownedSerialNumbers',
				label: 'Owned serial numbers',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: 'tokenId',
				label: 'Token ID',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.TronScan_Rest,
				],
		},
		{
				name: 'tokenName',
				label: 'Token name',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.TronScan_Rest,
				],
		},
		{
				name: 'tokenSymbol',
				label: 'Token symbol',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.TronScan_Rest,
				],
		},
		{
				name: 'frozenBalance',
				label: 'Frozen balance',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'delegatedBalance',
				label: 'Delegated balance',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
