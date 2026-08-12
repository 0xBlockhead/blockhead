// Generated from APP.ts.

import { NetworkExecutionModel, NetworkLedgerModel } from '$/constants/Network.ts'
import { entity, facet } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.Network_Timestamp,
	labels: {
		singular: 'Network timestamp',
		plural: 'network observations',
	},
	description: 'A point-in-time observation of network status or metrics.',
})({
	$network: {
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	ledgerModels: {
		primitiveType: type.enumerated(...Object.values(NetworkLedgerModel)),
		cardinality: EntityFieldCardinality.Many,
	},
	executionModels: {
		primitiveType: type.enumerated(...Object.values(NetworkExecutionModel)),
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		NetworkTimestampMsSource: [
			'$network',
			'timestampMs',
			'source',
		],
	},

	facets: {
		Cosmos: facet({
			path: [
				'executionModels',
			],
			includes: 'CosmosSdk',
		})({
			latestBlockHeight: {
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.CometBft_Rest,
					Source.CosmosSdk_Rest,
					Source.Mintscan,
				],
			},
			latestBlockHash: {
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.CometBft_Rest,
					Source.CosmosSdk_Rest,
					Source.Mintscan,
				],
			},
			latestBlockTimeMs: {
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.CometBft_Rest,
					Source.CosmosSdk_Rest,
					Source.Mintscan,
				],
			},
			latestBlockTransactionCount: {
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.CometBft_Rest,
					Source.CosmosSdk_Rest,
					Source.Mintscan,
				],
			},
			chainId: {
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.CometBft_Rest,
					Source.CosmosSdk_Rest,
					Source.Mintscan,
				],
			},
			nodeNetwork: {
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.CometBft_Rest,
					Source.CosmosSdk_Rest,
					Source.Mintscan,
				],
			},
			applicationName: {
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.CosmosSdk_Rest,
					Source.Mintscan,
				],
			},
			applicationVersion: {
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.CosmosSdk_Rest,
					Source.Mintscan,
				],
			},
			cosmosSdkVersion: {
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.CosmosSdk_Rest,
					Source.Mintscan,
				],
			},
			isSyncing: {
				primitiveType: type('boolean'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.CometBft_Rest,
					Source.CosmosSdk_Rest,
					Source.Mintscan,
				],
			},
			bondedValidatorCount: {
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.CosmosSdk_Rest,
				],
			},
			bondedTokens: {
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.CosmosSdk_Rest,
				],
			},
			notBondedTokens: {
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
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
			finalizedBlockNumber: {
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			finalizedBlockHash: {
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			finalizedExtrinsicCount: {
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			runtimeSpecName: {
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			runtimeSpecVersion: {
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			transactionVersion: {
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			stateVersion: {
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			peerCount: {
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			isSyncing: {
				primitiveType: type('boolean'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			shouldHavePeers: {
				primitiveType: type('boolean'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
		}),
		Solana: facet({
			path: [
				'executionModels',
			],
			includes: 'SolanaRuntime',
		})({
			health: {
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			absoluteSlot: {
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			blockHeight: {
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			epoch: {
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			slotIndex: {
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			slotsInEpoch: {
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			transactionCount: {
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			currentValidatorCount: {
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			delinquentValidatorCount: {
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			totalActivatedStakeLamports: {
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			solanaCoreVersion: {
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			featureSet: {
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
		}),
		Utxo: facet({
			path: [
				'ledgerModels',
			],
			includes: 'Utxo',
		})({
			bestBlockHeight: {
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Esplora_Rest,
					Source.MempoolSpace_Rest,
				],
			},
			bestBlockHash: {
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Esplora_Rest,
					Source.MempoolSpace_Rest,
				],
			},
			bestBlockTimeMs: {
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Esplora_Rest,
					Source.MempoolSpace_Rest,
				],
			},
			blockCount: {
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			transactionCount: {
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			blocks24h: {
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			transactions24h: {
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			mempoolTransactionCount: {
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Esplora_Rest,
					Source.MempoolSpace_Rest,
				],
			},
			mempoolSizeBytes: {
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Esplora_Rest,
					Source.MempoolSpace_Rest,
				],
			},
			mempoolTps: {
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			averageTransactionFee24hSats: {
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			medianTransactionFee24hSats: {
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			suggestedTransactionFeePerByteSats: {
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Esplora_Rest,
					Source.MempoolSpace_Rest,
				],
			},
			blockchainSizeBytes: {
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			hashrateHashesPerSecond: {
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.BitcoinCore_JsonRpc,
				],
			},
			hashrateBlockWindow: {
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.BitcoinCore_JsonRpc,
				],
			},
			conservativeFeeRate2BlocksSatsPerKvb: {
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.BitcoinCore_JsonRpc,
				],
			},
			conservativeFeeRate6BlocksSatsPerKvb: {
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.BitcoinCore_JsonRpc,
				],
			},
			conservativeFeeRate12BlocksSatsPerKvb: {
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.BitcoinCore_JsonRpc,
				],
			},
			conservativeFeeRate24BlocksSatsPerKvb: {
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.BitcoinCore_JsonRpc,
				],
			},
			miningTemplateHeight: {
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.BitcoinCore_JsonRpc,
				],
			},
			miningTemplatePreviousBlockHash: {
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.BitcoinCore_JsonRpc,
				],
			},
			miningTemplateTarget: {
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.BitcoinCore_JsonRpc,
				],
			},
			miningTemplateCurrentTimeMs: {
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.BitcoinCore_JsonRpc,
				],
			},
			miningTemplateMinimumTimeMs: {
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.BitcoinCore_JsonRpc,
				],
			},
			miningTemplateCoinbaseValueSats: {
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.BitcoinCore_JsonRpc,
				],
			},
			miningTemplateTransactionCount: {
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.BitcoinCore_JsonRpc,
				],
			},
			miningTemplateSizeLimitBytes: {
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.BitcoinCore_JsonRpc,
				],
			},
			miningTemplateWeightLimit: {
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.BitcoinCore_JsonRpc,
				],
			},
			miningTemplateSigopLimit: {
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.BitcoinCore_JsonRpc,
				],
			},
			miningTemplateRules: {
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.BitcoinCore_JsonRpc,
				],
			},
			miningTemplateMutableFields: {
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.BitcoinCore_JsonRpc,
				],
			},
			miningTemplateNonceRange: {
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.BitcoinCore_JsonRpc,
				],
			},
			miningTemplateBits: {
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.BitcoinCore_JsonRpc,
				],
			},
			$$miningTemplateTransactions: {
				entityType: EntityType.UtxoTransaction,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.BitcoinCore_JsonRpc,
				],
			},
		}),
	},
})
