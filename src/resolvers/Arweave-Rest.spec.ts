import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import { EntityMetaKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

const getNetworkInfo = vi.hoisted(() => vi.fn())
const getBlockByHeight = vi.hoisted(() => vi.fn())
const getBlockByHash = vi.hoisted(() => vi.fn())
const fetchBrowseResult = vi.hoisted(() => vi.fn())

vi.mock('$/sources/Arweave/Rest/queries.ts', () => ({
	getNetworkInfo,
	getBlockByHeight,
	getBlockByHash,
	fetchBrowseResult,
}))

const { default: arweaveRest } = await import('$/resolvers/Arweave-Rest.ts')

const networkTimestampResolver = arweaveRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.ArweaveNetwork_Timestamp
))
const blockResolver = arweaveRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.ArweaveBlock
))
const resourceResolver = arweaveRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.ArweaveResource
))
const resourceTimestampResolver = arweaveRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.ArweaveResource_Timestamp
))

if (
	networkTimestampResolver == null
	|| blockResolver == null
	|| resourceResolver == null
	|| resourceTimestampResolver == null
)
	throw new Error('Arweave-Rest spec missing resolvers')

const transactionId = 'A'.repeat(43)
const blockId = 'D'.repeat(64)
const previousBlockId = 'F'.repeat(64)
const network = {
	slug: 'arweave' as const,
}
const arweaveNetwork = {
	$network: network,
}
const context = {
	filters: [],
	pagination: {},
	selectorKeys: [],
	parentSelectorKeys: [],
	publicEnv: {},
}

describe('Arweave_Rest block / info / resource browse resolvers', () => {
	beforeEach(() => {
		getNetworkInfo.mockReset()
		getBlockByHeight.mockReset()
		getBlockByHash.mockReset()
		fetchBrowseResult.mockReset()
	})

	it('registers against Arweave_Rest only', () => {
		expect(arweaveRest.source).toBe(Source.Arweave_Rest)
	})

	it('maps GET /info into ArweaveNetwork_Timestamp fields', async () => {
		getNetworkInfo.mockResolvedValueOnce({
			network: 'arweave.N.1',
			version: 5,
			release: 43,
			height: 551_511,
			current: blockId,
			blocks: 97_375,
			peers: 64,
			queue_length: 0,
		})
		await expect(networkTimestampResolver.resolve.NetworkTimestampMsSource.resolve(
			{
				$network: arweaveNetwork,
				timestampMs: 1_700_000_000_000,
				source: Source.Arweave_Rest,
			},
			context
		)).resolves.toMatchObject({
			latestHeight: 551_511n,
			latestBlockHash: blockId,
			currentBlockHash: blockId,
			networkId: 'arweave.N.1',
			peerCount: 64,
			queuedTransactionCount: 0,
			gatewayOrigin: 'https://arweave.net',
			reachable: true,
		})
	})

	it('maps GET /block/height into full ArweaveBlock fields and tx refs', async () => {
		getBlockByHeight.mockResolvedValueOnce({
			indep_hash: blockId,
			previous_block: previousBlockId,
			timestamp: 1_586_440_919,
			height: 422_250,
			txs: [
				transactionId,
			],
			tx_root: 'lsoo-p3Tj7oblZ-54WVPHoVguqgw5rA9Jf3lLH6H8zY',
			wallet_list: 'N5NJtXhgH9bPmXoSopehcr_zqwyPjjg3igel0V8G1DdLk_BYdoRVIBsqjVA9JmFc',
			reward_addr: 'Oox7m4HIcVhUtMd6AUuGtlaOoSCmREUNPyyKQCbz4d4',
			reward_pool: 3_026_104_059_201_252,
			weave_size: 407_672_420_044,
			block_size: 937_455,
			cumulative_diff: '99416580392277',
			hash_list_merkle: 'akSjDrBKPuepJMOhO_S9C-iFp5zn9Glv57HGdN_WPqEToWC0Ukb37Gzs4PDA7oLU',
		})
		const snapshot = await blockResolver.resolve.NetworkHeight.resolve(
			{
				$network: arweaveNetwork,
				height: 422_250n,
			},
			context
		)
		expect(snapshot).toMatchObject({
			height: 422_250n,
			indepHash: blockId,
			previousBlock: previousBlockId,
			timestampMs: 1_586_440_919_000,
			transactionRoot: 'lsoo-p3Tj7oblZ-54WVPHoVguqgw5rA9Jf3lLH6H8zY',
			rewardPoolWinston: 3_026_104_059_201_252n,
			transactionCount: 1,
		})
		expect(blockResolver.projections.$$transactions(snapshot)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$network: arweaveNetwork,
					transactionId,
				},
			},
		])
		expect(getBlockByHeight).toHaveBeenCalledWith(422_250)
	})

	it('fail-closes foreign networks and missing browse origins', async () => {
		await expect(blockResolver.resolve.NetworkHeight.resolve(
			{
				$network: {
					$network: {
						slug: 'celestia',
					},
				},
				height: 1n,
			},
			context
		)).rejects.toThrow('unsupported network')

		fetchBrowseResult.mockResolvedValueOnce({
			transactionId,
			contentPath: '',
			gatewayOrigin: undefined,
			gatewayUrl: 'https://arweave.net/' + transactionId,
			displayType: 'text',
			contentLength: 4,
		})
		await expect(resourceTimestampResolver.resolve.ResourceTimestampMsSource.resolve(
			{
				$resource: {
					transactionId,
					contentPath: '',
				},
				timestampMs: Date.now(),
				source: Source.Arweave_Rest,
			},
			context
		)).rejects.toThrow('missing gateway origin')
	})

	it('projects resource identity and loads gateway observations', async () => {
		const resource = await resourceResolver.resolve.TransactionIdContentPath.resolve(
			{
				transactionId,
				contentPath: '',
			},
			context
		)
		expect(resource).toMatchObject({
			canonicalUri: `ar://${transactionId}`,
			timestamps: [
				{
					[EntityMetaKey.Selector]: {
						$resource: {
							transactionId,
							contentPath: '',
						},
						source: Source.Arweave_Rest,
					},
				},
			],
		})

		fetchBrowseResult.mockResolvedValueOnce({
			transactionId,
			contentPath: '',
			gatewayOrigin: 'https://arweave.net',
			gatewayUrl: `https://arweave.net/${transactionId}`,
			fileName: transactionId,
			extension: undefined,
			contentType: 'text/plain',
			contentLength: 4,
			displayType: 'text',
			isContentTypeInferred: false,
			text: 'demo',
		})
		await expect(resourceTimestampResolver.resolve.ResourceTimestampMsSource.resolve(
			{
				$resource: {
					transactionId,
					contentPath: '',
				},
				timestampMs: 1_700_000_000_000,
				source: Source.Arweave_Rest,
			},
			context
		)).resolves.toMatchObject({
			gatewayOrigin: 'https://arweave.net',
			gatewayUrl: `https://arweave.net/${transactionId}`,
			contentType: 'text/plain',
			contentLength: 4,
			text: 'demo',
			reachable: true,
		})
	})
})
