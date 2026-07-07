// Generated from APP.ts. Do not edit by hand.

import { Caip2Namespace, Caip2Reference, NetworkExecutionModel, NetworkLedgerModel, NetworkNamespace } from '$/constants/Network.ts'
import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ConsensusProtocol } from '$/schema/NetworkUpgradeProtocols.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum NetworkSelector {
	Caip2 = 'Caip2',
	Slug = 'Slug',
}
export default {
	entityType: EntityType.Network,
	label: 'Network',
	labelPlural: 'networks',
	description: 'A blockchain, ledger, or protocol network with its own identity and supporting metadata.',
	selectors: [
		{
			name: NetworkSelector.Caip2,
			fields: [
				'caip2',
			],
		},
		{
			name: NetworkSelector.Slug,
			fields: [
				'slug',
			],
		},
	],
	fields: [
		{
			name: 'caip2',
			label: 'CAIP-2',
			description: 'The chain identifier in CAIP-2 namespace and reference form.',
			type: EntityFieldType.Primitive,
			primitiveType: type({ 'namespace': type.enumerated(...Object.values(Caip2Namespace)), 'reference': type.enumerated(...Object.values(Caip2Reference)) }),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'slug',
			label: 'Slug',
			description: 'A stable short name used by catalogs and URLs.',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'name',
			label: 'Name',
			description: 'The human-readable name of the subject.',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'namespace',
			label: 'Namespace',
			description: 'The namespace that qualifies the identifier.',
			type: EntityFieldType.Primitive,
			primitiveType: type.enumerated(...Object.values(NetworkNamespace)),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'ledgerModels',
			label: 'Ledger models',
			description: 'Irreducible ledger-state models supported by the network.',
			type: EntityFieldType.Primitive,
			primitiveType: type.enumerated(...Object.values(NetworkLedgerModel)),
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.Constants_Internal,
			],
		},
		{
			name: 'executionModels',
			label: 'Execution models',
			description: 'Irreducible execution/runtime models supported by the network.',
			type: EntityFieldType.Primitive,
			primitiveType: type.enumerated(...Object.values(NetworkExecutionModel)),
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.Constants_Internal,
			],
		},
		{
			name: '$networkStack',
			label: 'Network stack',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.NetworkStack,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Constants_Internal,
			],
		},
		{
			name: 'environment',
			label: 'Environment',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'iconUrl',
			label: 'Icon URL',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$icon',
			label: 'Icon',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Media,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$nativeAssets',
			label: 'Native assets',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.AssetInstance,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$blockExplorerUrls',
			label: 'Block explorer URLs',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.Url,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$faucetUrls',
			label: 'Faucet URLs',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.Url,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$timestamps',
			label: 'Timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.Network_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: 'evmShortName',
			label: 'Short name',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			facet: {
				id: 'Evm',
				predicateFields: [
					'executionModels',
				],
				predicate: {
					field: 'executionModels',
					contains: 'Evm',
				},
			},
		},
		{
			name: 'evmRegistryStatus',
			label: 'Registry name status',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			facet: {
				id: 'Evm',
				predicateFields: [
					'executionModels',
				],
				predicate: {
					field: 'executionModels',
					contains: 'Evm',
				},
			},
		},
		{
			name: 'evmPeeringId',
			label: 'Peering ID',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			facet: {
				id: 'Evm',
				predicateFields: [
					'executionModels',
				],
				predicate: {
					field: 'executionModels',
					contains: 'Evm',
				},
			},
		},
		{
			name: 'evmSlip44',
			label: 'SLIP-44',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			facet: {
				id: 'Evm',
				predicateFields: [
					'executionModels',
				],
				predicate: {
					field: 'executionModels',
					contains: 'Evm',
				},
			},
		},
		{
			name: 'evmConsensusProtocol',
			label: 'Consensus protocol',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Constants_Internal,
			],
			facet: {
				id: 'Evm',
				predicateFields: [
					'executionModels',
				],
				predicate: {
					field: 'executionModels',
					contains: 'Evm',
				},
			},
		},
		{
			name: '$evmParent',
			label: 'Parent network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Network,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			facet: {
				id: 'Evm',
				predicateFields: [
					'executionModels',
				],
				predicate: {
					field: 'executionModels',
					contains: 'Evm',
				},
			},
		},
		{
			name: '$evmMainnet',
			label: 'Mainnet',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Network,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			facet: {
				id: 'Evm',
				predicateFields: [
					'executionModels',
				],
				predicate: {
					field: 'executionModels',
					contains: 'Evm',
				},
			},
		},
		{
			name: '$evmRollup',
			label: 'Rollup',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmRollup,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			facet: {
				id: 'Evm',
				predicateFields: [
					'executionModels',
				],
				predicate: {
					field: 'executionModels',
					contains: 'Evm',
				},
			},
		},
		{
			name: '$$evmUpgrades',
			label: 'Upgrades',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.EthereumNetworkUpgrade,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.Constants_Internal,
			],
			facet: {
				id: 'Evm',
				predicateFields: [
					'executionModels',
				],
				predicate: {
					field: 'executionModels',
					contains: 'Evm',
				},
			},
		},
		{
			name: '$$evmExecutionUpgrades',
			label: 'Execution upgrades',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.EthereumExecutionUpgrade,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.Constants_Internal,
			],
			facet: {
				id: 'Evm',
				predicateFields: [
					'executionModels',
				],
				predicate: {
					field: 'executionModels',
					contains: 'Evm',
				},
			},
		},
		{
			name: '$$evmConsensusUpgrades',
			label: 'Consensus upgrades',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.EthereumConsensusUpgrade,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.Constants_Internal,
			],
			facet: {
				id: 'Evm',
				predicateFields: [
					'executionModels',
				],
				predicate: {
					field: 'executionModels',
					contains: 'Evm',
				},
			},
		},
		{
			name: '$$evmTimestamps',
			label: 'EVM observations',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.EvmNetwork_Timestamp,
			cardinality: EntityFieldCardinality.ZeroOrMany,
			defaultSources: [
				Source.Voltaire_JsonRpc,
			],
			facet: {
				id: 'Evm',
				predicateFields: [
					'executionModels',
				],
				predicate: {
					field: 'executionModels',
					contains: 'Evm',
				},
			},
		},
		{
			name: '$$evmBlocks',
			label: 'Blocks',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.EvmBlock,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.Voltaire_JsonRpc,
				Source.Blockscout_Rest,
			],
			facet: {
				id: 'Evm',
				predicateFields: [
					'executionModels',
				],
				predicate: {
					field: 'executionModels',
					contains: 'Evm',
				},
			},
		},
		{
			name: '$$evmTransactions',
			label: 'Transactions',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.EvmTransaction,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.Blockscout_Rest,
			],
			facet: {
				id: 'Evm',
				predicateFields: [
					'executionModels',
				],
				predicate: {
					field: 'executionModels',
					contains: 'Evm',
				},
			},
		},
		{
			name: '$$evmTxpoolTimestamps',
			label: 'Txpool timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.EvmNetwork_Txpool_Timestamp,
			cardinality: EntityFieldCardinality.ZeroOrMany,
			defaultSources: [
				Source.Voltaire_JsonRpc,
			],
			facet: {
				id: 'Evm',
				predicateFields: [
					'executionModels',
				],
				predicate: {
					field: 'executionModels',
					contains: 'Evm',
				},
			},
		},
		{
			name: '$$evmGasFeeBlocks',
			label: 'Gas fee blocks',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.EvmNetwork_GasFee_Block,
			cardinality: EntityFieldCardinality.ZeroOrMany,
			defaultSources: [
				Source.Voltaire_JsonRpc,
			],
			facet: {
				id: 'Evm',
				predicateFields: [
					'executionModels',
				],
				predicate: {
					field: 'executionModels',
					contains: 'Evm',
				},
			},
		},
		{
			name: '$$evmGasEstimateTimestamps',
			label: 'Gas estimate timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.EvmNetwork_GasEstimate_Timestamp,
			cardinality: EntityFieldCardinality.ZeroOrMany,
			defaultSources: [
				Source.Blockscout_Rest,
				Source.Etherscan_Rest,
			],
			facet: {
				id: 'Evm',
				predicateFields: [
					'executionModels',
				],
				predicate: {
					field: 'executionModels',
					contains: 'Evm',
				},
			},
		},
		{
			name: '$$evmRpcUrls',
			label: 'RPC URLs',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.Url,
			cardinality: EntityFieldCardinality.Many,
			facet: {
				id: 'Evm',
				predicateFields: [
					'executionModels',
				],
				predicate: {
					field: 'executionModels',
					contains: 'Evm',
				},
			},
		},
		{
			name: 'evmConsensusEndpoints',
			label: 'Consensus endpoints',
			type: EntityFieldType.Primitive,
			primitiveType: type({ 'restBaseUrl': type('string'), 'consensusProtocol': type.enumerated(...Object.values(ConsensusProtocol)) }),
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.Constants_Internal,
			],
			facet: {
				id: 'Evm',
				predicateFields: [
					'executionModels',
				],
				predicate: {
					field: 'executionModels',
					contains: 'Evm',
				},
			},
		},
		{
			name: '$$evmBeaconFinalityTimestamps',
			label: 'Beacon finality timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.EthereumBeaconFinality_Timestamp,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.Beacon_Rest,
			],
			facet: {
				id: 'Evm',
				predicateFields: [
					'executionModels',
				],
				predicate: {
					field: 'executionModels',
					contains: 'Evm',
				},
			},
		},
		{
			name: '$$evmBeaconEpochs',
			label: 'Beacon epochs',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.BeaconEpoch,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.Beacon_Rest,
			],
			facet: {
				id: 'Evm',
				predicateFields: [
					'executionModels',
				],
				predicate: {
					field: 'executionModels',
					contains: 'Evm',
				},
			},
		},
		{
			name: '$$evmBeaconSlots',
			label: 'Beacon slots',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.BeaconSlot,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.Beacon_Rest,
			],
			facet: {
				id: 'Evm',
				predicateFields: [
					'executionModels',
				],
				predicate: {
					field: 'executionModels',
					contains: 'Evm',
				},
			},
		},
		{
			name: '$$evmBeaconCommittees',
			label: 'Beacon committees',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.BeaconCommittee,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.Beacon_Rest,
			],
			facet: {
				id: 'Evm',
				predicateFields: [
					'executionModels',
				],
				predicate: {
					field: 'executionModels',
					contains: 'Evm',
				},
			},
		},
		{
			name: '$$evmBeaconSyncCommittees',
			label: 'Beacon sync committees',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.BeaconSyncCommittee,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.Beacon_Rest,
			],
			facet: {
				id: 'Evm',
				predicateFields: [
					'executionModels',
				],
				predicate: {
					field: 'executionModels',
					contains: 'Evm',
				},
			},
		},
		{
			name: '$$evmBeaconAttestations',
			label: 'Beacon attestations',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.BeaconAttestation,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.Beacon_Rest,
			],
			facet: {
				id: 'Evm',
				predicateFields: [
					'executionModels',
				],
				predicate: {
					field: 'executionModels',
					contains: 'Evm',
				},
			},
		},
		{
			name: '$$evmBeaconWithdrawals',
			label: 'Beacon withdrawals',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.BeaconWithdrawal,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.Beacon_Rest,
			],
			facet: {
				id: 'Evm',
				predicateFields: [
					'executionModels',
				],
				predicate: {
					field: 'executionModels',
					contains: 'Evm',
				},
			},
		},
		{
			name: '$$evmBeaconSlashings',
			label: 'Beacon slashings',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.BeaconSlashing,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.Beacon_Rest,
			],
			facet: {
				id: 'Evm',
				predicateFields: [
					'executionModels',
				],
				predicate: {
					field: 'executionModels',
					contains: 'Evm',
				},
			},
		},
		{
			name: '$$evmBeaconValidators',
			label: 'Beacon validators',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.BeaconValidator,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.Beacon_Rest,
			],
			facet: {
				id: 'Evm',
				predicateFields: [
					'executionModels',
				],
				predicate: {
					field: 'executionModels',
					contains: 'Evm',
				},
			},
		},
		{
			name: '$$evmMevRelays',
			label: 'MEV relays',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.MevRelay,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.Constants_Internal,
			],
			facet: {
				id: 'Evm',
				predicateFields: [
					'executionModels',
				],
				predicate: {
					field: 'executionModels',
					contains: 'Evm',
				},
			},
		},
		{
			name: '$$evmMevBuilders',
			label: 'MEV builders',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.MevBuilder,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.MevRelay_Rest,
			],
			facet: {
				id: 'Evm',
				predicateFields: [
					'executionModels',
				],
				predicate: {
					field: 'executionModels',
					contains: 'Evm',
				},
			},
		},
		{
			name: '$$evmMevProposerPayloadDelivered',
			label: 'MEV proposer payloads delivered',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.MevRelay_ProposerPayloadDelivered,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.MevRelay_Rest,
			],
			facet: {
				id: 'Evm',
				predicateFields: [
					'executionModels',
				],
				predicate: {
					field: 'executionModels',
					contains: 'Evm',
				},
			},
		},
		{
			name: '$$evmBlobs',
			label: 'Blobs',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.EvmBlob,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.Voltaire_JsonRpc,
			],
			facet: {
				id: 'Evm',
				predicateFields: [
					'executionModels',
				],
				predicate: {
					field: 'executionModels',
					contains: 'Evm',
				},
			},
		},
		{
			name: '$$evmContracts',
			label: 'Contracts',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.EvmContract,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.Blockscout_Rest,
			],
			facet: {
				id: 'Evm',
				predicateFields: [
					'executionModels',
				],
				predicate: {
					field: 'executionModels',
					contains: 'Evm',
				},
			},
		},
		{
			name: '$$evmPrecompiles',
			label: 'Precompiles',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.EvmContract,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.Constants_Internal,
			],
			facet: {
				id: 'Evm',
				predicateFields: [
					'executionModels',
				],
				predicate: {
					field: 'executionModels',
					contains: 'Evm',
				},
			},
		},
		{
			name: '$evmNativeCoin',
			label: 'Native coin',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Coin,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Constants_Internal,
			],
			facet: {
				id: 'Evm',
				predicateFields: [
					'executionModels',
				],
				predicate: {
					field: 'executionModels',
					contains: 'Evm',
				},
			},
		},
		{
			name: '$evmNativeCoinInstance',
			label: 'Native coin instance',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmCoinInstance,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Constants_Internal,
			],
			facet: {
				id: 'Evm',
				predicateFields: [
					'executionModels',
				],
				predicate: {
					field: 'executionModels',
					contains: 'Evm',
				},
			},
		},
		{
			name: '$$evmErc4337SmartAccounts',
			label: 'ERC-4337 smart accounts',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.Erc4337SmartAccount,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.Blockscout_Rest,
			],
			facet: {
				id: 'Evm',
				predicateFields: [
					'executionModels',
				],
				predicate: {
					field: 'executionModels',
					contains: 'Evm',
				},
			},
		},
		{
			name: '$$evmErc4337Bundlers',
			label: 'ERC-4337 bundlers',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.Erc4337Bundler,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.Blockscout_Rest,
			],
			facet: {
				id: 'Evm',
				predicateFields: [
					'executionModels',
				],
				predicate: {
					field: 'executionModels',
					contains: 'Evm',
				},
			},
		},
		{
			name: '$$evmErc4337Paymasters',
			label: 'ERC-4337 paymasters',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.Erc4337Paymaster,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.Blockscout_Rest,
			],
			facet: {
				id: 'Evm',
				predicateFields: [
					'executionModels',
				],
				predicate: {
					field: 'executionModels',
					contains: 'Evm',
				},
			},
		},
		{
			name: '$$evmErc4337AccountFactories',
			label: 'ERC-4337 account factories',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.Erc4337AccountFactory,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.Blockscout_Rest,
			],
			facet: {
				id: 'Evm',
				predicateFields: [
					'executionModels',
				],
				predicate: {
					field: 'executionModels',
					contains: 'Evm',
				},
			},
		},
		{
			name: '$$evmUserOperations',
			label: 'User operations',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.EvmUserOperation,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.Blockscout_Rest,
			],
			facet: {
				id: 'Evm',
				predicateFields: [
					'executionModels',
				],
				predicate: {
					field: 'executionModels',
					contains: 'Evm',
				},
			},
		},
		{
			name: '$$evmBridges',
			label: 'Bridges',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.EvmNetworkBridge,
			cardinality: EntityFieldCardinality.Many,
			facet: {
				id: 'Evm',
				predicateFields: [
					'executionModels',
				],
				predicate: {
					field: 'executionModels',
					contains: 'Evm',
				},
			},
		},
		{
			name: '$$evmErc20TokenTransfers',
			label: 'ERC-20 token transfers',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.EvmTokenTransfer,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.Blockscout_Rest,
			],
			facet: {
				id: 'Evm',
				predicateFields: [
					'executionModels',
				],
				predicate: {
					field: 'executionModels',
					contains: 'Evm',
				},
			},
		},
		{
			name: '$$evmNftTokenTransfers',
			label: 'NFT token transfers',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.EvmTokenTransfer,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.Blockscout_Rest,
			],
			facet: {
				id: 'Evm',
				predicateFields: [
					'executionModels',
				],
				predicate: {
					field: 'executionModels',
					contains: 'Evm',
				},
			},
		},
		{
			name: '$$evmTestnets',
			label: 'Testnets',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.Network,
			cardinality: EntityFieldCardinality.Many,
			facet: {
				id: 'Evm',
				predicateFields: [
					'executionModels',
				],
				predicate: {
					field: 'executionModels',
					contains: 'Evm',
				},
			},
		},
		{
			name: '$$evmChildLayers',
			label: 'Child layers',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.Network,
			cardinality: EntityFieldCardinality.Many,
			facet: {
				id: 'Evm',
				predicateFields: [
					'executionModels',
				],
				predicate: {
					field: 'executionModels',
					contains: 'Evm',
				},
			},
		},
		{
			name: '$$evmSiblingShardNetworks',
			label: 'Sibling shard networks',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.EvmNetwork,
			cardinality: EntityFieldCardinality.Many,
			facet: {
				id: 'Evm',
				predicateFields: [
					'executionModels',
				],
				predicate: {
					field: 'executionModels',
					contains: 'Evm',
				},
			},
		},
		{
			name: '$$evmSettledRollups',
			label: 'Settled rollups',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.EvmRollup,
			cardinality: EntityFieldCardinality.Many,
			facet: {
				id: 'Evm',
				predicateFields: [
					'executionModels',
				],
				predicate: {
					field: 'executionModels',
					contains: 'Evm',
				},
			},
		},
		{
			name: 'cosmosRestEndpoints',
			label: 'REST endpoints',
			type: EntityFieldType.Primitive,
			primitiveType: type({ 'url': type('string'), 'transportType': type('string'), 'providerName': type('string') }),
			cardinality: EntityFieldCardinality.Many,
			facet: {
				id: 'Cosmos',
				predicateFields: [
					'executionModels',
				],
				predicate: {
					field: 'executionModels',
					contains: 'CosmosSdk',
				},
			},
		},
		{
			name: '$$cosmosBlocks',
			label: 'Blocks',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.CosmosBlock,
			cardinality: EntityFieldCardinality.Many,
			facet: {
				id: 'Cosmos',
				predicateFields: [
					'executionModels',
				],
				predicate: {
					field: 'executionModels',
					contains: 'CosmosSdk',
				},
			},
		},
		{
			name: '$$cosmosAccounts',
			label: 'Accounts',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.CosmosAccount,
			cardinality: EntityFieldCardinality.Many,
			facet: {
				id: 'Cosmos',
				predicateFields: [
					'executionModels',
				],
				predicate: {
					field: 'executionModels',
					contains: 'CosmosSdk',
				},
			},
		},
		{
			name: '$$cosmosValidators',
			label: 'Validators',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.CosmosValidator,
			cardinality: EntityFieldCardinality.Many,
			facet: {
				id: 'Cosmos',
				predicateFields: [
					'executionModels',
				],
				predicate: {
					field: 'executionModels',
					contains: 'CosmosSdk',
				},
			},
		},
		{
			name: '$$cosmosGovernanceProposals',
			label: 'Governance proposals',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.CosmosGovernanceProposal,
			cardinality: EntityFieldCardinality.Many,
			facet: {
				id: 'Cosmos',
				predicateFields: [
					'executionModels',
				],
				predicate: {
					field: 'executionModels',
					contains: 'CosmosSdk',
				},
			},
		},
		{
			name: 'polkadotRpcEndpoints',
			label: 'RPC endpoints',
			type: EntityFieldType.Primitive,
			primitiveType: type({ 'url': type('string'), 'transportType': type('string'), 'providerName': type('string') }),
			cardinality: EntityFieldCardinality.Many,
			facet: {
				id: 'Polkadot',
				predicateFields: [
					'executionModels',
				],
				predicate: {
					field: 'executionModels',
					contains: 'PolkadotRuntime',
				},
			},
		},
		{
			name: '$$polkadotBlocks',
			label: 'Blocks',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.PolkadotBlock,
			cardinality: EntityFieldCardinality.Many,
			facet: {
				id: 'Polkadot',
				predicateFields: [
					'executionModels',
				],
				predicate: {
					field: 'executionModels',
					contains: 'PolkadotRuntime',
				},
			},
		},
		{
			name: '$$polkadotAssets',
			label: 'Assets',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.PolkadotAsset,
			cardinality: EntityFieldCardinality.Many,
			facet: {
				id: 'Polkadot',
				predicateFields: [
					'executionModels',
				],
				predicate: {
					field: 'executionModels',
					contains: 'PolkadotRuntime',
				},
			},
		},
		{
			name: '$$polkadotAssetBalanceTimestamps',
			label: 'Asset balance observations',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.PolkadotAssetBalance_Timestamp,
			cardinality: EntityFieldCardinality.Many,
			facet: {
				id: 'Polkadot',
				predicateFields: [
					'executionModels',
				],
				predicate: {
					field: 'executionModels',
					contains: 'PolkadotRuntime',
				},
			},
		},
		{
			name: '$$polkadotReferendums',
			label: 'Referendums',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.PolkadotReferendum,
			cardinality: EntityFieldCardinality.Many,
			facet: {
				id: 'Polkadot',
				predicateFields: [
					'executionModels',
				],
				predicate: {
					field: 'executionModels',
					contains: 'PolkadotRuntime',
				},
			},
		},
		{
			name: '$$polkadotValidators',
			label: 'Validators',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.PolkadotValidator,
			cardinality: EntityFieldCardinality.Many,
			facet: {
				id: 'Polkadot',
				predicateFields: [
					'executionModels',
				],
				predicate: {
					field: 'executionModels',
					contains: 'PolkadotRuntime',
				},
			},
		},
		{
			name: 'solanaRpcEndpoints',
			label: 'RPC endpoints',
			type: EntityFieldType.Primitive,
			primitiveType: type({ 'url': type('string'), 'transportType': type('string'), 'providerName': type('string') }),
			cardinality: EntityFieldCardinality.Many,
			facet: {
				id: 'Solana',
				predicateFields: [
					'executionModels',
				],
				predicate: {
					field: 'executionModels',
					contains: 'SolanaRuntime',
				},
			},
		},
		{
			name: '$$solanaBlocks',
			label: 'Blocks',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.SolanaBlock,
			cardinality: EntityFieldCardinality.Many,
			facet: {
				id: 'Solana',
				predicateFields: [
					'executionModels',
				],
				predicate: {
					field: 'executionModels',
					contains: 'SolanaRuntime',
				},
			},
		},
		{
			name: '$$solanaTransactions',
			label: 'Transactions',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.SolanaTransaction,
			cardinality: EntityFieldCardinality.Many,
			facet: {
				id: 'Solana',
				predicateFields: [
					'executionModels',
				],
				predicate: {
					field: 'executionModels',
					contains: 'SolanaRuntime',
				},
			},
		},
		{
			name: '$$solanaAccounts',
			label: 'Accounts',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.SolanaAccount,
			cardinality: EntityFieldCardinality.Many,
			facet: {
				id: 'Solana',
				predicateFields: [
					'executionModels',
				],
				predicate: {
					field: 'executionModels',
					contains: 'SolanaRuntime',
				},
			},
		},
		{
			name: '$$solanaPrograms',
			label: 'Programs',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.SolanaProgram,
			cardinality: EntityFieldCardinality.Many,
			facet: {
				id: 'Solana',
				predicateFields: [
					'executionModels',
				],
				predicate: {
					field: 'executionModels',
					contains: 'SolanaRuntime',
				},
			},
		},
		{
			name: '$$solanaTokenAccounts',
			label: 'Token accounts',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.SolanaTokenAccount,
			cardinality: EntityFieldCardinality.Many,
			facet: {
				id: 'Solana',
				predicateFields: [
					'executionModels',
				],
				predicate: {
					field: 'executionModels',
					contains: 'SolanaRuntime',
				},
			},
		},
		{
			name: '$$solanaTokenMints',
			label: 'Token mints',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.SolanaTokenMint,
			cardinality: EntityFieldCardinality.Many,
			facet: {
				id: 'Solana',
				predicateFields: [
					'executionModels',
				],
				predicate: {
					field: 'executionModels',
					contains: 'SolanaRuntime',
				},
			},
		},
		{
			name: '$$solanaValidators',
			label: 'Validators',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.SolanaValidator,
			cardinality: EntityFieldCardinality.Many,
			facet: {
				id: 'Solana',
				predicateFields: [
					'executionModels',
				],
				predicate: {
					field: 'executionModels',
					contains: 'SolanaRuntime',
				},
			},
		},
		{
			name: '$$utxoBlocks',
			label: 'Blocks',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.UtxoBlock,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.MempoolSpace_Rest,
				Source.Blockchair_Rest,
			],
			facet: {
				id: 'Utxo',
				predicateFields: [
					'ledgerModels',
				],
				predicate: {
					field: 'ledgerModels',
					contains: 'Utxo',
				},
			},
		},
		{
			name: '$$utxoTransactions',
			label: 'Transactions',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.UtxoTransaction,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.MempoolSpace_Rest,
				Source.Blockchair_Rest,
				Source.Zcashd_JsonRpc,
			],
			facet: {
				id: 'Utxo',
				predicateFields: [
					'ledgerModels',
				],
				predicate: {
					field: 'ledgerModels',
					contains: 'Utxo',
				},
			},
		},
		{
			name: '$$zcashShieldedPools',
			label: 'Shielded pools',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.ZcashShieldedPool,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.Zcashd_JsonRpc,
			],
			facet: {
				id: 'Zcash',
				predicateFields: [
					'executionModels',
				],
				predicate: {
					field: 'executionModels',
					contains: 'ZcashShielded',
				},
			},
		},
		{
			name: '$$bittensorTimestamps',
			label: 'Observations',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.BittensorNetwork_Timestamp,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.Bittensor_JsonRpc,
			],
			facet: {
				id: 'Bittensor',
				predicateFields: [
					'namespace',
				],
				predicate: {
					field: 'namespace',
					equals: 'Bittensor',
				},
			},
		},
		{
			name: '$$bittensorBlocks',
			label: 'Blocks',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.BittensorBlock,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.Bittensor_JsonRpc,
			],
			facet: {
				id: 'Bittensor',
				predicateFields: [
					'namespace',
				],
				predicate: {
					field: 'namespace',
					equals: 'Bittensor',
				},
			},
		},
		{
			name: '$$bittensorSubnets',
			label: 'Subnets',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.BittensorSubnet,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.Bittensor_JsonRpc,
			],
			facet: {
				id: 'Bittensor',
				predicateFields: [
					'namespace',
				],
				predicate: {
					field: 'namespace',
					equals: 'Bittensor',
				},
			},
		},
		{
			name: 'zeroGChainId',
			label: 'Chain ID',
			description: 'The chain identifier used by the network family.',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			facet: {
				id: 'ZeroG',
				predicateFields: [
					'namespace',
				],
				predicate: {
					field: 'namespace',
					equals: 'ZeroG',
				},
			},
		},
		{
			name: '$$zeroGTimestamps',
			label: 'Observations',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.ZeroGNetwork_Timestamp,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.ZeroGStorageScan_Rest,
			],
			facet: {
				id: 'ZeroG',
				predicateFields: [
					'namespace',
				],
				predicate: {
					field: 'namespace',
					equals: 'ZeroG',
				},
			},
		},
		{
			name: '$$zeroGStorageNodes',
			label: 'Storage nodes',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.ZeroGStorageNode,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.ZeroGStorageScan_Rest,
			],
			facet: {
				id: 'ZeroG',
				predicateFields: [
					'namespace',
				],
				predicate: {
					field: 'namespace',
					equals: 'ZeroG',
				},
			},
		},
		{
			name: '$$zeroGDataBlobs',
			label: 'Data blobs',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.ZeroGDataBlob,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.ZeroGStorageScan_Rest,
			],
			facet: {
				id: 'ZeroG',
				predicateFields: [
					'namespace',
				],
				predicate: {
					field: 'namespace',
					equals: 'ZeroG',
				},
			},
		},
		{
			name: '$$zeroGStorageLogEntries',
			label: 'Storage log entries',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.ZeroGStorageLogEntry,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.ZeroGStorageScan_Rest,
			],
			facet: {
				id: 'ZeroG',
				predicateFields: [
					'namespace',
				],
				predicate: {
					field: 'namespace',
					equals: 'ZeroG',
				},
			},
		},
		{
			name: '$$quilibriumFrames',
			label: 'Frames',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.QuilibriumFrame,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.QuilibriumNode_Grpc,
			],
			facet: {
				id: 'Quilibrium',
				predicateFields: [
					'namespace',
				],
				predicate: {
					field: 'namespace',
					equals: 'Quilibrium',
				},
			},
		},
		{
			name: '$$quilibriumProvers',
			label: 'Provers',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.QuilibriumProver,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.QuilibriumNode_Grpc,
			],
			facet: {
				id: 'Quilibrium',
				predicateFields: [
					'namespace',
				],
				predicate: {
					field: 'namespace',
					equals: 'Quilibrium',
				},
			},
		},
		{
			name: '$$quilibriumShards',
			label: 'Shards',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.QuilibriumShard,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.QuilibriumNode_Grpc,
			],
			facet: {
				id: 'Quilibrium',
				predicateFields: [
					'namespace',
				],
				predicate: {
					field: 'namespace',
					equals: 'Quilibrium',
				},
			},
		},
		{
			name: '$$quilibriumAccounts',
			label: 'Accounts',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.QuilibriumAccount,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.QuilibriumNode_Grpc,
			],
			facet: {
				id: 'Quilibrium',
				predicateFields: [
					'namespace',
				],
				predicate: {
					field: 'namespace',
					equals: 'Quilibrium',
				},
			},
		},
		{
			name: 'filecoinRpcEndpoints',
			label: 'RPC endpoints',
			type: EntityFieldType.Primitive,
			primitiveType: type({ 'url': type('string'), 'transportType': type('string'), 'providerName': type('string') }),
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.Lotus_JsonRpc,
			],
			facet: {
				id: 'Filecoin',
				predicateFields: [
					'namespace',
				],
				predicate: {
					field: 'namespace',
					equals: 'Filecoin',
				},
			},
		},
		{
			name: '$$filecoinTimestamps',
			label: 'Observations',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.FilecoinNetwork_Timestamp,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.Lotus_JsonRpc,
			],
			facet: {
				id: 'Filecoin',
				predicateFields: [
					'namespace',
				],
				predicate: {
					field: 'namespace',
					equals: 'Filecoin',
				},
			},
		},
		{
			name: '$$filecoinTipsets',
			label: 'Tipsets',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.FilecoinTipset,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.Lotus_JsonRpc,
			],
			facet: {
				id: 'Filecoin',
				predicateFields: [
					'namespace',
				],
				predicate: {
					field: 'namespace',
					equals: 'Filecoin',
				},
			},
		},
		{
			name: 'nearRpcEndpoints',
			label: 'RPC endpoints',
			type: EntityFieldType.Primitive,
			primitiveType: type({ 'url': type('string'), 'transportType': type('string'), 'providerName': type('string') }),
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.Constants_Internal,
			],
			facet: {
				id: 'Near',
				predicateFields: [
					'namespace',
				],
				predicate: {
					field: 'namespace',
					equals: 'Near',
				},
			},
		},
		{
			name: '$$nearTimestamps',
			label: 'Observations',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.NearNetwork_Timestamp,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.NearRpc_JsonRpc,
			],
			facet: {
				id: 'Near',
				predicateFields: [
					'namespace',
				],
				predicate: {
					field: 'namespace',
					equals: 'Near',
				},
			},
		},
		{
			name: '$$nearBlocks',
			label: 'Blocks',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.NearBlock,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.NearRpc_JsonRpc,
			],
			facet: {
				id: 'Near',
				predicateFields: [
					'namespace',
				],
				predicate: {
					field: 'namespace',
					equals: 'Near',
				},
			},
		},
		{
			name: '$$nearValidators',
			label: 'Validators',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.NearValidator,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.NearRpc_JsonRpc,
			],
			facet: {
				id: 'Near',
				predicateFields: [
					'namespace',
				],
				predicate: {
					field: 'namespace',
					equals: 'Near',
				},
			},
		},
		{
			name: 'moneroRpcEndpoints',
			label: 'RPC endpoints',
			type: EntityFieldType.Primitive,
			primitiveType: type({ 'url': type('string'), 'transportType': type('string'), 'providerName': type('string') }),
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.MoneroDaemonRpc_JsonRpc,
			],
			facet: {
				id: 'Monero',
				predicateFields: [
					'namespace',
				],
				predicate: {
					field: 'namespace',
					equals: 'Monero',
				},
			},
		},
		{
			name: '$$moneroTimestamps',
			label: 'Observations',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.MoneroNetwork_Timestamp,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.MoneroDaemonRpc_JsonRpc,
			],
			facet: {
				id: 'Monero',
				predicateFields: [
					'namespace',
				],
				predicate: {
					field: 'namespace',
					equals: 'Monero',
				},
			},
		},
		{
			name: '$$moneroBlocks',
			label: 'Blocks',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.MoneroBlock,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.MoneroDaemonRpc_JsonRpc,
			],
			facet: {
				id: 'Monero',
				predicateFields: [
					'namespace',
				],
				predicate: {
					field: 'namespace',
					equals: 'Monero',
				},
			},
		},
		{
			name: 'lightningName',
			label: 'Name',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			facet: {
				id: 'Lightning',
				predicateFields: [
					'namespace',
				],
				predicate: {
					field: 'namespace',
					equals: 'Lightning',
				},
			},
		},
		{
			name: '$lightningSettlementNetwork',
			label: 'Settlement network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Network,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			facet: {
				id: 'Lightning',
				predicateFields: [
					'namespace',
				],
				predicate: {
					field: 'namespace',
					equals: 'Lightning',
				},
			},
		},
		{
			name: '$$lightningTimestamps',
			label: 'Observations',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.LightningNetwork_Timestamp,
			cardinality: EntityFieldCardinality.ZeroOrMany,
			facet: {
				id: 'Lightning',
				predicateFields: [
					'namespace',
				],
				predicate: {
					field: 'namespace',
					equals: 'Lightning',
				},
			},
		},
		{
			name: '$$lightningNodes',
			label: 'Nodes',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.LightningNode,
			cardinality: EntityFieldCardinality.ZeroOrMany,
			facet: {
				id: 'Lightning',
				predicateFields: [
					'namespace',
				],
				predicate: {
					field: 'namespace',
					equals: 'Lightning',
				},
			},
		},
		{
			name: '$$lightningChannels',
			label: 'Channels',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.LightningChannel,
			cardinality: EntityFieldCardinality.ZeroOrMany,
			facet: {
				id: 'Lightning',
				predicateFields: [
					'namespace',
				],
				predicate: {
					field: 'namespace',
					equals: 'Lightning',
				},
			},
		},
		{
			name: '$$lightningInvoices',
			label: 'Invoices',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.BlockheadLightningInvoice,
			cardinality: EntityFieldCardinality.Many,
			facet: {
				id: 'Lightning',
				predicateFields: [
					'namespace',
				],
				predicate: {
					field: 'namespace',
					equals: 'Lightning',
				},
			},
		},
		{
			name: '$$lightningPayments',
			label: 'Payments',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.BlockheadLightningPayment,
			cardinality: EntityFieldCardinality.Many,
			facet: {
				id: 'Lightning',
				predicateFields: [
					'namespace',
				],
				predicate: {
					field: 'namespace',
					equals: 'Lightning',
				},
			},
		},
		{
			name: '$$lightningLocalNodeStates',
			label: 'Local node states',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.BlockheadLightningNodeState,
			cardinality: EntityFieldCardinality.Many,
			facet: {
				id: 'Lightning',
				predicateFields: [
					'namespace',
				],
				predicate: {
					field: 'namespace',
					equals: 'Lightning',
				},
			},
		},
		{
			name: 'tronRestEndpoints',
			label: 'REST endpoints',
			type: EntityFieldType.Primitive,
			primitiveType: type({ 'url': type('string'), 'transportType': type('string'), 'providerName': type('string') }),
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.TronGrid_Rest,
				Source.TronFullNode_Rest,
				Source.TronSolidityNode_Rest,
			],
			facet: {
				id: 'Tron',
				predicateFields: [
					'namespace',
				],
				predicate: {
					field: 'namespace',
					equals: 'Tron',
				},
			},
		},
		{
			name: '$$tronTimestamps',
			label: 'Observations',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.TronNetwork_Timestamp,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.TronGrid_Rest,
			],
			facet: {
				id: 'Tron',
				predicateFields: [
					'namespace',
				],
				predicate: {
					field: 'namespace',
					equals: 'Tron',
				},
			},
		},
		{
			name: '$$tronBlocks',
			label: 'Blocks',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.TronBlock,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.TronGrid_Rest,
				Source.TronFullNode_Rest,
				Source.TronSolidityNode_Rest,
			],
			facet: {
				id: 'Tron',
				predicateFields: [
					'namespace',
				],
				predicate: {
					field: 'namespace',
					equals: 'Tron',
				},
			},
		},
		{
			name: '$$tronTokens',
			label: 'Tokens',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.TronToken,
			cardinality: EntityFieldCardinality.Many,
			facet: {
				id: 'Tron',
				predicateFields: [
					'namespace',
				],
				predicate: {
					field: 'namespace',
					equals: 'Tron',
				},
			},
		},
		{
			name: '$$tronTokenTransfers',
			label: 'Token transfers',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.TronTokenTransfer,
			cardinality: EntityFieldCardinality.Many,
			facet: {
				id: 'Tron',
				predicateFields: [
					'namespace',
				],
				predicate: {
					field: 'namespace',
					equals: 'Tron',
				},
			},
		},
		{
			name: '$$tronWitnesses',
			label: 'Witnesses',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.TronWitness,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.TronGrid_Rest,
			],
			facet: {
				id: 'Tron',
				predicateFields: [
					'namespace',
				],
				predicate: {
					field: 'namespace',
					equals: 'Tron',
				},
			},
		},
		{
			name: 'hyperliquidRpcEndpoints',
			label: 'RPC endpoints',
			type: EntityFieldType.Primitive,
			primitiveType: type({ 'url': type('string'), 'transportType': type('string'), 'providerName': type('string') }),
			cardinality: EntityFieldCardinality.Many,
			facet: {
				id: 'Hyperliquid',
				predicateFields: [
					'namespace',
				],
				predicate: {
					field: 'namespace',
					equals: 'Hyperliquid',
				},
			},
		},
		{
			name: 'hyperliquidRestEndpoints',
			label: 'REST endpoints',
			type: EntityFieldType.Primitive,
			primitiveType: type({ 'url': type('string'), 'transportType': type('string'), 'providerName': type('string') }),
			cardinality: EntityFieldCardinality.Many,
			facet: {
				id: 'Hyperliquid',
				predicateFields: [
					'namespace',
				],
				predicate: {
					field: 'namespace',
					equals: 'Hyperliquid',
				},
			},
		},
		{
			name: '$$hyperliquidTimestamps',
			label: 'Observations',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.HyperliquidNetwork_Timestamp,
			cardinality: EntityFieldCardinality.Many,
			facet: {
				id: 'Hyperliquid',
				predicateFields: [
					'namespace',
				],
				predicate: {
					field: 'namespace',
					equals: 'Hyperliquid',
				},
			},
		},
		{
			name: '$$hyperliquidBlocks',
			label: 'Blocks',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.HyperliquidBlock,
			cardinality: EntityFieldCardinality.Many,
			facet: {
				id: 'Hyperliquid',
				predicateFields: [
					'namespace',
				],
				predicate: {
					field: 'namespace',
					equals: 'Hyperliquid',
				},
			},
		},
		{
			name: '$$hyperliquidTransactions',
			label: 'Transactions',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.HyperliquidTransaction,
			cardinality: EntityFieldCardinality.Many,
			facet: {
				id: 'Hyperliquid',
				predicateFields: [
					'namespace',
				],
				predicate: {
					field: 'namespace',
					equals: 'Hyperliquid',
				},
			},
		},
		{
			name: '$$hyperliquidValidators',
			label: 'Validators',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.HyperliquidValidator,
			cardinality: EntityFieldCardinality.Many,
			facet: {
				id: 'Hyperliquid',
				predicateFields: [
					'namespace',
				],
				predicate: {
					field: 'namespace',
					equals: 'Hyperliquid',
				},
			},
		},
		{
			name: '$$hyperliquidSpotAssets',
			label: 'Spot assets',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.HyperliquidSpotAsset,
			cardinality: EntityFieldCardinality.Many,
			facet: {
				id: 'Hyperliquid',
				predicateFields: [
					'namespace',
				],
				predicate: {
					field: 'namespace',
					equals: 'Hyperliquid',
				},
			},
		},
		{
			name: '$$hyperliquidSpotPairs',
			label: 'Spot pairs',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.HyperliquidSpotPair,
			cardinality: EntityFieldCardinality.Many,
			facet: {
				id: 'Hyperliquid',
				predicateFields: [
					'namespace',
				],
				predicate: {
					field: 'namespace',
					equals: 'Hyperliquid',
				},
			},
		},
		{
			name: '$$hyperliquidPerpMarkets',
			label: 'Perp markets',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.HyperliquidPerpMarket,
			cardinality: EntityFieldCardinality.Many,
			facet: {
				id: 'Hyperliquid',
				predicateFields: [
					'namespace',
				],
				predicate: {
					field: 'namespace',
					equals: 'Hyperliquid',
				},
			},
		},
		{
			name: '$$hyperliquidVaults',
			label: 'Vaults',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.HyperliquidVault,
			cardinality: EntityFieldCardinality.Many,
			facet: {
				id: 'Hyperliquid',
				predicateFields: [
					'namespace',
				],
				predicate: {
					field: 'namespace',
					equals: 'Hyperliquid',
				},
			},
		},
	],
} as const satisfies EntityDefinition
