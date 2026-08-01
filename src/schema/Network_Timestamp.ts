// Generated from APP.ts.

import { NetworkExecutionModel, NetworkLedgerModel } from '$/constants/Network.ts'
import { entity, facet } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
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
		label: 'Network',
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		label: 'Timestamp',
		description: 'The observation time in Unix milliseconds.',
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		description: 'The source that produced this observation.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	ledgerModels: {
		label: 'Ledger models',
		primitiveType: type.enumerated(...Object.values(NetworkLedgerModel)),
		cardinality: EntityFieldCardinality.Many,
	},
	executionModels: {
		label: 'Execution models',
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
				label: 'Latest block height',
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			latestBlockHash: {
				label: 'Latest block hash',
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			latestBlockTimeMs: {
				label: 'Latest block time',
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			latestBlockTransactionCount: {
				label: 'Latest block transactions',
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			chainId: {
				label: 'Chain ID',
				description: 'The chain identifier used by the network family.',
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			nodeNetwork: {
				label: 'Node network',
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			applicationName: {
				label: 'Application name',
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			applicationVersion: {
				label: 'Application version',
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			cosmosSdkVersion: {
				label: 'Cosmos SDK version',
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			isSyncing: {
				label: 'Syncing',
				primitiveType: type('boolean'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			bondedValidatorCount: {
				label: 'Bonded validators',
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			bondedTokens: {
				label: 'Bonded tokens',
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			notBondedTokens: {
				label: 'Not bonded tokens',
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
		}),
		Polkadot: facet({
			path: [
				'executionModels',
			],
			includes: 'PolkadotRuntime',
		})({
			finalizedBlockNumber: {
				label: 'Finalized block number',
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			finalizedBlockHash: {
				label: 'Finalized block hash',
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			finalizedExtrinsicCount: {
				label: 'Finalized extrinsics',
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			runtimeSpecName: {
				label: 'Runtime spec name',
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			runtimeSpecVersion: {
				label: 'Runtime spec version',
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			transactionVersion: {
				label: 'Transaction version',
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			stateVersion: {
				label: 'State version',
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			peerCount: {
				label: 'Peers',
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			isSyncing: {
				label: 'Syncing',
				primitiveType: type('boolean'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			shouldHavePeers: {
				label: 'Should have peers',
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
				label: 'Health',
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			absoluteSlot: {
				label: 'Absolute slot',
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			blockHeight: {
				label: 'Block height',
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			epoch: {
				label: 'Epoch',
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			slotIndex: {
				label: 'Slot index',
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			slotsInEpoch: {
				label: 'Slots in epoch',
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			transactionCount: {
				label: 'Transaction count',
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			currentValidatorCount: {
				label: 'Current validator count',
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			delinquentValidatorCount: {
				label: 'Delinquent validator count',
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			totalActivatedStakeLamports: {
				label: 'Total activated stake',
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			solanaCoreVersion: {
				label: 'Solana core version',
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			featureSet: {
				label: 'Feature set',
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
				label: 'Best block height',
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			bestBlockHash: {
				label: 'Best block hash',
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			bestBlockTimeMs: {
				label: 'Best block time',
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			blockCount: {
				label: 'Block count',
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			transactionCount: {
				label: 'Transaction count',
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			blocks24h: {
				label: 'Blocks 24h',
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			transactions24h: {
				label: 'Transactions 24h',
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			mempoolTransactionCount: {
				label: 'Mempool transaction count',
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			mempoolSizeBytes: {
				label: 'Mempool size',
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			mempoolTps: {
				label: 'Mempool TPS',
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			averageTransactionFee24hSats: {
				label: 'Average transaction fee 24h',
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			medianTransactionFee24hSats: {
				label: 'Median transaction fee 24h',
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			suggestedTransactionFeePerByteSats: {
				label: 'Suggested fee per byte',
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			blockchainSizeBytes: {
				label: 'Blockchain size',
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
		}),
	},
})
