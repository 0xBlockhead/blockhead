// Generated from APP.ts.

import { NetworkExecutionModel, NetworkLedgerModel, NetworkNamespace } from '$/constants/Network.ts'
import { entity, facet } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ConsensusProtocol } from '$/schema/NetworkUpgradeProtocols.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
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
		primitiveType: type({
			namespace: type('string'),
			reference: type('string'),
		}),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	slug: {
		label: 'Slug',
		description: 'A stable short name used by catalogs and URLs.',
		primitiveType: type('string').matching('^[abcdefghijklmnopqrstuvwxyz0123456789\\-]+$').atLeastLength(1),
		cardinality: EntityFieldCardinality.One,
	},
	name: {
		label: 'Name',
		description: 'The human-readable name of the subject.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	namespace: {
		label: 'Namespace',
		description: 'The namespace that qualifies the identifier.',
		primitiveType: type.enumerated(...Object.values(NetworkNamespace)),
		cardinality: EntityFieldCardinality.One,
	},
	ledgerModels: {
		label: 'Ledger models',
		description: 'Irreducible ledger-state models supported by the network.',
		primitiveType: type.enumerated(...Object.values(NetworkLedgerModel)),
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Constants_Internal,
			Source.L2Beat_Rest,
		],
	},
	executionModels: {
		label: 'Execution models',
		description: 'Irreducible execution/runtime models supported by the network.',
		primitiveType: type.enumerated(...Object.values(NetworkExecutionModel)),
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Constants_Internal,
			Source.L2Beat_Rest,
		],
	},
	$networkStack: {
		label: 'Network stack',
		entityType: EntityType.NetworkStack,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Constants_Internal,
			Source.L2Beat_Rest,
		],
	},
	environment: {
		label: 'Environment',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	iconUrl: {
		label: 'Icon URL',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$icon: {
		label: 'Icon',
		entityType: EntityType.Media,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$nativeAssets: {
		label: 'Native assets',
		entityType: EntityType.AssetInstance,
		cardinality: EntityFieldCardinality.Many,
	},
	$$blockExplorerUrls: {
		label: 'Block explorer URLs',
		entityType: EntityType.Url,
		cardinality: EntityFieldCardinality.Many,
	},
	$$faucetUrls: {
		label: 'Faucet URLs',
		entityType: EntityType.Url,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
		label: 'Timestamps',
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
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			registryStatus: {
				label: 'Registry name status',
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			peeringId: {
				label: 'Peering ID',
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			slip44: {
				label: 'SLIP-44',
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			consensusProtocol: {
				label: 'Consensus protocol',
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Constants_Internal,
				],
			},
			$parent: {
				label: 'Parent network',
				entityType: EntityType.Network,
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			$mainnet: {
				label: 'Mainnet',
				entityType: EntityType.Network,
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			$rollup: {
				label: 'Rollup',
				entityType: EntityType.EvmRollup,
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			$$upgrades: {
				label: 'Upgrades',
				entityType: EntityType.EthereumNetworkUpgrade,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Constants_Internal,
				],
			},
			$$executionUpgrades: {
				label: 'Execution upgrades',
				entityType: EntityType.EthereumExecutionUpgrade,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Constants_Internal,
				],
			},
			$$consensusUpgrades: {
				label: 'Consensus upgrades',
				entityType: EntityType.EthereumConsensusUpgrade,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Constants_Internal,
				],
			},
			$$timestamps: {
				label: 'EVM observations',
				entityType: EntityType.EvmNetwork_Timestamp,
				cardinality: EntityFieldCardinality.ZeroOrMany,
				defaultSources: [
					Source.Voltaire_JsonRpc,
				],
			},
			$$blocks: {
				label: 'Blocks',
				entityType: EntityType.EvmBlock,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Voltaire_JsonRpc,
					Source.Blockscout_Rest,
				],
			},
			$$transactions: {
				label: 'Transactions',
				entityType: EntityType.EvmTransaction,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Blockscout_Rest,
				],
			},
			$$txpoolTimestamps: {
				label: 'Txpool timestamps',
				entityType: EntityType.EvmNetwork_Txpool_Timestamp,
				cardinality: EntityFieldCardinality.ZeroOrMany,
				defaultSources: [
					Source.Voltaire_JsonRpc,
				],
			},
			$$gasFeeBlocks: {
				label: 'Gas fee blocks',
				entityType: EntityType.EvmNetwork_GasFee_Block,
				cardinality: EntityFieldCardinality.ZeroOrMany,
				defaultSources: [
					Source.Voltaire_JsonRpc,
				],
			},
			$$gasEstimateTimestamps: {
				label: 'Gas estimate timestamps',
				entityType: EntityType.EvmNetwork_GasEstimate_Timestamp,
				cardinality: EntityFieldCardinality.ZeroOrMany,
				defaultSources: [
					Source.Blockscout_Rest,
					Source.Etherscan_Rest,
				],
			},
			$$activityDays: {
				label: 'Activity days',
				entityType: EntityType.Network_Activity_Day,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.SpaceAndTime_MakeInfinite,
				],
			},
			$$rpcUrls: {
				label: 'RPC URLs',
				entityType: EntityType.Url,
				cardinality: EntityFieldCardinality.Many,
			},
			consensusEndpoints: {
				label: 'Consensus endpoints',
				primitiveType: type({
					restBaseUrl: type('string'),
					consensusProtocol: type.enumerated(...Object.values(ConsensusProtocol)),
				}),
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Beacon_Rest,
				],
			},
			$$beaconFinalityTimestamps: {
				label: 'Beacon finality timestamps',
				entityType: EntityType.EthereumBeaconFinality_Timestamp,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Beacon_Rest,
				],
			},
			$$beaconEpochs: {
				label: 'Beacon epochs',
				entityType: EntityType.BeaconEpoch,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Beacon_Rest,
				],
			},
			$$beaconSlots: {
				label: 'Beacon slots',
				entityType: EntityType.BeaconSlot,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Beacon_Rest,
				],
			},
			$$beaconCommittees: {
				label: 'Beacon committees',
				entityType: EntityType.BeaconCommittee,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Beacon_Rest,
				],
			},
			$$beaconSyncCommittees: {
				label: 'Beacon sync committees',
				entityType: EntityType.BeaconSyncCommittee,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Beacon_Rest,
				],
			},
			$$beaconAttestations: {
				label: 'Beacon attestations',
				entityType: EntityType.BeaconAttestation,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Beacon_Rest,
				],
			},
			$$beaconWithdrawals: {
				label: 'Beacon withdrawals',
				entityType: EntityType.BeaconWithdrawal,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Beacon_Rest,
				],
			},
			$$beaconSlashings: {
				label: 'Beacon slashings',
				entityType: EntityType.BeaconSlashing,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Beacon_Rest,
				],
			},
			$$beaconValidators: {
				label: 'Beacon validators',
				entityType: EntityType.BeaconValidator,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Beacon_Rest,
				],
			},
			$$mevRelays: {
				label: 'MEV relays',
				entityType: EntityType.MevRelay,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Constants_Internal,
				],
			},
			$$mevBuilders: {
				label: 'MEV builders',
				entityType: EntityType.MevBuilder,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.MevRelay_Rest,
				],
			},
			$$mevProposerPayloadDelivered: {
				label: 'MEV proposer payloads delivered',
				entityType: EntityType.MevRelay_ProposerPayloadDelivered,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.MevRelay_Rest,
				],
			},
			$$blobs: {
				label: 'Blobs',
				entityType: EntityType.EvmBlob,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Voltaire_JsonRpc,
				],
			},
			$$contracts: {
				label: 'Contracts',
				entityType: EntityType.EvmContract,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Blockscout_Rest,
				],
			},
			$$precompiles: {
				label: 'Precompiles',
				entityType: EntityType.EvmContract,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Constants_Internal,
				],
			},
			$nativeCoin: {
				label: 'Native coin',
				entityType: EntityType.Coin,
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Constants_Internal,
				],
			},
			$nativeCoinInstance: {
				label: 'Native coin instance',
				entityType: EntityType.EvmCoinInstance,
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Constants_Internal,
				],
			},
			$$erc4337SmartAccounts: {
				label: 'ERC-4337 smart accounts',
				entityType: EntityType.Erc4337SmartAccount,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Blockscout_Rest,
				],
			},
			$$erc4337Bundlers: {
				label: 'ERC-4337 bundlers',
				entityType: EntityType.Erc4337Bundler,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Blockscout_Rest,
				],
			},
			$$erc4337Paymasters: {
				label: 'ERC-4337 paymasters',
				entityType: EntityType.Erc4337Paymaster,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Blockscout_Rest,
				],
			},
			$$erc4337AccountFactories: {
				label: 'ERC-4337 account factories',
				entityType: EntityType.Erc4337AccountFactory,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Blockscout_Rest,
				],
			},
			$$userOperations: {
				label: 'User operations',
				entityType: EntityType.EvmUserOperation,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Blockscout_Rest,
				],
			},
			$$bridges: {
				label: 'Bridges',
				entityType: EntityType.EvmNetworkBridge,
				cardinality: EntityFieldCardinality.Many,
			},
			$$erc20TokenTransfers: {
				label: 'ERC-20 token transfers',
				entityType: EntityType.EvmTokenTransfer,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Blockscout_Rest,
				],
			},
			$$nftTokenTransfers: {
				label: 'NFT token transfers',
				entityType: EntityType.EvmTokenTransfer,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Blockscout_Rest,
				],
			},
			$$testnets: {
				label: 'Testnets',
				entityType: EntityType.Network,
				cardinality: EntityFieldCardinality.Many,
			},
			$$childLayers: {
				label: 'Child layers',
				entityType: EntityType.Network,
				cardinality: EntityFieldCardinality.Many,
			},
			$$siblingShardNetworks: {
				label: 'Sibling shard networks',
				entityType: EntityType.Network,
				cardinality: EntityFieldCardinality.Many,
			},
			$$settledRollups: {
				label: 'Settled rollups',
				entityType: EntityType.EvmRollup,
				cardinality: EntityFieldCardinality.Many,
			},
		})({
			facets: {
				EthereumBeacon: facet({
					path: [
						'Evm',
						'consensusProtocol',
					],
					is: 'EthereumBeacon',
				})({}),
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
				primitiveType: type({
					url: type('string'),
					transportType: type('string'),
					providerName: type('string'),
				}),
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.CosmosSdk_Rest,
				],
			},
			$$blocks: {
				label: 'Blocks',
				entityType: EntityType.CosmosBlock,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.CosmosSdk_Rest,
				],
			},
			$$accounts: {
				label: 'Accounts',
				entityType: EntityType.CosmosAccount,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.CosmosSdk_Rest,
				],
			},
			$$validators: {
				label: 'Validators',
				entityType: EntityType.CosmosValidator,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.CosmosSdk_Rest,
				],
			},
			$$governanceProposals: {
				label: 'Governance proposals',
				entityType: EntityType.CosmosGovernanceProposal,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.CosmosSdk_Rest,
				],
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
				primitiveType: type({
					url: type('string'),
					transportType: type('string'),
					providerName: type('string'),
				}),
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Polkadot_JsonRpc,
				],
			},
			$$blocks: {
				label: 'Blocks',
				entityType: EntityType.PolkadotBlock,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Polkadot_JsonRpc,
				],
			},
			$$validators: {
				label: 'Validators',
				entityType: EntityType.PolkadotValidator,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.SubstrateSidecar_Rest,
				],
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
				primitiveType: type({
					url: type('string'),
					transportType: type('string'),
					providerName: type('string'),
				}),
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Solana_JsonRpc,
				],
			},
			$$blocks: {
				label: 'Blocks',
				entityType: EntityType.SolanaBlock,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Solana_JsonRpc,
				],
			},
			$$transactions: {
				label: 'Transactions',
				entityType: EntityType.SolanaTransaction,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Solana_JsonRpc,
				],
			},
			$$accounts: {
				label: 'Accounts',
				entityType: EntityType.SolanaAccount,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Solana_JsonRpc,
				],
			},
			$$programs: {
				label: 'Programs',
				entityType: EntityType.SolanaProgram,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Solana_JsonRpc,
				],
			},
			$$tokenAccounts: {
				label: 'Token accounts',
				entityType: EntityType.SolanaTokenAccount,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Solana_JsonRpc,
				],
			},
			$$tokenMints: {
				label: 'Token mints',
				entityType: EntityType.SolanaTokenMint,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Solana_JsonRpc,
				],
			},
			$$validators: {
				label: 'Validators',
				entityType: EntityType.SolanaValidator,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Solana_JsonRpc,
				],
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
				entityType: EntityType.UtxoBlock,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.MempoolSpace_Rest,
					Source.Blockchair_Rest,
				],
			},
			$$transactions: {
				label: 'Transactions',
				entityType: EntityType.UtxoTransaction,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.MempoolSpace_Rest,
					Source.Blockchair_Rest,
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
				entityType: EntityType.ZcashShieldedPool,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Constants_Internal,
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
				entityType: EntityType.BittensorNetwork_Timestamp,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Bittensor_JsonRpc,
				],
			},
			$$blocks: {
				label: 'Blocks',
				entityType: EntityType.BittensorBlock,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Bittensor_JsonRpc,
				],
			},
			$$subnets: {
				label: 'Subnets',
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
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			$$timestamps: {
				label: 'Observations',
				entityType: EntityType.ZeroGNetwork_Timestamp,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.ZeroGStorageScan_Rest,
				],
			},
			$$storageNodes: {
				label: 'Storage nodes',
				entityType: EntityType.ZeroGStorageNode,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.ZeroGStorageScan_Rest,
				],
			},
			$$dataBlobs: {
				label: 'Data blobs',
				entityType: EntityType.ZeroGDataBlob,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.ZeroGStorageScan_Rest,
				],
			},
			$$storageLogEntries: {
				label: 'Storage log entries',
				entityType: EntityType.ZeroGStorageLogEntry,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.ZeroGStorageScan_Rest,
				],
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
				primitiveType: type({
					url: type('string'),
					transportType: type('string'),
					providerName: type('string'),
				}),
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Lotus_JsonRpc,
				],
			},
			$$timestamps: {
				label: 'Observations',
				entityType: EntityType.FilecoinNetwork_Timestamp,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Lotus_JsonRpc,
				],
			},
			$$tipsets: {
				label: 'Tipsets',
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
				primitiveType: type({
					url: type('string'),
					transportType: type('string'),
					providerName: type('string'),
				}),
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.NearRpc_JsonRpc,
				],
			},
			$$timestamps: {
				label: 'Observations',
				entityType: EntityType.NearNetwork_Timestamp,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.NearRpc_JsonRpc,
				],
			},
			$$blocks: {
				label: 'Blocks',
				entityType: EntityType.NearBlock,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.NearRpc_JsonRpc,
				],
			},
			$$validators: {
				label: 'Validators',
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
				primitiveType: type({
					url: type('string'),
					transportType: type('string'),
					providerName: type('string'),
				}),
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.MoneroDaemonRpc_JsonRpc,
				],
			},
			$$timestamps: {
				label: 'Observations',
				entityType: EntityType.MoneroNetwork_Timestamp,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.MoneroDaemonRpc_JsonRpc,
				],
			},
			$$blocks: {
				label: 'Blocks',
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
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			$settlementNetwork: {
				label: 'Settlement network',
				entityType: EntityType.Network,
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			$$timestamps: {
				label: 'Observations',
				entityType: EntityType.LightningNetwork_Timestamp,
				cardinality: EntityFieldCardinality.ZeroOrMany,
			},
			$$nodes: {
				label: 'Nodes',
				entityType: EntityType.LightningNode,
				cardinality: EntityFieldCardinality.ZeroOrMany,
			},
		}),
		Cardano: facet({
			path: [
				'namespace',
			],
			is: 'Cardano',
		})({
			restEndpoints: {
				label: 'REST endpoints',
				primitiveType: type({
					url: type('string'),
					transportType: type('string'),
					providerName: type('string'),
				}),
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.CardanoKoios_Rest,
				],
			},
			$$timestamps: {
				label: 'Observations',
				entityType: EntityType.CardanoNetwork_Timestamp,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.CardanoKoios_Rest,
				],
			},
			$$blocks: {
				label: 'Blocks',
				entityType: EntityType.CardanoBlock,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.CardanoKoios_Rest,
				],
			},
			$$transactions: {
				label: 'Transactions',
				entityType: EntityType.CardanoTransaction,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.CardanoKoios_Rest,
				],
			},
			$$stakePools: {
				label: 'Stake pools',
				entityType: EntityType.CardanoStakePool,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.CardanoKoios_Rest,
				],
			},
			$$dReps: {
				label: 'DReps',
				entityType: EntityType.CardanoDRep,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.CardanoKoios_Rest,
				],
			},
			$$governanceProposals: {
				label: 'Governance proposals',
				entityType: EntityType.CardanoGovernanceProposal,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.CardanoKoios_Rest,
				],
			},
			$$assets: {
				label: 'Native assets',
				entityType: EntityType.CardanoNativeAsset,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.CardanoKoios_Rest,
				],
			},
			$$protocolParameterEpochs: {
				label: 'Protocol parameter epochs',
				entityType: EntityType.CardanoProtocolParameters_Epoch,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.CardanoKoios_Rest,
				],
			},
			$$committeeEpochs: {
				label: 'Committee epochs',
				entityType: EntityType.CardanoCommittee_Epoch,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.CardanoKoios_Rest,
				],
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
				primitiveType: type({
					url: type('string'),
					transportType: type('string'),
					providerName: type('string'),
				}),
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.TronGrid_Rest,
				],
			},
			$$timestamps: {
				label: 'Observations',
				entityType: EntityType.TronNetwork_Timestamp,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.TronGrid_Rest,
				],
			},
			$$blocks: {
				label: 'Blocks',
				entityType: EntityType.TronBlock,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.TronGrid_Rest,
				],
			},
			$$witnesses: {
				label: 'Witnesses',
				entityType: EntityType.TronWitness,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.TronGrid_Rest,
				],
			},
		}),
		Ton: facet({
			path: [
				'namespace',
			],
			is: 'Ton',
		})({
			$$workchains: {
				label: 'Workchains',
				entityType: EntityType.TonWorkchain,
				cardinality: EntityFieldCardinality.Many,
			},
			$$blocks: {
				label: 'Blocks',
				entityType: EntityType.TonBlock,
				cardinality: EntityFieldCardinality.Many,
			},
			$$transactions: {
				label: 'Transactions',
				entityType: EntityType.TonTransaction,
				cardinality: EntityFieldCardinality.Many,
			},
			$$accounts: {
				label: 'Accounts',
				entityType: EntityType.TonAccount,
				cardinality: EntityFieldCardinality.Many,
			},
			$$contracts: {
				label: 'Contracts',
				entityType: EntityType.TonContract,
				cardinality: EntityFieldCardinality.Many,
			},
			$$messages: {
				label: 'Messages',
				entityType: EntityType.TonMessage,
				cardinality: EntityFieldCardinality.Many,
			},
			$$traces: {
				label: 'Traces',
				entityType: EntityType.TonTrace,
				cardinality: EntityFieldCardinality.Many,
			},
			$$jettons: {
				label: 'Jettons',
				entityType: EntityType.TonJetton,
				cardinality: EntityFieldCardinality.Many,
			},
			$$nftCollections: {
				label: 'NFT collections',
				entityType: EntityType.TonNftCollection,
				cardinality: EntityFieldCardinality.Many,
			},
			$$nftItems: {
				label: 'NFT items',
				entityType: EntityType.TonNftItem,
				cardinality: EntityFieldCardinality.Many,
			},
			$$timestamps: {
				label: 'Observations',
				entityType: EntityType.TonNetwork_Timestamp,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.TonApi_Rest,
				],
			},
		}),
		Xrpl: facet({
			path: [
				'namespace',
			],
			is: 'Xrpl',
		})({
			$$accounts: {
				label: 'Accounts',
				entityType: EntityType.XrplAccount,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Xrpl_Rippled,
				],
			},
			$$amendments: {
				label: 'Amendments',
				entityType: EntityType.XrplAmendment,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Xrpl_Rippled,
				],
			},
			$$amms: {
				label: 'AMMs',
				entityType: EntityType.XrplAmm,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Xrpl_Rippled,
				],
			},
			$$ledgerEntries: {
				label: 'Ledger entries',
				entityType: EntityType.XrplLedgerEntry,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Xrpl_Rippled,
				],
			},
			$$ledgers: {
				label: 'Ledgers',
				entityType: EntityType.XrplLedger,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Xrpl_Rippled,
				],
			},
			$$transactions: {
				label: 'Transactions',
				entityType: EntityType.XrplTransaction,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Xrpl_Rippled,
				],
			},
		}),
		Hedera: facet({
			path: [
				'namespace',
			],
			is: 'Hedera',
		})({
			shard: {
				label: 'Shard',
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			realm: {
				label: 'Realm',
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			$$blocks: {
				label: 'Blocks',
				entityType: EntityType.HederaBlock,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.HederaMirrorNode_Rest,
				],
			},
			$$accounts: {
				label: 'Accounts',
				entityType: EntityType.HederaAccount,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.HederaMirrorNode_Rest,
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
				primitiveType: type({
					url: type('string'),
					transportType: type('string'),
					providerName: type('string'),
				}),
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Hyperliquid,
				],
			},
			restEndpoints: {
				label: 'REST endpoints',
				primitiveType: type({
					url: type('string'),
					transportType: type('string'),
					providerName: type('string'),
				}),
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Hyperliquid,
				],
			},
			$$timestamps: {
				label: 'Observations',
				entityType: EntityType.HyperliquidNetwork_Timestamp,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Hyperliquid,
				],
			},
			$$blocks: {
				label: 'Blocks',
				entityType: EntityType.HyperliquidBlock,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Hyperliquid,
				],
			},
			$$transactions: {
				label: 'Transactions',
				entityType: EntityType.HyperliquidTransaction,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Hyperliquid,
				],
			},
			$$validators: {
				label: 'Validators',
				entityType: EntityType.HyperliquidValidator,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Hyperliquid,
				],
			},
			$$spotAssets: {
				label: 'Spot assets',
				entityType: EntityType.HyperliquidSpotAsset,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Hyperliquid,
				],
			},
			$$perpMarkets: {
				label: 'Perp markets',
				entityType: EntityType.HyperliquidPerpMarket,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Hyperliquid,
				],
			},
		}),
	},
})
