import { beforeEach, describe, expect, it, vi } from 'vitest'

import { networkBySlug } from '$/constants/Network.ts'
import { EntityMetaKey, entityFieldAddressKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import type {
	MoneroRpcBlock,
	MoneroRpcInfo,
	MoneroRpcTransaction,
} from '$/sources/MoneroDaemonRpc/JsonRpc/types.ts'
import { Source } from '$/sources/Source.ts'


const getBlock = vi.hoisted(() => vi.fn())
const getInfo = vi.hoisted(() => vi.fn())
const getTransactions = vi.hoisted(() => vi.fn())
vi.mock('$/sources/MoneroDaemonRpc/JsonRpc/queries.ts', () => ({
	getBlock,
	getInfo,
	getTransactions,
	moneroMainnetRpcEndpoints: [{
		url: 'https://monero.example',
		transportType: 'Http',
		providerName: 'Monero daemon',
	}],
}))

const { default: moneroDaemonRpc } = await import('$/resolvers/MoneroDaemonRpc-JsonRpc.ts')

const blockResolver = moneroDaemonRpc.resolvers.find((resolver) => (
	resolver.entityType === EntityType.MoneroBlock
))
const transactionResolver = moneroDaemonRpc.resolvers.find((resolver) => (
	resolver.entityType === EntityType.MoneroTransaction
))
const ringResolver = moneroDaemonRpc.resolvers.find((resolver) => (
	resolver.entityType === EntityType.MoneroRing
))
const ringMemberResolver = moneroDaemonRpc.resolvers.find((resolver) => (
	resolver.entityType === EntityType.MoneroRingMember
))
const stealthOutputResolver = moneroDaemonRpc.resolvers.find((resolver) => (
	resolver.entityType === EntityType.MoneroStealthOutput
))
const moneroNetworkBlocksResolver = moneroDaemonRpc.resolvers.find((resolver) => (
	resolver.entityType === EntityType.MoneroNetwork
	&& '$$blocks' in resolver.projections
))
const moneroNetworkTimestampsResolver = moneroDaemonRpc.resolvers.find((resolver) => (
	resolver.entityType === EntityType.MoneroNetwork
	&& '$$timestamps' in resolver.projections
))
const moneroNetworkLiveResolver = moneroDaemonRpc.resolvers.find((resolver) => (
	resolver.entityType === EntityType.Network
	&& resolver.resolveLive != null
	&& 'operatorState' in resolver.resolveLive
))

if (
	blockResolver == null
	|| transactionResolver == null
	|| ringResolver == null
	|| ringMemberResolver == null
	|| stealthOutputResolver == null
	|| moneroNetworkBlocksResolver == null
	|| moneroNetworkTimestampsResolver == null
	|| moneroNetworkLiveResolver == null
)
	throw new Error('MoneroDaemonRpc-JsonRpc spec missing required resolvers')

const block = {
	blob: 'block-blob',
	block_header: {
		block_size: 1_000,
		block_weight: 1_100,
		cumulative_difficulty: 2_000,
		cumulative_difficulty_top64: 0,
		depth: 1,
		difficulty: 2_500,
		difficulty_top64: 0,
		hash: 'block-hash',
		height: 3_400_000,
		long_term_weight: 1_050,
		major_version: 16,
		minor_version: 16,
		nonce: 42,
		num_txes: 2,
		orphan_status: false,
		pow_hash: 'pow-hash',
		prev_hash: 'parent-hash',
		reward: 600_000_000_000,
		timestamp: 1_722_470_400,
	},
	miner_tx_hash: 'miner-transaction-hash',
	tx_hashes: ['transaction-hash'],
} satisfies MoneroRpcBlock

const info = {
	alt_blocks_count: 0,
	cumulative_difficulty: 2_000,
	difficulty: 2_500,
	grey_peerlist_size: 1_000,
	height: 3_400_001,
	incoming_connections_count: 8,
	mainnet: true,
	nettype: 'mainnet',
	offline: false,
	outgoing_connections_count: 8,
	stagenet: false,
	status: 'OK',
	synchronized: true,
	target: 120,
	target_height: 3_400_001,
	testnet: false,
	top_block_hash: 'top-block-hash',
	tx_count: 90_000_000,
	tx_pool_size: 12,
	untrusted: false,
	version: '0.18.3.4',
	was_bootstrap_ever_used: false,
	white_peerlist_size: 2_000,
} satisfies MoneroRpcInfo

const transaction = {
	as_hex: 'deadbeef',
	block_height: 3_400_000,
	block_timestamp: 1_722_470_400,
	double_spend_seen: false,
	in_pool: false,
	output_indices: [
		10,
		11,
	],
	tx_hash: 'transaction-hash',
	decoded_json: {
		version: 2,
		unlock_time: 0,
		vin: [
			{
				key: {
					amount: 0,
					key_offsets: [
						10,
						5,
						20,
					],
					k_image: 'key-image',
				},
			},
		],
		vout: [
			{
				amount: 0,
				target: {
					key: 'output-public-key',
				},
			},
			{
				amount: 0,
				target: {
					tagged_key: {
						key: 'tagged-output-public-key',
						view_tag: 'view-tag',
					},
				},
			},
		],
		rct_signatures: {
			txnFee: '12345',
			outPk: [
				{
					mask: 'commitment-0',
				},
				{
					mask: 'commitment-1',
				},
			],
		},
	},
} satisfies MoneroRpcTransaction

const network = {
	caip2: networkBySlug.monero.caip2,
}
const height = BigInt(block.block_header.height)
const resolverContext = {
	pagination: {
		limit: 2,
	},
}

describe('Monero daemon block selectors', () => {
	beforeEach(() => {
		getBlock.mockReset()
		getBlock.mockResolvedValue(block)
	})

	it('resolves both selector arms through the same response projection', async () => {
		const byHeight = await blockResolver.resolve.NetworkHeight.resolve({
			$network: network,
			height,
		})

	expect(getBlock).toHaveBeenNthCalledWith(1, {
		height,
		})
		expect(await blockResolver.resolve.NetworkHeightHash.resolve({
			$network: network,
			height,
			hash: block.block_header.hash,
		})).toEqual(byHeight)
	expect(getBlock).toHaveBeenNthCalledWith(2, {
		height,
		})
		expect(Object.keys(blockResolver.resolve).sort()).toEqual([
			'NetworkHeight',
			'NetworkHeightHash',
		])
		expect(Object.keys(blockResolver.projections).sort()).toEqual([
			'$$transactions',
			'$parent',
			'difficulty',
			'hash',
			'timestampMs',
			'weightBytes',
		])
		expect(blockResolver.projections.hash(byHeight)).toBe(block.block_header.hash)
		expect(blockResolver.projections.$$transactions.select(byHeight)).toEqual([
			expect.objectContaining({
				[EntityMetaKey.Selector]: {
					$network: network,
					txHash: block.miner_tx_hash,
				},
			}),
			expect.objectContaining({
				[EntityMetaKey.Selector]: {
					$network: network,
					txHash: block.tx_hashes[0],
				},
			}),
		])
		expect(blockResolver.projections.$$transactions.resolveCount(byHeight)).toBe(2)
	})

	it('rejects a hash-selector response for a different block', async () => {
		await expect(blockResolver.resolve.NetworkHeightHash.resolve({
			$network: network,
			height,
			hash: 'different-block-hash',
		})).rejects.toThrow(
			'MoneroDaemonRpc_JsonRpc: block hash does not match the requested selector'
		)
		expect(getBlock).toHaveBeenCalledOnce()
	expect(getBlock).toHaveBeenCalledWith({
		height,
		})
	})
})

describe('Monero daemon tip / ring / stealth leftovers', () => {
	beforeEach(() => {
		getInfo.mockReset()
		getTransactions.mockReset()
		getInfo.mockResolvedValue(info)
		getTransactions.mockResolvedValue({
			txs: [transaction],
			txs_as_hex: [transaction.as_hex],
		})
	})

	it('projects tip $$blocks with authoritative resolveCount from get_info height', async () => {
		const snapshot = await moneroNetworkBlocksResolver.resolve.Network.resolve({
			$network: network,
		}, resolverContext)

		expect(moneroNetworkBlocksResolver.projections.$$blocks.select(snapshot)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$network: network,
					height: 3_400_000n,
					hash: 'top-block-hash',
				},
			},
			{
				[EntityMetaKey.Selector]: {
					$network: network,
					height: 3_399_999n,
				},
			},
		])
		expect(moneroNetworkBlocksResolver.projections.$$blocks.resolveCount(snapshot)).toBe(3_400_001)
	})

	it('projects tip $$timestamps with resolveCount from the single get_info observation', async () => {
		const timestamps = await moneroNetworkTimestampsResolver.resolve.Network.resolve({
			$network: network,
		})

		expect(moneroNetworkTimestampsResolver.projections.$$timestamps.select(timestamps)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$network: network,
					timestampMs: expect.any(Number),
					source: Source.MoneroDaemonRpc_JsonRpc,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.MoneroNetwork_Timestamp, [], 'height')]: 3_400_001n,
					[entityFieldAddressKey(EntityType.MoneroNetwork_Timestamp, [], 'targetHeight')]: 3_400_001n,
					[entityFieldAddressKey(EntityType.MoneroNetwork_Timestamp, [], 'topBlockHash')]: 'top-block-hash',
					[entityFieldAddressKey(EntityType.MoneroNetwork_Timestamp, [], 'difficulty')]: 2_500n,
					[entityFieldAddressKey(EntityType.MoneroNetwork_Timestamp, [], 'cumulativeDifficulty')]: 2_000n,
					[entityFieldAddressKey(EntityType.MoneroNetwork_Timestamp, [], 'greyPeerlistSize')]: 1_000,
					[entityFieldAddressKey(EntityType.MoneroNetwork_Timestamp, [], 'whitePeerlistSize')]: 2_000,
					[entityFieldAddressKey(EntityType.MoneroNetwork_Timestamp, [], 'incomingConnections')]: 8,
					[entityFieldAddressKey(EntityType.MoneroNetwork_Timestamp, [], 'outgoingConnections')]: 8,
					[entityFieldAddressKey(EntityType.MoneroNetwork_Timestamp, [], 'txCount')]: 90_000_000n,
					[entityFieldAddressKey(EntityType.MoneroNetwork_Timestamp, [], 'txPoolSize')]: 12,
					[entityFieldAddressKey(EntityType.MoneroNetwork_Timestamp, [], 'altBlocksCount')]: 0,
					[entityFieldAddressKey(EntityType.MoneroNetwork_Timestamp, [], 'targetSeconds')]: 120,
					[entityFieldAddressKey(EntityType.MoneroNetwork_Timestamp, [], 'mainnet')]: true,
					[entityFieldAddressKey(EntityType.MoneroNetwork_Timestamp, [], 'nettype')]: 'mainnet',
					[entityFieldAddressKey(EntityType.MoneroNetwork_Timestamp, [], 'offline')]: false,
					[entityFieldAddressKey(EntityType.MoneroNetwork_Timestamp, [], 'synchronized')]: true,
					[entityFieldAddressKey(EntityType.MoneroNetwork_Timestamp, [], 'wasBootstrapEverUsed')]: false,
					[entityFieldAddressKey(EntityType.MoneroNetwork_Timestamp, [], 'version')]: '0.18.3.4',
					[entityFieldAddressKey(EntityType.MoneroNetwork_Timestamp, [], 'status')]: 'OK',
				},
			},
		])
		expect(moneroNetworkTimestampsResolver.projections.$$timestamps.resolveCount(timestamps)).toBe(1)
		expect(getInfo).toHaveBeenCalledOnce()
		expect(moneroDaemonRpc.resolvers.some((resolver) => (
			resolver.entityType === EntityType.MoneroNetwork_Timestamp
		))).toBe(false)
	})

	it('projects absolute ring member globalOutputIndex from relative key_offsets', async () => {
		const keyImage = {
			$transaction: {
				$network: network,
				txHash: transaction.tx_hash,
			},
			inputIndex: 0,
			keyImage: 'key-image',
		}
		const ring = await ringResolver.resolve.MoneroKeyImage.resolve({
			$keyImage: keyImage,
		})

		expect(ringResolver.projections.$$members.select(ring)).toEqual([
			expect.objectContaining({
				[EntityMetaKey.Selector]: {
					$ring: {
						$keyImage: keyImage,
					},
					memberIndex: 0,
				},
				globalOutputIndex: 10n,
			}),
			expect.objectContaining({
				globalOutputIndex: 15n,
			}),
			expect.objectContaining({
				globalOutputIndex: 35n,
			}),
		])
		expect(ringResolver.projections.$$members.resolveCount(ring)).toBe(3)

		const ringMember = await ringMemberResolver.resolve.MoneroRingMemberIndex.resolve({
			$ring: {
				$keyImage: keyImage,
			},
			memberIndex: 2,
		})
		expect(ringMemberResolver.projections.globalOutputIndex(ringMember)).toBe(35n)
	})

	it('projects stealth outputs and key-image lists with authoritative resolveCount', async () => {
		const resolved = await transactionResolver.resolve.NetworkTxHash.resolve({
			$network: network,
			txHash: transaction.tx_hash,
		})

		expect(transactionResolver.projections.$$stealthOutputs.select(resolved)).toEqual([
			expect.objectContaining({
				[EntityMetaKey.Selector]: {
					$transaction: {
						$network: network,
						txHash: transaction.tx_hash,
					},
					outputIndex: 0,
				},
				publicKey: 'output-public-key',
				commitment: 'commitment-0',
			}),
			expect.objectContaining({
				publicKey: 'tagged-output-public-key',
				commitment: 'commitment-1',
			}),
		])
		expect(transactionResolver.projections.$$stealthOutputs.resolveCount(resolved)).toBe(2)
		expect(transactionResolver.projections.$$keyImages.resolveCount(resolved)).toBe(1)

		const stealthOutput = await stealthOutputResolver.resolve.MoneroTransactionOutputIndex.resolve({
			$transaction: {
				$network: network,
				txHash: transaction.tx_hash,
			},
			outputIndex: 1,
		})
		expect(stealthOutputResolver.projections.publicKey(stealthOutput)).toBe('tagged-output-public-key')
		expect(stealthOutputResolver.projections.commitment(stealthOutput)).toBe('commitment-1')
	})
})

describe('Monero live operator state', () => {
	beforeEach(() => {
		getInfo.mockReset()
		getInfo.mockResolvedValue(info)
		vi.useFakeTimers()
	})

	it('publishes daemon state and exact head until abort cleanup', async () => {
		const replaceTimestamps = vi.fn()
		const replaceBlocks = vi.fn()
		const abortController = new AbortController()
		const cleanup = await moneroNetworkLiveResolver.resolveLive.operatorState.start({
			parentEntitySelector: network,
			queryClient: {},
			signal: abortController.signal,
			trigger: resolverContext,
			fields: {
				$$timestamps: {
					replaceRows: replaceTimestamps,
					invalidate: vi.fn(),
					count: {
						replaceRows: vi.fn(),
						invalidate: vi.fn(),
					},
				},
				$$blocks: {
					replaceRows: replaceBlocks,
					invalidate: vi.fn(),
					count: {
						replaceRows: vi.fn(),
						invalidate: vi.fn(),
					},
				},
			},
		})
		await vi.waitFor(() => expect(replaceBlocks).toHaveBeenCalledOnce())

		expect(replaceTimestamps).toHaveBeenCalledWith([{
			source: Source.MoneroDaemonRpc_JsonRpc,
			value: [expect.objectContaining({
				[EntityMetaKey.Selector]: {
					$network: network,
					timestampMs: expect.any(Number),
					source: Source.MoneroDaemonRpc_JsonRpc,
				},
			})],
		}])
		expect(replaceBlocks).toHaveBeenCalledWith([{
			source: Source.MoneroDaemonRpc_JsonRpc,
			value: [{
				[EntityMetaKey.Selector]: {
					$network: network,
					height: 3_400_000n,
					hash: 'top-block-hash',
				},
			}],
		}])

		getInfo.mockResolvedValueOnce({
			...info,
			height: 3_400_002,
			top_block_hash: 'next-block-hash',
		})
		await vi.advanceTimersByTimeAsync(10_000)
		await vi.waitFor(() => expect(replaceBlocks).toHaveBeenCalledTimes(2))
		expect(replaceBlocks).toHaveBeenLastCalledWith([{
			source: Source.MoneroDaemonRpc_JsonRpc,
			value: [{
				[EntityMetaKey.Selector]: {
					$network: network,
					height: 3_400_001n,
					hash: 'next-block-hash',
				},
			}],
		}])

		abortController.abort()
		cleanup?.()
		await vi.advanceTimersByTimeAsync(10_000)
		expect(getInfo).toHaveBeenCalledTimes(2)
	})
})
