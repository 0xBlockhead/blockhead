import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum CronosNetworkProfileSelector {
	Network = '$network',
}
export default {
	entityType: EntityType.CronosNetworkProfile,
	label: 'cronos network profile',
	labelPlural: 'cronos network profiles',
	selectors: [
		{
			name: CronosNetworkProfileSelector.Network,
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
			name: '$evmNetwork',
			label: 'EVM network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmNetwork,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$cosmosNetwork',
			label: 'Cosmos network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.CosmosNetwork,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'chainKind',
			label: 'chain kind',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'consensusKind',
			label: 'consensus kind',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'bech32Prefix',
			label: 'bech32 prefix',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'evmChainId',
			label: 'EVM chain ID',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'cosmosChainId',
			label: 'Cosmos chain ID',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$ibcChannels',
			label: 'ibc channels',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.IbcChannel,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.Network_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
