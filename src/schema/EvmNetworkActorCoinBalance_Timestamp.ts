import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum EvmNetworkActorCoinBalance_TimestampSelector {
	ActorCoinTimestampMsSource = '$actorCoin+timestampMs+source',
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
			label: 'actor coin',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmNetworkActorCoinBalance,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'timestampMs',
			label: 'Timestamp',
			description: 'The observation time in Unix milliseconds.',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'source',
			label: 'Source',
			description: 'The source that produced this observation.',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'blockNumber',
			label: 'Block number',
			description: 'The block height or number in its network.',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'balance',
			label: 'balance',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'usdValue',
			label: 'usd value',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'priceUsd',
			label: 'price usd',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'tokenMetadata',
			label: 'token metadata',
			type: EntityFieldType.Primitive,
			primitiveType: type("unknown"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
