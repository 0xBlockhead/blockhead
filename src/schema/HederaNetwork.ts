// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum HederaNetworkSelector {
	Network = 'Network',
}
export const HederaNetwork = entity({
	entityType: EntityType.HederaNetwork,
	label: 'hedera network',
	labelPlural: 'hedera networks',
})({
	$network: {
		label: 'network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	shard: {
		label: 'shard',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	realm: {
		label: 'realm',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$blocks: {
		label: 'blocks',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.HederaBlock,
		cardinality: EntityFieldCardinality.Many,
	},
	$$transactions: {
		label: 'transactions',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.HederaTransaction,
		cardinality: EntityFieldCardinality.Many,
	},
	$$accounts: {
		label: 'accounts',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.HederaAccount,
		cardinality: EntityFieldCardinality.Many,
	},
	$$tokens: {
		label: 'tokens',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.HederaToken,
		cardinality: EntityFieldCardinality.Many,
	},
	$$nfts: {
		label: 'nfts',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.HederaNft,
		cardinality: EntityFieldCardinality.Many,
	},
	$$contracts: {
		label: 'contracts',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.HederaContract,
		cardinality: EntityFieldCardinality.Many,
	},
	$$topics: {
		label: 'topics',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.HederaTopic,
		cardinality: EntityFieldCardinality.Many,
	},
	$$schedules: {
		label: 'schedules',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.HederaSchedule,
		cardinality: EntityFieldCardinality.Many,
	},
	$$nodes: {
		label: 'nodes',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.HederaNode,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
		label: 'timestamps',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.HederaNetwork_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$feeTimestamps: {
		label: 'fee timestamps',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.HederaNetworkFee_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$exchangeRateTimestamps: {
		label: 'exchange rate timestamps',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.HederaNetworkExchangeRate_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$stakeTimestamps: {
		label: 'stake timestamps',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.HederaNetworkStake_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$supplyTimestamps: {
		label: 'supply timestamps',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.HederaNetworkSupply_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		Network: [
			'$network',
		],
	},
})
