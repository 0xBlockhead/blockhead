import { type } from 'arktype'
import { CoinId } from '$/constants/Coin.ts'
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
	url: 'string',
	serviceProvider: type.valueOf(ExecutionRpcProvider),
	transportType: type.valueOf(TransportType),
})

const blockExplorerField = type({
	origin: 'string',
	'name?': 'string',
	'standard?': 'string',
	'icon?': 'string',
})

const nativeCurrencyField = type({
	name: 'string',
	symbol: 'string',
	decimals: 'number',
	'coinId?': type.valueOf(CoinId),
	'slip44?': 'number',
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
			defaultSources: [
				Source.Chainlist_Rest,
				Source.EthereumLists_Rest,
			],
		},
		{
			name: 'nativeCurrencies',
			type: EntityFieldType.Primitive,
			primitiveType: nativeCurrencyField,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.Chainlist_Rest,
				Source.EthereumLists_Rest,
			],
		},
		{
			name: 'blockExplorers',
			type: EntityFieldType.Primitive,
			primitiveType: blockExplorerField,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
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
			defaultSources: [
				Source.Chainlist_Rest,
				Source.EthereumLists_Rest,
			],
		},
		{
			name: 'parentLayer',
			type: EntityFieldType.Primitive,
			primitiveType: networkParentLayerField,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Chainlist_Rest,
				Source.EthereumLists_Rest,
			],
		},
		{
			name: 'rollupLayerNumber',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
			defaultSources: [
				Source.Chainlist_Rest,
				Source.EthereumLists_Rest,
			],
		},
		{
			name: 'childLayerChainIds',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.Chainlist_Rest,
				Source.EthereumLists_Rest,
			],
		},
		{
			name: 'correspondingChainIds',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.Chainlist_Rest,
				Source.EthereumLists_Rest,
			],
		},
		{
			name: 'siblingShardChainIds',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.Chainlist_Rest,
				Source.EthereumLists_Rest,
			],
		},
		{
			name: 'shortName',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Chainlist_Rest,
				Source.EthereumLists_Rest,
			],
		},
		{
			name: 'registryStatus',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Chainlist_Rest,
				Source.EthereumLists_Rest,
			],
		},
		{
			name: 'peeringId',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Chainlist_Rest,
				Source.EthereumLists_Rest,
			],
		},
		{
			name: 'faucets',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.Chainlist_Rest,
				Source.EthereumLists_Rest,
			],
		},
		{
			name: 'slip44',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Chainlist_Rest,
				Source.EthereumLists_Rest,
			],
		},
		{
			name: '$icon',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Media,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Chainlist_Rest,
				Source.EthereumLists_Rest,
				Source.Lifi_Rest,
			],
		},
		{
			name: '$$childNetworks',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.Network,
			cardinality: EntityFieldCardinality.ZeroOrMany,
			defaultSources: [
				Source.Chainlist_Rest,
				Source.EthereumLists_Rest,
			],
		},
		{
			name: '$$forks',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.NetworkFork,
			cardinality: EntityFieldCardinality.ZeroOrMany,
			defaultSources: [
				Source.Constants_Internal,
			],
		},
		{
			name: 'hasCatalogedBlobScheduleFork',
			type: EntityFieldType.Primitive,
			primitiveType: type('boolean'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Constants_Internal,
			],
		},
		{
			name: '$$bridges',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.NetworkBridge,
			cardinality: EntityFieldCardinality.ZeroOrMany,
			defaultSources: [
				Source.Chainlist_Rest,
				Source.EthereumLists_Rest,
			],
		},
		{
			name: 'gasPrice',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Voltaire_JsonRpc,
			],
		},
		{
			name: 'baseFeePerGas',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Voltaire_JsonRpc,
			],
		},
		{
			name: 'gasUsedRatio',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Voltaire_JsonRpc,
			],
		},
		{
			name: '$$blobs',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.EvmBlob,
			cardinality: EntityFieldCardinality.ZeroOrMany,
			defaultSources: [
				Source.Voltaire_JsonRpc,
			],
		},
		{
			name: 'blockHeight',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.One,
			defaultSources: [
				Source.Voltaire_JsonRpc,
			],
		},
		{
			name: '$$blocks',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.EvmBlock,
			cardinality: EntityFieldCardinality.ZeroOrMany,
			defaultSources: [
				Source.Voltaire_JsonRpc,
				Source.Blockscout_Rest,
			],
		},
		{
			name: '$$transactions',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.EvmTransaction,
			cardinality: EntityFieldCardinality.ZeroOrMany,
			defaultSources: [
				Source.Blockscout_Rest,
			],
		},
		{
			name: '$$contracts',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.EvmContract,
			cardinality: EntityFieldCardinality.ZeroOrMany,
			defaultSources: [
				Source.Blockscout_Rest,
			],
		},
		{
			name: '$$beaconEpochs',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.BeaconEpoch,
			cardinality: EntityFieldCardinality.ZeroOrMany,
			defaultSources: [
				Source.Beacon_Rest,
			],
		},
		{
			name: '$$beaconSlots',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.BeaconSlot,
			cardinality: EntityFieldCardinality.ZeroOrMany,
			defaultSources: [
				Source.Beacon_Rest,
			],
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition

