import { type } from 'arktype'
import { ExecutionClientId } from '$/constants/ExecutionEndpoints.ts'
import { NetworkEnvironment } from '$/constants/NetworkEnvironment.ts'
import { ExecutionRpcProvider } from '$/constants/ExecutionRpcProvider.ts'
import { TransportType } from '$/constants/TransportType.ts'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'

const executionEndpointField = type({
	chainId: 'number',
	url: 'string',
	serviceProvider: type.valueOf(ExecutionRpcProvider),
	transportType: type.valueOf(TransportType),
	'tevmForkTransportCompatible?': 'boolean',
	'executionClient?': type.valueOf(ExecutionClientId),
	'chainlistFallbackDisplay?': type({
		name: 'string',
		nativeSymbol: 'string',
		explorerOrigin: 'string',
	}),
})

const networkParentLayerField = type({
	bridgeUrls: type('string').array(),
	parentChainCaip: 'string',
	parentChainId: 'number',
	relationshipType: 'string',
})

export default {
	entityType: EntityType.Network,

	label: 'Network',
	labelPlural: 'Networks',

	id: type({
		chainId: 'number',
	}),

	fields: [
		{
			name: 'name',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
			defaultSources: [Source.Chainlist_Rest, Source.EthereumLists_Rest],
		},
		{
			name: 'nativeSymbol',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [Source.Chainlist_Rest, Source.EthereumLists_Rest],
		},
		{
			name: 'explorerOrigin',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [Source.Chainlist_Rest, Source.EthereumLists_Rest],
		},
		{
			name: 'rpcUrl',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [Source.Chainlist_Rest, Source.EthereumLists_Rest],
		},
		{
			name: 'lifiKey',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [Source.Lifi_Rest],
		},
		{
			name: 'explorers',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.Constants_Internal,
				Source.Chainlist_Rest,
				Source.EthereumLists_Rest,
				Source.Lifi_Rest,
			],
		},
		{
			name: 'executionEndpoints',
			type: EntityFieldType.Primitive,
			primitiveType: executionEndpointField,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.Constants_Internal,
				Source.Chainlist_Rest,
				Source.EthereumLists_Rest,
				Source.Lifi_Rest,
			],
		},
		{
			name: 'environment',
			type: EntityFieldType.Primitive,
			primitiveType: type.valueOf(NetworkEnvironment),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [Source.Chainlist_Rest, Source.EthereumLists_Rest],
		},
		{
			name: 'parentLayer',
			type: EntityFieldType.Primitive,
			primitiveType: networkParentLayerField,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [Source.Chainlist_Rest, Source.EthereumLists_Rest],
		},
		{
			name: 'childLayerChainIds',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [Source.Chainlist_Rest, Source.EthereumLists_Rest],
		},
		{
			name: 'correspondingChainIds',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [Source.Chainlist_Rest, Source.EthereumLists_Rest],
		},
		{
			name: 'siblingShardChainIds',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [Source.Chainlist_Rest, Source.EthereumLists_Rest],
		},
		{
			name: 'shortName',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [Source.Chainlist_Rest, Source.EthereumLists_Rest],
		},
		{
			name: 'registryStatus',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [Source.Chainlist_Rest, Source.EthereumLists_Rest],
		},
		{
			name: 'registryNetworkId',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [Source.Chainlist_Rest, Source.EthereumLists_Rest],
		},
		{
			name: 'faucets',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [Source.Chainlist_Rest, Source.EthereumLists_Rest],
		},
		{
			name: 'slip44',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [Source.Chainlist_Rest, Source.EthereumLists_Rest],
		},
		{
			name: 'chainIcon',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [Source.Chainlist_Rest, Source.EthereumLists_Rest],
		},
		{
			name: '$$childNetworks',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.Network,
			cardinality: EntityFieldCardinality.ZeroOrMany,
			defaultSources: [Source.Chainlist_Rest, Source.EthereumLists_Rest],
		},
		{
			name: '$$forks',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.NetworkFork,
			cardinality: EntityFieldCardinality.ZeroOrMany,
			defaultSources: [Source.Constants_Internal],
		},
		{
			name: 'blockHeight',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.One,
			defaultSources: [Source.Voltaire_JsonRpc],
		},
		{
			name: '$$evmBlocks',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.EvmBlock,
			cardinality: EntityFieldCardinality.ZeroOrMany,
			defaultSources: [Source.Voltaire_JsonRpc, Source.Blockscout_Rest],
		},
		{
			name: '$$evmTransactions',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.EvmTransaction,
			cardinality: EntityFieldCardinality.ZeroOrMany,
			defaultSources: [Source.Blockscout_Rest],
		},
		{
			name: '$$evmContracts',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.EvmContract,
			cardinality: EntityFieldCardinality.ZeroOrMany,
			defaultSources: [Source.Blockscout_Rest],
		},
		{
			name: '$$beaconEpochs',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.BeaconEpoch,
			cardinality: EntityFieldCardinality.ZeroOrMany,
			defaultSources: [Source.Beacon_Rest],
		},
		{
			name: '$$beaconSlots',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.BeaconSlot,
			cardinality: EntityFieldCardinality.ZeroOrMany,
			defaultSources: [Source.Beacon_Rest],
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition

