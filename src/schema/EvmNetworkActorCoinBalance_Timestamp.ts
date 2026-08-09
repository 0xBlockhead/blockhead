// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.EvmNetworkActorCoinBalance_Timestamp,
	labels: {
		singular: 'EVM network actor coin balance timestamp',
		plural: 'EVM network actor coin balance observations',
	},
})({
	$actorCoin: {
		entityType: EntityType.EvmNetworkActorCoinBalance,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	blockNumber: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Allium_Rest,
			Source.Blockscout_Rest,
			Source.GoldRushFoundational_Rest,
		],
	},
	balance: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Allium_Rest,
			Source.Blockscout_Rest,
			Source.GoldRushFoundational_Rest,
		],
	},
	usdValue: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Allium_Rest,
			Source.Blockscout_Rest,
			Source.GoldRushFoundational_Rest,
		],
	},
	priceUsd: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Allium_Rest,
			Source.Blockscout_Rest,
			Source.GoldRushFoundational_Rest,
		],
	},
	tokenMetadata: {
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		ActorCoinTimestampMsSource: [
			'$actorCoin',
			'timestampMs',
			'source',
		],
	},
})
