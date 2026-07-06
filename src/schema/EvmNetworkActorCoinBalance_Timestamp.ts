// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum EvmNetworkActorCoinBalance_TimestampSelector {
	ActorCoinTimestampMsSource = 'ActorCoinTimestampMsSource',
}
export default {
	entityType: EntityType.EvmNetworkActorCoinBalance_Timestamp,
	label: 'EVM network actor coin balance timestamp',
	labelPlural: 'EVM network actor coin balance observations',
	selectors: [
		{
			name: EvmNetworkActorCoinBalance_TimestampSelector.ActorCoinTimestampMsSource,
			fields: [
				'$actorCoin',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
			name: '$actorCoin',
			label: 'Actor coin',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmNetworkActorCoinBalance,
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
			name: 'blockNumber',
			label: 'Block number',
			description: 'The block height or number in its network.',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'balance',
			label: 'Balance',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'usdValue',
			label: 'USD value',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'priceUsd',
			label: 'Price USD',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'tokenMetadata',
			label: 'Token metadata',
			type: EntityFieldType.Primitive,
			primitiveType: type('unknown'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
