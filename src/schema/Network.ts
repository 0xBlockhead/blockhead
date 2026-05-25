import { type } from 'arktype'
import { NetworkEnvironment } from '$/constants/Network.ts'
import { ConsensusProtocol } from '$/schema/NetworkUpgradeProtocols.ts'
import { ExecutionRpcProvider } from '$/constants/ExecutionRpcProvider.ts'
import { TransportType } from '$/constants/TransportType.ts'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { UrlString } from '$/schema/$Url.ts'
import { Source } from '$/sources/$Source.ts'

const executionEndpointField = type({
	url: UrlString,
	serviceProvider: type.valueOf(ExecutionRpcProvider),
	transportType: type.valueOf(TransportType),
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
			name: '$nativeCoin',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Coin,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Chainlist_Rest,
				Source.EthereumLists_Rest,
			],
		},
		{
			name: '$nativeCoinInstance',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.CoinInstance,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Chainlist_Rest,
				Source.EthereumLists_Rest,
			],
		},
		{
			name: '$$blockExplorerUrls',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.Url,
			cardinality: EntityFieldCardinality.ZeroOrMany,
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
			name: '$$rpcUrls',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.Url,
			cardinality: EntityFieldCardinality.ZeroOrMany,
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
			name: '$parentLayer',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Network,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Chainlist_Rest,
				Source.EthereumLists_Rest,
				Source.Superchain_Github,
				Source.L2Beat_Rest,
			],
		},
		{
			name: 'layerNumber',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
			defaultSources: [
				Source.Chainlist_Rest,
				Source.EthereumLists_Rest,
			],
		},
		{
			name: '$$childLayers',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.Network,
			cardinality: EntityFieldCardinality.ZeroOrMany,
			defaultSources: [
				Source.Chainlist_Rest,
				Source.EthereumLists_Rest,
				Source.Superchain_Github,
				Source.L2Beat_Rest,
			],
		},
		{
			name: '$$testnets',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.Network,
			cardinality: EntityFieldCardinality.ZeroOrMany,
			defaultSources: [
				Source.Chainlist_Rest,
				Source.Superchain_Github,
			],
		},
		{
			name: '$mainnet',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Network,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Chainlist_Rest,
				Source.Superchain_Github,
			],
		},
		{
			name: '$$siblingShardNetworks',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.Network,
			cardinality: EntityFieldCardinality.ZeroOrMany,
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
			name: '$$faucetUrls',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.Url,
			cardinality: EntityFieldCardinality.ZeroOrMany,
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
			name: '$$upgrades',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.NetworkUpgrade,
			cardinality: EntityFieldCardinality.ZeroOrMany,
			defaultSources: [
				Source.Constants_Internal,
			],
		},
		{
			name: '$$executionUpgrades',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.NetworkExecutionUpgrade,
			cardinality: EntityFieldCardinality.ZeroOrMany,
			defaultSources: [
				Source.Constants_Internal,
			],
		},
		{
			name: '$$consensusUpgrades',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.NetworkConsensusUpgrade,
			cardinality: EntityFieldCardinality.ZeroOrMany,
			defaultSources: [
				Source.Constants_Internal,
			],
		},
		{
			name: 'consensusProtocol',
			type: EntityFieldType.Primitive,
			primitiveType: type.valueOf(ConsensusProtocol),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Constants_Internal,
			],
		},
		{
			name: 'consensusSpecsConfigYaml',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.EthereumSpecs_Github,
			],
		},
		{
			name: 'goEthereumParamsConfigGo',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.EthereumSpecs_Github,
			],
		},
		{
			name: 'hasBlobParameterExecutionUpgrade',
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
			name: '$$gasFeeBlocks',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.Network_GasFee_Block,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.Voltaire_JsonRpc,
			],
		},
		{
			name: '$$gasEstimateTimestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.Network_GasEstimate_Timestamp,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.Blockscout_Rest,
				Source.Etherscan_Rest,
			],
		},
		{
			name: '$$txpoolTimestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.Network_Txpool_Timestamp,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.Voltaire_JsonRpc,
			],
		},
		{
			name: '$$mevProposerPayloadDelivered',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.MevRelay_ProposerPayloadDelivered,
			cardinality: EntityFieldCardinality.ZeroOrMany,
			defaultSources: [
				Source.MevRelay_Rest,
			],
		},
		{
			name: '$$precompiles',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.EvmContract,
			cardinality: EntityFieldCardinality.ZeroOrMany,
			defaultSources: [
				Source.Constants_Internal,
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
			name: '$$erc4337SmartAccounts',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.Erc4337SmartAccount,
			cardinality: EntityFieldCardinality.ZeroOrMany,
			defaultSources: [
				Source.Blockscout_Rest,
			],
		},
		{
			name: '$$erc4337Bundlers',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.Erc4337Bundler,
			cardinality: EntityFieldCardinality.ZeroOrMany,
			defaultSources: [
				Source.Blockscout_Rest,
			],
		},
		{
			name: '$$erc4337Paymasters',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.Erc4337Paymaster,
			cardinality: EntityFieldCardinality.ZeroOrMany,
			defaultSources: [
				Source.Blockscout_Rest,
			],
		},
		{
			name: '$$erc4337AccountFactories',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.Erc4337AccountFactory,
			cardinality: EntityFieldCardinality.ZeroOrMany,
			defaultSources: [
				Source.Blockscout_Rest,
			],
		},
		{
			name: '$$userOperations',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.EvmUserOperation,
			cardinality: EntityFieldCardinality.ZeroOrMany,
			defaultSources: [
				Source.Blockscout_Rest,
			],
		},
		{
			name: 'beaconPreviousJustifiedCheckpointEpoch',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Beacon_Rest,
			],
		},
		{
			name: 'beaconPreviousJustifiedCheckpointRoot',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Beacon_Rest,
			],
		},
		{
			name: 'beaconCurrentJustifiedCheckpointEpoch',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Beacon_Rest,
			],
		},
		{
			name: 'beaconCurrentJustifiedCheckpointRoot',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Beacon_Rest,
			],
		},
		{
			name: 'beaconFinalizedCheckpointEpoch',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Beacon_Rest,
			],
		},
		{
			name: 'beaconFinalizedCheckpointRoot',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Beacon_Rest,
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
		{
			name: '$$beaconValidators',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.BeaconValidator,
			cardinality: EntityFieldCardinality.ZeroOrMany,
			defaultSources: [
				Source.Beacon_Rest,
			],
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition

