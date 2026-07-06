// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum HederaNetworkSelector {
	Network = 'Network',
}
export default {
	entityType: EntityType.HederaNetwork,
	label: 'hedera network',
	labelPlural: 'hedera networks',
	selectors: [
		{
			name: HederaNetworkSelector.Network,
			fields: [
				'$network',
			],
		},
	],
	fields: [
		{
			name: '$network',
			label: 'network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Network,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'shard',
			label: 'shard',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'realm',
			label: 'realm',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$blocks',
			label: 'blocks',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.HederaBlock,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$transactions',
			label: 'transactions',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.HederaTransaction,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$accounts',
			label: 'accounts',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.HederaAccount,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$tokens',
			label: 'tokens',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.HederaToken,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$nfts',
			label: 'nfts',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.HederaNft,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$contracts',
			label: 'contracts',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.HederaContract,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$topics',
			label: 'topics',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.HederaTopic,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$schedules',
			label: 'schedules',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.HederaSchedule,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$nodes',
			label: 'nodes',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.HederaNode,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.HederaNetwork_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$feeTimestamps',
			label: 'fee timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.HederaNetworkFee_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$exchangeRateTimestamps',
			label: 'exchange rate timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.HederaNetworkExchangeRate_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$stakeTimestamps',
			label: 'stake timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.HederaNetworkStake_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$supplyTimestamps',
			label: 'supply timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.HederaNetworkSupply_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
