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
		primitiveType: type({
			namespace: type('string'),
			reference: type('string'),
		}),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	slug: {
		primitiveType: type('string').matching('^[abcdefghijklmnopqrstuvwxyz0123456789\\-]+$').atLeastLength(1),
		cardinality: EntityFieldCardinality.One,
	},
	name: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	namespace: {
		primitiveType: type.enumerated(...Object.values(NetworkNamespace)),
		cardinality: EntityFieldCardinality.One,
	},
	ledgerModels: {
		primitiveType: type.enumerated(...Object.values(NetworkLedgerModel)),
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Constants_Internal,
			Source.L2Beat_Rest,
		],
	},
	executionModels: {
		primitiveType: type.enumerated(...Object.values(NetworkExecutionModel)),
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Constants_Internal,
			Source.L2Beat_Rest,
		],
	},
	$networkStack: {
		entityType: EntityType.NetworkStack,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Constants_Internal,
			Source.L2Beat_Rest,
		],
	},
	environment: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	iconUrl: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$icon: {
		entityType: EntityType.Media,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$nativeAssets: {
		entityType: EntityType.AssetInstance,
		cardinality: EntityFieldCardinality.Many,
	},
	$$blockExplorerUrls: {
		entityType: EntityType.Url,
		cardinality: EntityFieldCardinality.Many,
	},
	$$faucetUrls: {
		entityType: EntityType.Url,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
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
		Aptos: facet({
			path: [
				'namespace',
			],
			is: 'Aptos',
		})({}),
		Dydx: facet({
			path: [
				'namespace',
			],
			is: 'Dydx',
		})({
			$dydxChainNetwork: {
				entityType: EntityType.DydxChainNetwork,
				cardinality: EntityFieldCardinality.One,
				defaultSources: [
					Source.DydxIndexer,
				],
			},
		}),
		Evm: facet({
			path: [
				'executionModels',
			],
			includes: 'Evm',
		})({
			shortName: {
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			registryStatus: {
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			peeringId: {
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			slip44: {
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			consensusProtocol: {
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Constants_Internal,
				],
			},
			$parent: {
				entityType: EntityType.Network,
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			$mainnet: {
				entityType: EntityType.Network,
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			$rollup: {
				entityType: EntityType.EvmRollup,
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			$$upgrades: {
				entityType: EntityType.EthereumNetworkUpgrade,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Constants_Internal,
				],
			},
			$$executionUpgrades: {
				entityType: EntityType.EthereumExecutionUpgrade,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Constants_Internal,
				],
			},
			$$consensusUpgrades: {
				entityType: EntityType.EthereumConsensusUpgrade,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Constants_Internal,
				],
			},
			$$timestamps: {
				entityType: EntityType.EvmNetwork_Timestamp,
				cardinality: EntityFieldCardinality.ZeroOrMany,
				defaultSources: [
					Source.Voltaire_JsonRpc,
				],
			},
			$$blocks: {
				entityType: EntityType.EvmBlock,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Voltaire_JsonRpc,
					Source.Blockscout_Rest,
				],
			},
			$$transactions: {
				entityType: EntityType.EvmTransaction,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Blockscout_Rest,
				],
			},
			$$txpoolTimestamps: {
				entityType: EntityType.EvmNetwork_Txpool_Timestamp,
				cardinality: EntityFieldCardinality.ZeroOrMany,
				defaultSources: [
					Source.Voltaire_JsonRpc,
				],
			},
			$$gasFeeBlocks: {
				entityType: EntityType.EvmNetwork_GasFee_Block,
				cardinality: EntityFieldCardinality.ZeroOrMany,
				defaultSources: [
					Source.Voltaire_JsonRpc,
				],
			},
			$$gasEstimateTimestamps: {
				entityType: EntityType.EvmNetwork_GasEstimate_Timestamp,
				cardinality: EntityFieldCardinality.ZeroOrMany,
				defaultSources: [
					Source.Blockscout_Rest,
					Source.Etherscan_Rest,
				],
			},
			$$activityDays: {
				entityType: EntityType.Network_Activity_Day,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.SpaceAndTime_MakeInfinite,
				],
			},
			$$rpcUrls: {
				entityType: EntityType.Url,
				cardinality: EntityFieldCardinality.Many,
			},
			consensusEndpoints: {
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
				entityType: EntityType.EthereumBeaconFinality_Timestamp,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Beacon_Rest,
				],
			},
			$$beaconEpochs: {
				entityType: EntityType.BeaconEpoch,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Beacon_Rest,
				],
			},
			$$beaconSlots: {
				entityType: EntityType.BeaconSlot,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Beacon_Rest,
				],
			},
			$$beaconCommittees: {
				entityType: EntityType.BeaconCommittee,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Beacon_Rest,
				],
			},
			$$beaconSyncCommittees: {
				entityType: EntityType.BeaconSyncCommittee,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Beacon_Rest,
				],
			},
			$$beaconAttestations: {
				entityType: EntityType.BeaconAttestation,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Beacon_Rest,
				],
			},
			$$beaconWithdrawals: {
				entityType: EntityType.BeaconWithdrawal,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Beacon_Rest,
				],
			},
			$$beaconSlashings: {
				entityType: EntityType.BeaconSlashing,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Beacon_Rest,
				],
			},
			$$beaconValidators: {
				entityType: EntityType.BeaconValidator,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Beacon_Rest,
				],
			},
			$$mevRelays: {
				entityType: EntityType.MevRelay,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Constants_Internal,
				],
			},
			$$mevBuilders: {
				entityType: EntityType.MevBuilder,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.MevRelay_Rest,
				],
			},
			$$mevProposerPayloadDelivered: {
				entityType: EntityType.MevRelay_ProposerPayloadDelivered,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.MevRelay_Rest,
				],
			},
			$$blobs: {
				entityType: EntityType.EvmBlob,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Voltaire_JsonRpc,
				],
			},
			$$contracts: {
				entityType: EntityType.EvmContract,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Blockscout_Rest,
				],
			},
			$$precompiles: {
				entityType: EntityType.EvmContract,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Constants_Internal,
				],
			},
			$nativeCoin: {
				entityType: EntityType.Coin,
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Constants_Internal,
				],
			},
			$nativeCoinInstance: {
				entityType: EntityType.EvmCoinInstance,
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Constants_Internal,
				],
			},
			$$erc4337SmartAccounts: {
				entityType: EntityType.Erc4337SmartAccount,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Blockscout_Rest,
				],
			},
			$$erc4337Bundlers: {
				entityType: EntityType.Erc4337Bundler,
				cardinality: EntityFieldCardinality.Many,
			},
			$$erc4337Paymasters: {
				entityType: EntityType.Erc4337Paymaster,
				cardinality: EntityFieldCardinality.Many,
			},
			$$erc4337AccountFactories: {
				entityType: EntityType.Erc4337AccountFactory,
				cardinality: EntityFieldCardinality.Many,
			},
			$$userOperations: {
				entityType: EntityType.EvmUserOperation,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Blockscout_Rest,
				],
			},
			$$aaveMarkets: {
				entityType: EntityType.AaveMarket,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Aave_Rest,
				],
			},
			$$balancerPools: {
				entityType: EntityType.BalancerPool,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Balancer_Rest,
				],
			},
			$$compoundComets: {
				entityType: EntityType.CompoundComet,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Compound_Rest,
				],
			},
			$$curvePools: {
				entityType: EntityType.CurvePool,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Curve_Rest,
				],
			},
			$$eulerEvkVaults: {
				entityType: EntityType.EulerEvkVault,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Euler_Rest,
				],
			},
			$$gmxMarkets: {
				entityType: EntityType.GmxMarket,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Gmx_Rest,
				],
			},
			$$morphoMarkets: {
				entityType: EntityType.MorphoMarket,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Morpho_Graphql,
				],
			},
			$$morphoVaults: {
				entityType: EntityType.MorphoVault,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Morpho_Graphql,
				],
			},
			$$pendleMarkets: {
				entityType: EntityType.PendleMarket,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Pendle_Rest,
				],
			},
			$$bridges: {
				entityType: EntityType.EvmNetworkBridge,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Chainlist_Rest,
					Source.EthereumLists_Rest,
				],
			},
			$$erc20TokenTransfers: {
				entityType: EntityType.EvmTokenTransfer,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Blockscout_Rest,
				],
			},
			$$nftTokenTransfers: {
				entityType: EntityType.EvmTokenTransfer,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Blockscout_Rest,
				],
			},
			$$testnets: {
				entityType: EntityType.Network,
				cardinality: EntityFieldCardinality.Many,
			},
			$$childLayers: {
				entityType: EntityType.Network,
				cardinality: EntityFieldCardinality.Many,
			},
			$$siblingShardNetworks: {
				entityType: EntityType.Network,
				cardinality: EntityFieldCardinality.Many,
			},
			$$settledRollups: {
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
				entityType: EntityType.CosmosBlock,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.CosmosSdk_Rest,
				],
			},
			$$accounts: {
				entityType: EntityType.CosmosAccount,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.CosmosSdk_Rest,
				],
			},
			$$validators: {
				entityType: EntityType.CosmosValidator,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.CosmosSdk_Rest,
				],
			},
			$$governanceProposals: {
				entityType: EntityType.CosmosGovernanceProposal,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.CosmosSdk_Rest,
				],
			},
			$$osmosisPools: {
				entityType: EntityType.OsmosisPool,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Osmosis_LCD_Rest,
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
				entityType: EntityType.PolkadotBlock,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Polkadot_JsonRpc,
				],
			},
			$$validators: {
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
				entityType: EntityType.SolanaBlock,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Solana_JsonRpc,
				],
			},
			$$transactions: {
				entityType: EntityType.SolanaTransaction,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Solana_JsonRpc,
				],
			},
			$$accounts: {
				entityType: EntityType.SolanaAccount,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Solana_JsonRpc,
				],
			},
			$$programs: {
				entityType: EntityType.SolanaProgram,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Solana_JsonRpc,
				],
			},
			$$tokenAccounts: {
				entityType: EntityType.SolanaTokenAccount,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Solana_JsonRpc,
				],
			},
			$$tokenMints: {
				entityType: EntityType.SolanaTokenMint,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Solana_JsonRpc,
				],
			},
			$$validators: {
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
				entityType: EntityType.UtxoBlock,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.MempoolSpace_Rest,
					Source.Blockchair_Rest,
				],
			},
			$$transactions: {
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
				entityType: EntityType.BittensorNetwork_Timestamp,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Bittensor_JsonRpc,
				],
			},
			$$blocks: {
				entityType: EntityType.BittensorBlock,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Bittensor_JsonRpc,
				],
			},
			$$subnets: {
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
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			$$timestamps: {
				entityType: EntityType.ZeroGNetwork_Timestamp,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.ZeroGStorageScan_Rest,
				],
			},
			$$storageNodes: {
				entityType: EntityType.ZeroGStorageNode,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.ZeroGStorageScan_Rest,
				],
			},
			$$dataBlobs: {
				entityType: EntityType.ZeroGDataBlob,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.ZeroGStorageScan_Rest,
				],
			},
			$$storageLogEntries: {
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
				entityType: EntityType.FilecoinNetwork_Timestamp,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Lotus_JsonRpc,
				],
			},
			$$tipsets: {
				entityType: EntityType.FilecoinTipset,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Lotus_JsonRpc,
				],
			},
			$$deals: {
				entityType: EntityType.FilecoinDeal,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Filfox_Rest,
				],
			},
		}),
		Arweave: facet({
			path: [
				'namespace',
			],
			is: 'Arweave',
		})({
			$$timestamps: {
				entityType: EntityType.ArweaveNetwork_Timestamp,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Arweave_Graphql,
					Source.Arweave_Rest,
				],
			},
			$$blocks: {
				entityType: EntityType.ArweaveBlock,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Arweave_Graphql,
					Source.Arweave_Rest,
				],
			},
			$$transactions: {
				entityType: EntityType.ArweaveTransaction,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Arweave_Graphql,
				],
			},
			$$resources: {
				entityType: EntityType.ArweaveResource,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Arweave_Graphql,
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
				entityType: EntityType.NearNetwork_Timestamp,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.NearRpc_JsonRpc,
				],
			},
			$$blocks: {
				entityType: EntityType.NearBlock,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.NearRpc_JsonRpc,
				],
			},
			$$validators: {
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
				entityType: EntityType.MoneroNetwork_Timestamp,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.MoneroDaemonRpc_JsonRpc,
				],
			},
			$$blocks: {
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
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			$settlementNetwork: {
				entityType: EntityType.Network,
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			$$timestamps: {
				entityType: EntityType.LightningNetwork_Timestamp,
				cardinality: EntityFieldCardinality.ZeroOrMany,
			},
			$$nodes: {
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
				entityType: EntityType.CardanoNetwork_Timestamp,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.CardanoKoios_Rest,
				],
			},
			$$blocks: {
				entityType: EntityType.CardanoBlock,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.CardanoKoios_Rest,
				],
			},
			$$transactions: {
				entityType: EntityType.CardanoTransaction,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.CardanoKoios_Rest,
				],
			},
			$$stakePools: {
				entityType: EntityType.CardanoStakePool,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.CardanoKoios_Rest,
				],
			},
			$$dReps: {
				entityType: EntityType.CardanoDRep,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.CardanoKoios_Rest,
				],
			},
			$$governanceProposals: {
				entityType: EntityType.CardanoGovernanceProposal,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.CardanoKoios_Rest,
				],
			},
			$$assets: {
				entityType: EntityType.CardanoNativeAsset,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.CardanoKoios_Rest,
				],
			},
			$$protocolParameterEpochs: {
				entityType: EntityType.CardanoProtocolParameters_Epoch,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.CardanoKoios_Rest,
				],
			},
			$$committeeEpochs: {
				entityType: EntityType.CardanoCommittee_Epoch,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.CardanoKoios_Rest,
				],
			},
		}),
		Starknet: facet({
			path: [
				'namespace',
			],
			is: 'Starknet',
		})({}),
		Tron: facet({
			path: [
				'namespace',
			],
			is: 'Tron',
		})({
			restEndpoints: {
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
				entityType: EntityType.TronNetwork_Timestamp,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.TronGrid_Rest,
				],
			},
			$$blocks: {
				entityType: EntityType.TronBlock,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.TronGrid_Rest,
				],
			},
			$$witnesses: {
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
				entityType: EntityType.TonWorkchain,
				cardinality: EntityFieldCardinality.Many,
			},
			$$blocks: {
				entityType: EntityType.TonBlock,
				cardinality: EntityFieldCardinality.Many,
			},
			$$transactions: {
				entityType: EntityType.TonTransaction,
				cardinality: EntityFieldCardinality.Many,
			},
			$$accounts: {
				entityType: EntityType.TonAccount,
				cardinality: EntityFieldCardinality.Many,
			},
			$$contracts: {
				entityType: EntityType.TonContract,
				cardinality: EntityFieldCardinality.Many,
			},
			$$messages: {
				entityType: EntityType.TonMessage,
				cardinality: EntityFieldCardinality.Many,
			},
			$$traces: {
				entityType: EntityType.TonTrace,
				cardinality: EntityFieldCardinality.Many,
			},
			$$jettons: {
				entityType: EntityType.TonJetton,
				cardinality: EntityFieldCardinality.Many,
			},
			$$nftCollections: {
				entityType: EntityType.TonNftCollection,
				cardinality: EntityFieldCardinality.Many,
			},
			$$nftItems: {
				entityType: EntityType.TonNftItem,
				cardinality: EntityFieldCardinality.Many,
			},
			$$timestamps: {
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
				entityType: EntityType.XrplAccount,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Xrpl_Rippled,
				],
			},
			$$amendments: {
				entityType: EntityType.XrplAmendment,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Xrpl_Rippled,
				],
			},
			$$amms: {
				entityType: EntityType.XrplAmm,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Xrpl_Rippled,
				],
			},
			$$ledgerEntries: {
				entityType: EntityType.XrplLedgerEntry,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Xrpl_Rippled,
				],
			},
			$$ledgers: {
				entityType: EntityType.XrplLedger,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Xrpl_Rippled,
					Source.XrplClio_JsonRpc,
				],
			},
			$$transactions: {
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
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			realm: {
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			$$blocks: {
				entityType: EntityType.HederaBlock,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.HederaMirrorNode_Rest,
				],
			},
			$$accounts: {
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
				entityType: EntityType.HyperliquidNetwork_Timestamp,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Hyperliquid,
				],
			},
			$$blocks: {
				entityType: EntityType.HyperliquidBlock,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Hyperliquid,
				],
			},
			$$transactions: {
				entityType: EntityType.HyperliquidTransaction,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Hyperliquid,
				],
			},
			$$validators: {
				entityType: EntityType.HyperliquidValidator,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Hyperliquid,
				],
			},
			$$spotAssets: {
				entityType: EntityType.HyperliquidSpotAsset,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Hyperliquid,
				],
			},
			$$spotPairs: {
				entityType: EntityType.HyperliquidSpotPair,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Hyperliquid,
				],
			},
			$$perpMarkets: {
				entityType: EntityType.HyperliquidPerpMarket,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Hyperliquid,
				],
			},
			$$vaults: {
				entityType: EntityType.HyperliquidVault,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Hyperliquid,
				],
			},
		}),
		Quilibrium: facet({
			path: [
				'namespace',
			],
			is: 'Quilibrium',
		})({
			docsEndpoints: {
				primitiveType: type({
					url: type('string'),
					transportType: type('string'),
					providerName: type('string'),
				}),
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.QuilibriumDocs_Rest,
				],
			},
			nodeInterfaces: {
				primitiveType: type({
					label: type('string'),
					port: type('number'),
					transportType: type('string'),
				}),
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.QuilibriumDocs_Rest,
				],
			},
			protocolFacts: {
				primitiveType: type({
					label: type('string'),
					value: type('string'),
				}),
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.QuilibriumDocs_Rest,
				],
			},
			serviceLayers: {
				primitiveType: type({
					label: type('string'),
					description: type('string'),
				}),
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.QuilibriumDocs_Rest,
				],
			},
			$protocolDocument: {
				entityType: EntityType.SpecificationProposal,
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.QuilibriumDocs_Rest,
				],
			},
		}),
	},
})
