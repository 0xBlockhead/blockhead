// Generated from APP.ts.

import { NetworkExecutionModel, NetworkLedgerModel, NetworkNamespace } from '$/constants/Network.ts'
import { entity, facet } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ConsensusProtocol } from '$/schema/NetworkUpgradeProtocols.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

const constantsInternalL2BeatRestSources = [
	Source.Constants_Internal,
	Source.L2Beat_Rest,
] as const
const constantsInternalSources = [
	Source.Constants_Internal,
] as const
const voltaireJsonRpcSources = [
	Source.Voltaire_JsonRpc,
] as const
const blockscoutRestSources = [
	Source.Blockscout_Rest,
] as const
const beaconRestSources = [
	Source.Beacon_Rest,
] as const
const mevRelayRestSources = [
	Source.MevRelay_Rest,
] as const
const cosmosSdkRestSources = [
	Source.CosmosSdk_Rest,
] as const
const polkadotJsonRpcSources = [
	Source.Polkadot_JsonRpc,
] as const
const solanaJsonRpcSources = [
	Source.Solana_JsonRpc,
] as const
const mempoolSpaceRestBlockchairRestSources = [
	Source.MempoolSpace_Rest,
	Source.Blockchair_Rest,
] as const
const bittensorJsonRpcSources = [
	Source.Bittensor_JsonRpc,
] as const
const zeroGStorageScanRestSources = [
	Source.ZeroGStorageScan_Rest,
] as const
const lotusJsonRpcSources = [
	Source.Lotus_JsonRpc,
] as const
const nearRpcJsonRpcSources = [
	Source.NearRpc_JsonRpc,
] as const
const moneroDaemonRpcJsonRpcSources = [
	Source.MoneroDaemonRpc_JsonRpc,
] as const
const cardanoKoiosRestSources = [
	Source.CardanoKoios_Rest,
] as const
const tronGridRestSources = [
	Source.TronGrid_Rest,
] as const
const xrplRippledSources = [
	Source.Xrpl_Rippled,
] as const
const hederaMirrorNodeRestSources = [
	Source.HederaMirrorNode_Rest,
] as const
const hyperliquidSources = [
	Source.Hyperliquid,
] as const

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
		defaultSources: constantsInternalL2BeatRestSources,
	},
	executionModels: {
		primitiveType: type.enumerated(...Object.values(NetworkExecutionModel)),
		cardinality: EntityFieldCardinality.Many,
		defaultSources: constantsInternalL2BeatRestSources,
	},
	$networkStack: {
		entityType: EntityType.NetworkStack,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: constantsInternalL2BeatRestSources,
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
				defaultSources: constantsInternalSources,
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
				defaultSources: constantsInternalSources,
			},
			$$executionUpgrades: {
				entityType: EntityType.EthereumExecutionUpgrade,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: constantsInternalSources,
			},
			$$consensusUpgrades: {
				entityType: EntityType.EthereumConsensusUpgrade,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: constantsInternalSources,
			},
			$$timestamps: {
				entityType: EntityType.EvmNetwork_Timestamp,
				cardinality: EntityFieldCardinality.ZeroOrMany,
				defaultSources: voltaireJsonRpcSources,
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
				defaultSources: blockscoutRestSources,
			},
			$$txpoolTimestamps: {
				entityType: EntityType.EvmNetwork_Txpool_Timestamp,
				cardinality: EntityFieldCardinality.ZeroOrMany,
				defaultSources: voltaireJsonRpcSources,
			},
			$$gasFeeBlocks: {
				entityType: EntityType.EvmNetwork_GasFee_Block,
				cardinality: EntityFieldCardinality.ZeroOrMany,
				defaultSources: voltaireJsonRpcSources,
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
				defaultSources: beaconRestSources,
			},
			$$beaconFinalityTimestamps: {
				entityType: EntityType.EthereumBeaconFinality_Timestamp,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: beaconRestSources,
			},
			$$beaconEpochs: {
				entityType: EntityType.BeaconEpoch,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: beaconRestSources,
			},
			$$beaconSlots: {
				entityType: EntityType.BeaconSlot,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: beaconRestSources,
			},
			$$beaconCommittees: {
				entityType: EntityType.BeaconCommittee,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: beaconRestSources,
			},
			$$beaconSyncCommittees: {
				entityType: EntityType.BeaconSyncCommittee,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: beaconRestSources,
			},
			$$beaconAttestations: {
				entityType: EntityType.BeaconAttestation,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: beaconRestSources,
			},
			$$beaconWithdrawals: {
				entityType: EntityType.BeaconWithdrawal,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: beaconRestSources,
			},
			$$beaconSlashings: {
				entityType: EntityType.BeaconSlashing,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: beaconRestSources,
			},
			$$beaconValidators: {
				entityType: EntityType.BeaconValidator,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: beaconRestSources,
			},
			$$mevRelays: {
				entityType: EntityType.MevRelay,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: constantsInternalSources,
			},
			$$mevBuilders: {
				entityType: EntityType.MevBuilder,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: mevRelayRestSources,
			},
			$$mevProposerPayloadDelivered: {
				entityType: EntityType.MevRelay_ProposerPayloadDelivered,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: mevRelayRestSources,
			},
			$$blobs: {
				entityType: EntityType.EvmBlob,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: voltaireJsonRpcSources,
			},
			$$contracts: {
				entityType: EntityType.EvmContract,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: blockscoutRestSources,
			},
			$$precompiles: {
				entityType: EntityType.EvmContract,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: constantsInternalSources,
			},
			$nativeCoin: {
				entityType: EntityType.Coin,
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: constantsInternalSources,
			},
			$nativeCoinInstance: {
				entityType: EntityType.EvmCoinInstance,
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: constantsInternalSources,
			},
			$$erc4337SmartAccounts: {
				entityType: EntityType.Erc4337SmartAccount,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: blockscoutRestSources,
			},
			$$erc4337Bundlers: {
				entityType: EntityType.Erc4337Bundler,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: blockscoutRestSources,
			},
			$$erc4337Paymasters: {
				entityType: EntityType.Erc4337Paymaster,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: blockscoutRestSources,
			},
			$$erc4337AccountFactories: {
				entityType: EntityType.Erc4337AccountFactory,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: blockscoutRestSources,
			},
			$$userOperations: {
				entityType: EntityType.EvmUserOperation,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: blockscoutRestSources,
			},
			$$bridges: {
				entityType: EntityType.EvmNetworkBridge,
				cardinality: EntityFieldCardinality.Many,
			},
			$$erc20TokenTransfers: {
				entityType: EntityType.EvmTokenTransfer,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: blockscoutRestSources,
			},
			$$nftTokenTransfers: {
				entityType: EntityType.EvmTokenTransfer,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: blockscoutRestSources,
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
				defaultSources: cosmosSdkRestSources,
			},
			$$blocks: {
				entityType: EntityType.CosmosBlock,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: cosmosSdkRestSources,
			},
			$$accounts: {
				entityType: EntityType.CosmosAccount,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: cosmosSdkRestSources,
			},
			$$validators: {
				entityType: EntityType.CosmosValidator,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: cosmosSdkRestSources,
			},
			$$governanceProposals: {
				entityType: EntityType.CosmosGovernanceProposal,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: cosmosSdkRestSources,
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
				defaultSources: polkadotJsonRpcSources,
			},
			$$blocks: {
				entityType: EntityType.PolkadotBlock,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: polkadotJsonRpcSources,
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
				defaultSources: solanaJsonRpcSources,
			},
			$$blocks: {
				entityType: EntityType.SolanaBlock,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: solanaJsonRpcSources,
			},
			$$transactions: {
				entityType: EntityType.SolanaTransaction,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: solanaJsonRpcSources,
			},
			$$accounts: {
				entityType: EntityType.SolanaAccount,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: solanaJsonRpcSources,
			},
			$$programs: {
				entityType: EntityType.SolanaProgram,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: solanaJsonRpcSources,
			},
			$$tokenAccounts: {
				entityType: EntityType.SolanaTokenAccount,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: solanaJsonRpcSources,
			},
			$$tokenMints: {
				entityType: EntityType.SolanaTokenMint,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: solanaJsonRpcSources,
			},
			$$validators: {
				entityType: EntityType.SolanaValidator,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: solanaJsonRpcSources,
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
				defaultSources: mempoolSpaceRestBlockchairRestSources,
			},
			$$transactions: {
				entityType: EntityType.UtxoTransaction,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: mempoolSpaceRestBlockchairRestSources,
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
				defaultSources: constantsInternalSources,
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
				defaultSources: bittensorJsonRpcSources,
			},
			$$blocks: {
				entityType: EntityType.BittensorBlock,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: bittensorJsonRpcSources,
			},
			$$subnets: {
				entityType: EntityType.BittensorSubnet,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: bittensorJsonRpcSources,
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
				defaultSources: zeroGStorageScanRestSources,
			},
			$$storageNodes: {
				entityType: EntityType.ZeroGStorageNode,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: zeroGStorageScanRestSources,
			},
			$$dataBlobs: {
				entityType: EntityType.ZeroGDataBlob,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: zeroGStorageScanRestSources,
			},
			$$storageLogEntries: {
				entityType: EntityType.ZeroGStorageLogEntry,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: zeroGStorageScanRestSources,
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
				defaultSources: lotusJsonRpcSources,
			},
			$$timestamps: {
				entityType: EntityType.FilecoinNetwork_Timestamp,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: lotusJsonRpcSources,
			},
			$$tipsets: {
				entityType: EntityType.FilecoinTipset,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: lotusJsonRpcSources,
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
				defaultSources: nearRpcJsonRpcSources,
			},
			$$timestamps: {
				entityType: EntityType.NearNetwork_Timestamp,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: nearRpcJsonRpcSources,
			},
			$$blocks: {
				entityType: EntityType.NearBlock,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: nearRpcJsonRpcSources,
			},
			$$validators: {
				entityType: EntityType.NearValidator,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: nearRpcJsonRpcSources,
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
				defaultSources: moneroDaemonRpcJsonRpcSources,
			},
			$$timestamps: {
				entityType: EntityType.MoneroNetwork_Timestamp,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: moneroDaemonRpcJsonRpcSources,
			},
			$$blocks: {
				entityType: EntityType.MoneroBlock,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: moneroDaemonRpcJsonRpcSources,
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
				defaultSources: cardanoKoiosRestSources,
			},
			$$timestamps: {
				entityType: EntityType.CardanoNetwork_Timestamp,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: cardanoKoiosRestSources,
			},
			$$blocks: {
				entityType: EntityType.CardanoBlock,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: cardanoKoiosRestSources,
			},
			$$transactions: {
				entityType: EntityType.CardanoTransaction,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: cardanoKoiosRestSources,
			},
			$$stakePools: {
				entityType: EntityType.CardanoStakePool,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: cardanoKoiosRestSources,
			},
			$$dReps: {
				entityType: EntityType.CardanoDRep,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: cardanoKoiosRestSources,
			},
			$$governanceProposals: {
				entityType: EntityType.CardanoGovernanceProposal,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: cardanoKoiosRestSources,
			},
			$$assets: {
				entityType: EntityType.CardanoNativeAsset,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: cardanoKoiosRestSources,
			},
			$$protocolParameterEpochs: {
				entityType: EntityType.CardanoProtocolParameters_Epoch,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: cardanoKoiosRestSources,
			},
			$$committeeEpochs: {
				entityType: EntityType.CardanoCommittee_Epoch,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: cardanoKoiosRestSources,
			},
		}),
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
				defaultSources: tronGridRestSources,
			},
			$$timestamps: {
				entityType: EntityType.TronNetwork_Timestamp,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: tronGridRestSources,
			},
			$$blocks: {
				entityType: EntityType.TronBlock,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: tronGridRestSources,
			},
			$$witnesses: {
				entityType: EntityType.TronWitness,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: tronGridRestSources,
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
				defaultSources: xrplRippledSources,
			},
			$$amendments: {
				entityType: EntityType.XrplAmendment,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: xrplRippledSources,
			},
			$$amms: {
				entityType: EntityType.XrplAmm,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: xrplRippledSources,
			},
			$$ledgerEntries: {
				entityType: EntityType.XrplLedgerEntry,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: xrplRippledSources,
			},
			$$ledgers: {
				entityType: EntityType.XrplLedger,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: xrplRippledSources,
			},
			$$transactions: {
				entityType: EntityType.XrplTransaction,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: xrplRippledSources,
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
				defaultSources: hederaMirrorNodeRestSources,
			},
			$$accounts: {
				entityType: EntityType.HederaAccount,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: hederaMirrorNodeRestSources,
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
				defaultSources: hyperliquidSources,
			},
			restEndpoints: {
				primitiveType: type({
					url: type('string'),
					transportType: type('string'),
					providerName: type('string'),
				}),
				cardinality: EntityFieldCardinality.Many,
				defaultSources: hyperliquidSources,
			},
			$$timestamps: {
				entityType: EntityType.HyperliquidNetwork_Timestamp,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: hyperliquidSources,
			},
			$$blocks: {
				entityType: EntityType.HyperliquidBlock,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: hyperliquidSources,
			},
			$$transactions: {
				entityType: EntityType.HyperliquidTransaction,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: hyperliquidSources,
			},
			$$validators: {
				entityType: EntityType.HyperliquidValidator,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: hyperliquidSources,
			},
			$$spotAssets: {
				entityType: EntityType.HyperliquidSpotAsset,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: hyperliquidSources,
			},
			$$perpMarkets: {
				entityType: EntityType.HyperliquidPerpMarket,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: hyperliquidSources,
			},
		}),
	},
})
