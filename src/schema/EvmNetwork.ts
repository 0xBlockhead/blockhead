import { type } from 'arktype'
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
import { networkFieldByName } from '$/schema/Network.ts'
import { UrlString } from '$/schema/$Url.ts'
import { Source } from '$/sources/$Source.ts'

const executionEndpointField = type({
	url: UrlString,
	serviceProvider: type.valueOf(ExecutionRpcProvider),
	transportType: type.valueOf(TransportType),
})

export default {
	entityType: EntityType.EvmNetwork,

	label: 'EVM network',
	labelPlural: 'EVM networks',

	id: type({
		caip2: {
			namespace: type.unit('eip155'),
			reference: 'string',
		},
	}),

	fields: [
		networkFieldByName.slug,
		networkFieldByName.name,
		networkFieldByName.caip2,
		networkFieldByName.namespace,
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
			entityType: EntityType.EvmCoinInstance,
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
		networkFieldByName.environment,
		networkFieldByName.$parent,
		networkFieldByName.layerNumber,
		networkFieldByName.$mainnet,
		networkFieldByName.$$testnets,
		networkFieldByName.$$childLayers,
		{
			name: '$$siblingShardNetworks',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.EvmNetwork,
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
		networkFieldByName.$icon,
		{
			name: '$$upgrades',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.EthereumNetworkUpgrade,
			cardinality: EntityFieldCardinality.ZeroOrMany,
			defaultSources: [
				Source.Constants_Internal,
			],
		},
		{
			name: '$$executionUpgrades',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.EthereumExecutionUpgrade,
			cardinality: EntityFieldCardinality.ZeroOrMany,
			defaultSources: [
				Source.Constants_Internal,
			],
		},
		{
			name: '$$consensusUpgrades',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.EthereumConsensusUpgrade,
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
			entityType: EntityType.EvmNetworkBridge,
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
			entityType: EntityType.EvmNetwork_GasFee_Block,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.Voltaire_JsonRpc,
			],
		},
		{
			name: '$$gasEstimateTimestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.EvmNetwork_GasEstimate_Timestamp,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.Blockscout_Rest,
				Source.Etherscan_Rest,
			],
		},
		{
			name: '$$txpoolTimestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.EvmNetwork_Txpool_Timestamp,
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
			name: '$$beaconFinalityTimestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.EthereumBeaconFinality_Timestamp,
			cardinality: EntityFieldCardinality.ZeroOrMany,
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
