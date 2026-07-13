// Generated from APP.ts. Do not edit by hand.

import { Caip2Namespace, Caip2Reference, networkBySlug, NetworkExecutionModel, NetworkLedgerModel, NetworkNamespace } from '$/constants/Network.ts'
import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ConsensusProtocol } from '$/schema/NetworkUpgradeProtocols.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum NetworkSelector {
	Caip2 = 'Caip2',
	Slug = 'Slug',
}
export const Network = entity({
	entityType: EntityType.Network,
	labels: {
		singular: 'Network',
		plural: 'networks',
	},
	description: 'A blockchain, ledger, or protocol network with its own identity and supporting metadata.',
})({
	caip2: {
		label: 'CAIP-2',
		description: 'The chain identifier in CAIP-2 namespace and reference form.',
		type: EntityFieldType.Primitive,
		primitiveType: type({ 'namespace': type.enumerated(...Object.values(Caip2Namespace)), 'reference': type.enumerated(...Object.values(Caip2Reference)) }),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	slug: {
		label: 'Slug',
		description: 'A stable short name used by catalogs and URLs.',
		type: EntityFieldType.Primitive,
		primitiveType: (type.enumerated(...Object.keys(networkBySlug))),
		cardinality: EntityFieldCardinality.One,
	},
	name: {
		label: 'Name',
		description: 'The human-readable name of the subject.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	namespace: {
		label: 'Namespace',
		description: 'The namespace that qualifies the identifier.',
		type: EntityFieldType.Primitive,
		primitiveType: type.enumerated(...Object.values(NetworkNamespace)),
		cardinality: EntityFieldCardinality.One,
	},
	ledgerModels: {
		label: 'Ledger models',
		description: 'Irreducible ledger-state models supported by the network.',
		type: EntityFieldType.Primitive,
		primitiveType: type.enumerated(...Object.values(NetworkLedgerModel)),
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Constants_Internal,
		],
	},
	executionModels: {
		label: 'Execution models',
		description: 'Irreducible execution/runtime models supported by the network.',
		type: EntityFieldType.Primitive,
		primitiveType: type.enumerated(...Object.values(NetworkExecutionModel)),
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Constants_Internal,
		],
	},
	$networkStack: {
		label: 'Network stack',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.NetworkStack,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Constants_Internal,
		],
	},
	environment: {
		label: 'Environment',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	iconUrl: {
		label: 'Icon URL',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$icon: {
		label: 'Icon',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Media,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$nativeAssets: {
		label: 'Native assets',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.AssetInstance,
		cardinality: EntityFieldCardinality.Many,
	},
	$$blockExplorerUrls: {
		label: 'Block explorer URLs',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.Url,
		cardinality: EntityFieldCardinality.Many,
	},
	$$faucetUrls: {
		label: 'Faucet URLs',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.Url,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
		label: 'Timestamps',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.Network_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		Caip2: [
			'caip2',
		],
		Slug: [
			'slug',
		],
	},

	facets: {
		Evm: facet({
			path: [
				'executionModels',
			],
			includes: 'Evm',
		})({
			shortName: {
				label: 'Short name',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			registryStatus: {
				label: 'Registry name status',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			peeringId: {
				label: 'Peering ID',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			slip44: {
				label: 'SLIP-44',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			consensusProtocol: {
				label: 'Consensus protocol',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Constants_Internal,
				],
			},
			$parent: {
				label: 'Parent network',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.Network,
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			$mainnet: {
				label: 'Mainnet',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.Network,
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			$rollup: {
				label: 'Rollup',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.EvmRollup,
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			$$upgrades: {
				label: 'Upgrades',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.EthereumNetworkUpgrade,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Constants_Internal,
				],
			},
			$$executionUpgrades: {
				label: 'Execution upgrades',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.EthereumExecutionUpgrade,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Constants_Internal,
				],
			},
			$$consensusUpgrades: {
				label: 'Consensus upgrades',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.EthereumConsensusUpgrade,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Constants_Internal,
				],
			},
			$$timestamps: {
				label: 'EVM observations',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.EvmNetwork_Timestamp,
				cardinality: EntityFieldCardinality.ZeroOrMany,
				defaultSources: [
					Source.Voltaire_JsonRpc,
				],
			},
			$$blocks: {
				label: 'Blocks',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.EvmBlock,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Voltaire_JsonRpc,
					Source.Blockscout_Rest,
				],
			},
			$$transactions: {
				label: 'Transactions',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.EvmTransaction,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Blockscout_Rest,
				],
			},
			$$txpoolTimestamps: {
				label: 'Txpool timestamps',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.EvmNetwork_Txpool_Timestamp,
				cardinality: EntityFieldCardinality.ZeroOrMany,
				defaultSources: [
					Source.Voltaire_JsonRpc,
				],
			},
			$$gasFeeBlocks: {
				label: 'Gas fee blocks',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.EvmNetwork_GasFee_Block,
				cardinality: EntityFieldCardinality.ZeroOrMany,
				defaultSources: [
					Source.Voltaire_JsonRpc,
				],
			},
			$$gasEstimateTimestamps: {
				label: 'Gas estimate timestamps',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.EvmNetwork_GasEstimate_Timestamp,
				cardinality: EntityFieldCardinality.ZeroOrMany,
				defaultSources: [
					Source.Blockscout_Rest,
					Source.Etherscan_Rest,
				],
			},
			$$rpcUrls: {
				label: 'RPC URLs',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.Url,
				cardinality: EntityFieldCardinality.Many,
			},
			consensusEndpoints: {
				label: 'Consensus endpoints',
				type: EntityFieldType.Primitive,
				primitiveType: type({ 'restBaseUrl': type('string'), 'consensusProtocol': type.enumerated(...Object.values(ConsensusProtocol)) }),
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Constants_Internal,
				],
			},
			$$beaconFinalityTimestamps: {
				label: 'Beacon finality timestamps',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.EthereumBeaconFinality_Timestamp,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Beacon_Rest,
				],
			},
			$$beaconEpochs: {
				label: 'Beacon epochs',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.BeaconEpoch,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Beacon_Rest,
				],
			},
			$$beaconSlots: {
				label: 'Beacon slots',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.BeaconSlot,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Beacon_Rest,
				],
			},
			$$beaconCommittees: {
				label: 'Beacon committees',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.BeaconCommittee,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Beacon_Rest,
				],
			},
			$$beaconSyncCommittees: {
				label: 'Beacon sync committees',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.BeaconSyncCommittee,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Beacon_Rest,
				],
			},
			$$beaconAttestations: {
				label: 'Beacon attestations',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.BeaconAttestation,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Beacon_Rest,
				],
			},
			$$beaconWithdrawals: {
				label: 'Beacon withdrawals',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.BeaconWithdrawal,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Beacon_Rest,
				],
			},
			$$beaconSlashings: {
				label: 'Beacon slashings',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.BeaconSlashing,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Beacon_Rest,
				],
			},
			$$beaconValidators: {
				label: 'Beacon validators',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.BeaconValidator,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Beacon_Rest,
				],
			},
			$$mevRelays: {
				label: 'MEV relays',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.MevRelay,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Constants_Internal,
				],
			},
			$$mevBuilders: {
				label: 'MEV builders',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.MevBuilder,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.MevRelay_Rest,
				],
			},
			$$mevProposerPayloadDelivered: {
				label: 'MEV proposer payloads delivered',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.MevRelay_ProposerPayloadDelivered,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.MevRelay_Rest,
				],
			},
			$$blobs: {
				label: 'Blobs',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.EvmBlob,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Voltaire_JsonRpc,
				],
			},
			$$contracts: {
				label: 'Contracts',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.EvmContract,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Blockscout_Rest,
				],
			},
			$$precompiles: {
				label: 'Precompiles',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.EvmContract,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Constants_Internal,
				],
			},
			$nativeCoin: {
				label: 'Native coin',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.Coin,
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Constants_Internal,
				],
			},
			$nativeCoinInstance: {
				label: 'Native coin instance',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.EvmCoinInstance,
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Constants_Internal,
				],
			},
			$$erc4337SmartAccounts: {
				label: 'ERC-4337 smart accounts',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.Erc4337SmartAccount,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Blockscout_Rest,
				],
			},
			$$erc4337Bundlers: {
				label: 'ERC-4337 bundlers',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.Erc4337Bundler,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Blockscout_Rest,
				],
			},
			$$erc4337Paymasters: {
				label: 'ERC-4337 paymasters',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.Erc4337Paymaster,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Blockscout_Rest,
				],
			},
			$$erc4337AccountFactories: {
				label: 'ERC-4337 account factories',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.Erc4337AccountFactory,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Blockscout_Rest,
				],
			},
			$$userOperations: {
				label: 'User operations',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.EvmUserOperation,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Blockscout_Rest,
				],
			},
			$$bridges: {
				label: 'Bridges',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.EvmNetworkBridge,
				cardinality: EntityFieldCardinality.Many,
			},
			$$erc20TokenTransfers: {
				label: 'ERC-20 token transfers',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.EvmTokenTransfer,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Blockscout_Rest,
				],
			},
			$$nftTokenTransfers: {
				label: 'NFT token transfers',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.EvmTokenTransfer,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Blockscout_Rest,
				],
			},
			$$testnets: {
				label: 'Testnets',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.Network,
				cardinality: EntityFieldCardinality.Many,
			},
			$$childLayers: {
				label: 'Child layers',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.Network,
				cardinality: EntityFieldCardinality.Many,
			},
			$$siblingShardNetworks: {
				label: 'Sibling shard networks',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.Network,
				cardinality: EntityFieldCardinality.Many,
			},
			$$settledRollups: {
				label: 'Settled rollups',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.EvmRollup,
				cardinality: EntityFieldCardinality.Many,
			},
		}),
		Cosmos: facet({
			path: [
				'executionModels',
			],
			includes: 'CosmosSdk',
		})({
			restEndpoints: {
				label: 'REST endpoints',
				type: EntityFieldType.Primitive,
				primitiveType: type({ 'url': type('string'), 'transportType': type('string'), 'providerName': type('string') }),
				cardinality: EntityFieldCardinality.Many,
			},
			$$blocks: {
				label: 'Blocks',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.CosmosBlock,
				cardinality: EntityFieldCardinality.Many,
			},
			$$accounts: {
				label: 'Accounts',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.CosmosAccount,
				cardinality: EntityFieldCardinality.Many,
			},
			$$validators: {
				label: 'Validators',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.CosmosValidator,
				cardinality: EntityFieldCardinality.Many,
			},
			$$governanceProposals: {
				label: 'Governance proposals',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.CosmosGovernanceProposal,
				cardinality: EntityFieldCardinality.Many,
			},
		}),
		Polkadot: facet({
			path: [
				'executionModels',
			],
			includes: 'PolkadotRuntime',
		})({
			rpcEndpoints: {
				label: 'RPC endpoints',
				type: EntityFieldType.Primitive,
				primitiveType: type({ 'url': type('string'), 'transportType': type('string'), 'providerName': type('string') }),
				cardinality: EntityFieldCardinality.Many,
			},
			$$blocks: {
				label: 'Blocks',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.PolkadotBlock,
				cardinality: EntityFieldCardinality.Many,
			},
			$$assets: {
				label: 'Assets',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.PolkadotAsset,
				cardinality: EntityFieldCardinality.Many,
			},
			$$assetBalanceTimestamps: {
				label: 'Asset balance observations',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.PolkadotAssetBalance_Timestamp,
				cardinality: EntityFieldCardinality.Many,
			},
			$$referendums: {
				label: 'Referendums',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.PolkadotReferendum,
				cardinality: EntityFieldCardinality.Many,
			},
			$$validators: {
				label: 'Validators',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.PolkadotValidator,
				cardinality: EntityFieldCardinality.Many,
			},
		}),
		Solana: facet({
			path: [
				'executionModels',
			],
			includes: 'SolanaRuntime',
		})({
			rpcEndpoints: {
				label: 'RPC endpoints',
				type: EntityFieldType.Primitive,
				primitiveType: type({ 'url': type('string'), 'transportType': type('string'), 'providerName': type('string') }),
				cardinality: EntityFieldCardinality.Many,
			},
			$$blocks: {
				label: 'Blocks',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.SolanaBlock,
				cardinality: EntityFieldCardinality.Many,
			},
			$$transactions: {
				label: 'Transactions',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.SolanaTransaction,
				cardinality: EntityFieldCardinality.Many,
			},
			$$accounts: {
				label: 'Accounts',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.SolanaAccount,
				cardinality: EntityFieldCardinality.Many,
			},
			$$programs: {
				label: 'Programs',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.SolanaProgram,
				cardinality: EntityFieldCardinality.Many,
			},
			$$tokenAccounts: {
				label: 'Token accounts',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.SolanaTokenAccount,
				cardinality: EntityFieldCardinality.Many,
			},
			$$tokenMints: {
				label: 'Token mints',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.SolanaTokenMint,
				cardinality: EntityFieldCardinality.Many,
			},
			$$validators: {
				label: 'Validators',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.SolanaValidator,
				cardinality: EntityFieldCardinality.Many,
			},
		}),
		Utxo: facet({
			path: [
				'ledgerModels',
			],
			includes: 'Utxo',
		})({
			$$blocks: {
				label: 'Blocks',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.UtxoBlock,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.MempoolSpace_Rest,
					Source.Blockchair_Rest,
				],
			},
			$$transactions: {
				label: 'Transactions',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.UtxoTransaction,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.MempoolSpace_Rest,
					Source.Blockchair_Rest,
					Source.Zcashd_JsonRpc,
				],
			},
		}),
		CashTokens: facet({
			path: [
				'namespace',
			],
			is: 'BitcoinCash',
		})({}),
		Zcash: facet({
			path: [
				'executionModels',
			],
			includes: 'ZcashShielded',
		})({
			$$shieldedPools: {
				label: 'Shielded pools',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.ZcashShieldedPool,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Zcashd_JsonRpc,
				],
			},
		}),
		Bittensor: facet({
			path: [
				'namespace',
			],
			is: 'Bittensor',
		})({
			$$timestamps: {
				label: 'Observations',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.BittensorNetwork_Timestamp,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Bittensor_JsonRpc,
				],
			},
			$$blocks: {
				label: 'Blocks',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.BittensorBlock,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Bittensor_JsonRpc,
				],
			},
			$$subnets: {
				label: 'Subnets',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.BittensorSubnet,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Bittensor_JsonRpc,
				],
			},
		}),
		ZeroG: facet({
			path: [
				'namespace',
			],
			is: 'ZeroG',
		})({
			chainId: {
				label: 'Chain ID',
				description: 'The chain identifier used by the network family.',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			$$timestamps: {
				label: 'Observations',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.ZeroGNetwork_Timestamp,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.ZeroGStorageScan_Rest,
				],
			},
			$$storageNodes: {
				label: 'Storage nodes',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.ZeroGStorageNode,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.ZeroGStorageScan_Rest,
				],
			},
			$$dataBlobs: {
				label: 'Data blobs',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.ZeroGDataBlob,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.ZeroGStorageScan_Rest,
				],
			},
			$$storageLogEntries: {
				label: 'Storage log entries',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.ZeroGStorageLogEntry,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.ZeroGStorageScan_Rest,
				],
			},
		}),
		Quilibrium: facet({
			path: [
				'namespace',
			],
			is: 'Quilibrium',
		})({
			$$frames: {
				label: 'Frames',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.QuilibriumFrame,
				cardinality: EntityFieldCardinality.Many,
			},
			$$provers: {
				label: 'Provers',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.QuilibriumProver,
				cardinality: EntityFieldCardinality.Many,
			},
			$$shards: {
				label: 'Shards',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.QuilibriumShard,
				cardinality: EntityFieldCardinality.Many,
			},
			$$accounts: {
				label: 'Accounts',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.QuilibriumAccount,
				cardinality: EntityFieldCardinality.Many,
			},
		}),
		Filecoin: facet({
			path: [
				'namespace',
			],
			is: 'Filecoin',
		})({
			rpcEndpoints: {
				label: 'RPC endpoints',
				type: EntityFieldType.Primitive,
				primitiveType: type({ 'url': type('string'), 'transportType': type('string'), 'providerName': type('string') }),
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Lotus_JsonRpc,
				],
			},
			$$timestamps: {
				label: 'Observations',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.FilecoinNetwork_Timestamp,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Lotus_JsonRpc,
				],
			},
			$$tipsets: {
				label: 'Tipsets',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.FilecoinTipset,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Lotus_JsonRpc,
				],
			},
		}),
		Near: facet({
			path: [
				'namespace',
			],
			is: 'Near',
		})({
			rpcEndpoints: {
				label: 'RPC endpoints',
				type: EntityFieldType.Primitive,
				primitiveType: type({ 'url': type('string'), 'transportType': type('string'), 'providerName': type('string') }),
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Constants_Internal,
				],
			},
			$$timestamps: {
				label: 'Observations',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.NearNetwork_Timestamp,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.NearRpc_JsonRpc,
				],
			},
			$$blocks: {
				label: 'Blocks',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.NearBlock,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.NearRpc_JsonRpc,
				],
			},
			$$validators: {
				label: 'Validators',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.NearValidator,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.NearRpc_JsonRpc,
				],
			},
		}),
		Monero: facet({
			path: [
				'namespace',
			],
			is: 'Monero',
		})({
			rpcEndpoints: {
				label: 'RPC endpoints',
				type: EntityFieldType.Primitive,
				primitiveType: type({ 'url': type('string'), 'transportType': type('string'), 'providerName': type('string') }),
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.MoneroDaemonRpc_JsonRpc,
				],
			},
			$$timestamps: {
				label: 'Observations',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.MoneroNetwork_Timestamp,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.MoneroDaemonRpc_JsonRpc,
				],
			},
			$$blocks: {
				label: 'Blocks',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.MoneroBlock,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.MoneroDaemonRpc_JsonRpc,
				],
			},
		}),
		Lightning: facet({
			path: [
				'namespace',
			],
			is: 'Lightning',
		})({
			name: {
				label: 'Name',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			$settlementNetwork: {
				label: 'Settlement network',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.Network,
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			$$timestamps: {
				label: 'Observations',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.LightningNetwork_Timestamp,
				cardinality: EntityFieldCardinality.ZeroOrMany,
			},
			$$nodes: {
				label: 'Nodes',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.LightningNode,
				cardinality: EntityFieldCardinality.ZeroOrMany,
			},
			$$channels: {
				label: 'Channels',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.LightningChannel,
				cardinality: EntityFieldCardinality.ZeroOrMany,
			},
			$$invoices: {
				label: 'Invoices',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.BlockheadLightningInvoice,
				cardinality: EntityFieldCardinality.Many,
			},
			$$payments: {
				label: 'Payments',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.BlockheadLightningPayment,
				cardinality: EntityFieldCardinality.Many,
			},
			$$localNodeStates: {
				label: 'Local node states',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.BlockheadLightningNodeState,
				cardinality: EntityFieldCardinality.Many,
			},
		}),
		Tron: facet({
			path: [
				'namespace',
			],
			is: 'Tron',
		})({
			restEndpoints: {
				label: 'REST endpoints',
				type: EntityFieldType.Primitive,
				primitiveType: type({ 'url': type('string'), 'transportType': type('string'), 'providerName': type('string') }),
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.TronGrid_Rest,
					Source.TronFullNode_Rest,
					Source.TronSolidityNode_Rest,
				],
			},
			$$timestamps: {
				label: 'Observations',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.TronNetwork_Timestamp,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.TronGrid_Rest,
				],
			},
			$$blocks: {
				label: 'Blocks',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.TronBlock,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.TronGrid_Rest,
					Source.TronFullNode_Rest,
					Source.TronSolidityNode_Rest,
				],
			},
			$$tokens: {
				label: 'Tokens',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.TronToken,
				cardinality: EntityFieldCardinality.Many,
			},
			$$tokenTransfers: {
				label: 'Token transfers',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.TronTokenTransfer,
				cardinality: EntityFieldCardinality.Many,
			},
			$$witnesses: {
				label: 'Witnesses',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.TronWitness,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.TronGrid_Rest,
				],
			},
		}),
		Hyperliquid: facet({
			path: [
				'namespace',
			],
			is: 'Hyperliquid',
		})({
			rpcEndpoints: {
				label: 'RPC endpoints',
				type: EntityFieldType.Primitive,
				primitiveType: type({ 'url': type('string'), 'transportType': type('string'), 'providerName': type('string') }),
				cardinality: EntityFieldCardinality.Many,
			},
			restEndpoints: {
				label: 'REST endpoints',
				type: EntityFieldType.Primitive,
				primitiveType: type({ 'url': type('string'), 'transportType': type('string'), 'providerName': type('string') }),
				cardinality: EntityFieldCardinality.Many,
			},
			$$timestamps: {
				label: 'Observations',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.HyperliquidNetwork_Timestamp,
				cardinality: EntityFieldCardinality.Many,
			},
			$$blocks: {
				label: 'Blocks',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.HyperliquidBlock,
				cardinality: EntityFieldCardinality.Many,
			},
			$$transactions: {
				label: 'Transactions',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.HyperliquidTransaction,
				cardinality: EntityFieldCardinality.Many,
			},
			$$validators: {
				label: 'Validators',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.HyperliquidValidator,
				cardinality: EntityFieldCardinality.Many,
			},
			$$spotAssets: {
				label: 'Spot assets',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.HyperliquidSpotAsset,
				cardinality: EntityFieldCardinality.Many,
			},
			$$spotPairs: {
				label: 'Spot pairs',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.HyperliquidSpotPair,
				cardinality: EntityFieldCardinality.Many,
			},
			$$perpMarkets: {
				label: 'Perp markets',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.HyperliquidPerpMarket,
				cardinality: EntityFieldCardinality.Many,
			},
			$$vaults: {
				label: 'Vaults',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.HyperliquidVault,
				cardinality: EntityFieldCardinality.Many,
			},
		}),
	},
})
