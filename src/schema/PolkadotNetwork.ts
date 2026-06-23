import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum PolkadotNetworkSelector {
	Network = 'network',
}
export default {
	entityType: EntityType.PolkadotNetwork,
	label: 'polkadot network',
	labelPlural: 'polkadot networks',
	selectors: [
		{
			name: PolkadotNetworkSelector.Network,
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
			name: 'rpcEndpoints',
			label: 'RPC endpoints',
			type: EntityFieldType.Primitive,
			primitiveType: type({"url": "string", "transportType": "string", "providerName": "string"}),
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.PolkadotNetwork_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$blocks',
			label: 'blocks',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.PolkadotBlock,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$assets',
			label: 'assets',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.PolkadotAsset,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$assetBalanceTimestamps',
			label: 'asset balance timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.PolkadotAssetBalance_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$validators',
			label: 'validators',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.PolkadotValidator,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
