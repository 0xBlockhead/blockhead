import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import { EntityMetaKey, entityFieldAddressKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

const getNetworkInfo = vi.hoisted(() => vi.fn())
const getGatewayOrigin = vi.hoisted(() => vi.fn(() => 'https://arweave.net'))
const getBlockByHeight = vi.hoisted(() => vi.fn())
const getBlockByHash = vi.hoisted(() => vi.fn())
const getTransaction = vi.hoisted(() => vi.fn())
const getTransactionStatus = vi.hoisted(() => vi.fn())
const ownerAddressFromOwnerKey = vi.hoisted(() => vi.fn())
const decodeArweaveTagField = vi.hoisted(() => vi.fn((value: string) => (
	value === 'QXBwLU5hbWU' ?
		'App-Name'
	: value === 'TXkgQXBw' ?
		'My App'
	:
		value
)))
const fetchBrowseResult = vi.hoisted(() => vi.fn())
const parseArweaveManifest = vi.hoisted(() => vi.fn())

vi.mock('$/sources/Arweave/Rest/queries.ts', () => ({
	getNetworkInfo,
	getGatewayOrigin,
	getBlockByHeight,
	getBlockByHash,
	getTransaction,
	getTransactionStatus,
	ownerAddressFromOwnerKey,
	decodeArweaveTagField,
	fetchBrowseResult,
	parseArweaveManifest,
}))

const { default: arweaveRest } = await import('$/resolvers/Arweave-Rest.ts')

const networkResolver = arweaveRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.ArweaveNetwork
))
const directoryNetworkResolver = arweaveRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.Network
))
const blockResolver = arweaveRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.ArweaveBlock
))
const transactionResolver = arweaveRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.ArweaveTransaction
))
const resourceResolver = arweaveRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.ArweaveResource
))

if (
	networkResolver == null
	|| directoryNetworkResolver == null
	|| blockResolver == null
	|| transactionResolver == null
	|| resourceResolver == null
)
	throw new Error('Arweave-Rest spec missing resolvers')

const transactionId = 'A'.repeat(43)
const ownerAddress = 'C'.repeat(43)
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
	pagination: {
		limit: 2,
	},
	selectorKeys: [],
	parentSelectorKeys: [],
	publicEnv: {},
}

const tipBlockWire = {
	indep_hash: blockId,
	previous_block: previousBlockId,
	timestamp: 1_720_000_000,
	height: 551_511,
	txs: [
		transactionId,
	],
}

describe('Arweave_Rest block / info / resource browse resolvers', () => {
	beforeEach(() => {
		getNetworkInfo.mockReset()
		getBlockByHeight.mockReset()
		getBlockByHash.mockReset()
		getTransaction.mockReset()
		getTransactionStatus.mockReset()
		ownerAddressFromOwnerKey.mockReset()
		decodeArweaveTagField.mockClear()
		fetchBrowseResult.mockReset()
		fetchBrowseResult.mockResolvedValue({
			contentType: undefined,
			text: undefined,
		})
		parseArweaveManifest.mockReset()
	})

	it('registers against Arweave_Rest only', () => {
		expect(arweaveRest.source).toBe(Source.Arweave_Rest)
	})

	it('maps GET /tx and status into ArweaveTransaction fields with decoded tags', async () => {
		getTransaction.mockResolvedValueOnce({
			format: 2,
			id: transactionId,
			last_tx: 'E'.repeat(43),
			owner: 'owner-key-bytes',
			tags: [
				{
					name: 'QXBwLU5hbWU',
					value: 'TXkgQXBw',
				},
			],
			target: 'B'.repeat(43),
			quantity: '1000000000000',
			data: '',
			data_size: '12',
			data_root: 'data-root',
			reward: '9007199254740993',
			signature: 'signature',
		})
		ownerAddressFromOwnerKey.mockResolvedValueOnce(ownerAddress)
		getTransactionStatus.mockResolvedValueOnce({
			block_height: 422_250,
			block_indep_hash: blockId,
			number_of_confirmations: 3,
		})

		const snapshot = await transactionResolver.resolve.NetworkTransactionId.resolve(
			{
				$network: arweaveNetwork,
				transactionId,
			},
			context
		)
		expect(snapshot).toMatchObject({
			transactionId,
			ownerAddress,
			targetAddress: 'B'.repeat(43),
			quantityWinston: 1_000_000_000_000n,
			rewardWinston: 9_007_199_254_740_993n,
			signature: 'signature',
			lastTx: 'E'.repeat(43),
			dataRoot: 'data-root',
			dataSizeBytes: 12n,
			format: 2,
			tags: [
				{
					name: 'App-Name',
					value: 'My App',
				},
			],
		})
		expect(transactionResolver.projections.$block(snapshot)).toEqual({
			[EntityMetaKey.Selector]: {
				$network: arweaveNetwork,
				height: 422_250n,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.ArweaveBlock, [], 'indepHash')]: blockId,
			},
		})
		expect(transactionResolver.projections.$resource(snapshot)).toEqual({
			[EntityMetaKey.Selector]: {
				transactionId,
				contentPath: '',
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.ArweaveResource, [], 'canonicalUri')]: `ar://${transactionId}`,
			},
		})
	})

	it('omits $block when gateway status is Pending', async () => {
		getTransaction.mockResolvedValueOnce({
			format: 2,
			id: transactionId,
			last_tx: '',
			owner: 'owner-key-bytes',
			tags: [],
			target: '',
			quantity: '0',
			data: '',
			data_size: '0',
			data_root: '',
			reward: '1',
			signature: 'signature',
		})
		ownerAddressFromOwnerKey.mockResolvedValueOnce(ownerAddress)
		getTransactionStatus.mockResolvedValueOnce(undefined)

		const snapshot = await transactionResolver.resolve.NetworkTransactionId.resolve(
			{
				$network: arweaveNetwork,
				transactionId,
			},
			context
		)
		expect(transactionResolver.projections.$block(snapshot)).toBeUndefined()
		expect(transactionResolver.projections.$resource(snapshot)).toBeUndefined()
	})

	it('projects Network.Arweave tip timestamps and height-walked blocks', async () => {
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
		getBlockByHeight
			.mockResolvedValueOnce(tipBlockWire)
			.mockResolvedValueOnce({
				...tipBlockWire,
				height: 551_510,
				indep_hash: 'E'.repeat(64),
				previous_block: 'G'.repeat(64),
				txs: [],
			})

		const snapshot = await networkResolver.resolve.Network.resolve(
			{
				$network: network,
			},
			context
		)
		expect(networkResolver.projections.$$timestamps(snapshot)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$network: arweaveNetwork,
					timestampMs: expect.any(Number),
					source: Source.Arweave_Rest,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.ArweaveNetwork_Timestamp, [], 'latestHeight')]: 551_511n,
					[entityFieldAddressKey(EntityType.ArweaveNetwork_Timestamp, [], 'latestBlockHash')]: blockId,
					[entityFieldAddressKey(EntityType.ArweaveNetwork_Timestamp, [], 'currentBlockHash')]: blockId,
					[entityFieldAddressKey(EntityType.ArweaveNetwork_Timestamp, [], 'networkId')]: 'arweave.N.1',
					[entityFieldAddressKey(EntityType.ArweaveNetwork_Timestamp, [], 'peerCount')]: 64,
					[entityFieldAddressKey(EntityType.ArweaveNetwork_Timestamp, [], 'queuedTransactionCount')]: 0,
					[entityFieldAddressKey(EntityType.ArweaveNetwork_Timestamp, [], 'gatewayOrigin')]: 'https://arweave.net',
					[entityFieldAddressKey(EntityType.ArweaveNetwork_Timestamp, [], 'reachable')]: true,
				},
			},
		])
		expect(networkResolver.projections.$$blocks.select(
			snapshot,
			arweaveNetwork,
			context
		)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$network: arweaveNetwork,
					height: 551_511n,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.ArweaveBlock, [], 'indepHash')]: blockId,
					[entityFieldAddressKey(EntityType.ArweaveBlock, [], 'previousBlock')]: previousBlockId,
					[entityFieldAddressKey(EntityType.ArweaveBlock, [], 'timestampMs')]: 1_720_000_000_000,
					[entityFieldAddressKey(EntityType.ArweaveBlock, [], 'transactionCount')]: 1,
				},
			},
			{
				[EntityMetaKey.Selector]: {
					$network: arweaveNetwork,
					height: 551_510n,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.ArweaveBlock, [], 'indepHash')]: 'E'.repeat(64),
					[entityFieldAddressKey(EntityType.ArweaveBlock, [], 'previousBlock')]: 'G'.repeat(64),
					[entityFieldAddressKey(EntityType.ArweaveBlock, [], 'timestampMs')]: 1_720_000_000_000,
					[entityFieldAddressKey(EntityType.ArweaveBlock, [], 'transactionCount')]: 0,
				},
			},
		])
		expect(networkResolver.projections.$$blocks.resolveCount(
			snapshot,
			arweaveNetwork,
			context
		)).toBe(551_512)
		expect(networkResolver.projections.$$blocks.continuation(
			snapshot,
			arweaveNetwork,
			context
		)).toEqual({
			operation: 'blocks',
			target: 'arweave',
			terminal: false,
			token: '551509',
		})
		expect(getBlockByHeight).toHaveBeenNthCalledWith(
			1,
			551_511
		)
		expect(getBlockByHeight).toHaveBeenNthCalledWith(
			2,
			551_510
		)
		expect(networkResolver.projections).not.toHaveProperty('$$resources')
		expect(networkResolver.projections).not.toHaveProperty('$$transactions')
	})

	it('walks later Arweave_Rest block pages from the native height continuation token', async () => {
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
		getBlockByHeight.mockResolvedValueOnce({
			...tipBlockWire,
			height: 551_509,
			indep_hash: 'H'.repeat(64),
			previous_block: 'I'.repeat(64),
			txs: [],
		})

		const snapshot = await networkResolver.resolve.Network.resolve(
			{
				$network: network,
			},
			{
				...context,
				pagination: {
					limit: 1,
				},
				providerContinuationToken: '551509',
			}
		)

		expect(getBlockByHeight).toHaveBeenCalledWith(551_509)
		expect(networkResolver.projections.$$blocks.select(
			snapshot,
			arweaveNetwork,
			context
		)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$network: arweaveNetwork,
					height: 551_509n,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.ArweaveBlock, [], 'indepHash')]: 'H'.repeat(64),
					[entityFieldAddressKey(EntityType.ArweaveBlock, [], 'previousBlock')]: 'I'.repeat(64),
					[entityFieldAddressKey(EntityType.ArweaveBlock, [], 'timestampMs')]: 1_720_000_000_000,
					[entityFieldAddressKey(EntityType.ArweaveBlock, [], 'transactionCount')]: 0,
				},
			},
		])
		expect(networkResolver.projections.$$blocks.continuation(
			snapshot,
			arweaveNetwork,
			context
		)).toEqual({
			operation: 'blocks',
			target: 'arweave',
			terminal: false,
			token: '551508',
		})
	})

	it('returns an empty terminal page when the generic offset passes genesis', async () => {
		getNetworkInfo.mockResolvedValueOnce({
			network: 'arweave.N.1',
			version: 5,
			release: 43,
			height: 1,
			current: blockId,
			blocks: 2,
			peers: 1,
			queue_length: 0,
		})

		const snapshot = await networkResolver.resolve.Network.resolve(
			{
				$network: network,
			},
			{
				...context,
				pagination: {
					offset: 2,
				},
			}
		)

		expect(networkResolver.projections.$$blocks.select(
			snapshot,
			arweaveNetwork,
			context
		)).toEqual([])
		expect(networkResolver.projections.$$blocks.continuation(
			snapshot,
			arweaveNetwork,
			context
		)).toEqual({
			operation: 'blocks',
			target: 'arweave',
			terminal: true,
		})
		expect(getBlockByHeight).not.toHaveBeenCalled()
	})

	it('stamps Arweave network observations after the gateway info and block reads settle', async () => {
		let blocksRead = false
		vi.spyOn(Date, 'now').mockImplementation(() => {
			if (!blocksRead)
				throw new Error('Arweave_Rest observation clock sampled before block reads')

			return 1_700_000_000_000
		})
		getNetworkInfo.mockResolvedValueOnce({
			network: 'arweave.N.1',
			version: 5,
			release: 43,
			height: 10,
			current: blockId,
			blocks: 10,
			peers: 1,
			queue_length: 0,
		})
		getBlockByHeight.mockImplementation(async () => {
			await Promise.resolve()
			blocksRead = true
			return {
				...tipBlockWire,
				height: 10,
			}
		})

		const snapshot = await networkResolver.resolve.Network.resolve(
			{
				$network: network,
			},
			{
				...context,
				pagination: {
					limit: 1,
				},
			}
		)
		expect(networkResolver.projections.$$timestamps(snapshot)[0]).toMatchObject({
			[EntityMetaKey.Selector]: {
				timestampMs: 1_700_000_000_000,
				source: Source.Arweave_Rest,
			},
		})
	})

	it('projects Directory Network.Arweave block and timestamp facets', async () => {
		getNetworkInfo.mockResolvedValueOnce({
			network: 'arweave.N.1',
			version: 5,
			release: 43,
			height: 10,
			current: blockId,
			blocks: 10,
			peers: 1,
			queue_length: 0,
		})
		getBlockByHeight.mockResolvedValueOnce({
			...tipBlockWire,
			height: 10,
		})
		const snapshot = await directoryNetworkResolver.resolve.Slug.resolve(
			network,
			{
				...context,
				pagination: {
					limit: 1,
				},
			}
		)
		expect(directoryNetworkResolver.projections.Arweave.$$blocks.select(
			snapshot,
			network,
			context
		)).toHaveLength(1)
		expect(directoryNetworkResolver.projections.Arweave.$$timestamps(snapshot)).toHaveLength(1)
		expect(directoryNetworkResolver.projections.Arweave.$$blocks.resolveCount(
			snapshot,
			network,
			context
		)).toBe(11)
	})

	it('does not expose an arbitrary current-state ArweaveNetwork_Timestamp facet', () => {
		expect(arweaveRest.resolvers.some((resolver) => (
			resolver.entityType === EntityType.ArweaveNetwork_Timestamp
		))).toBe(false)
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
		expect(blockResolver.projections.$$transactions.resolveCount(snapshot)).toBe(1)
		expect(blockResolver.projections.$$transactions.select(snapshot)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$network: arweaveNetwork,
					transactionId,
				},
			},
		])
		expect(getBlockByHeight).toHaveBeenCalledWith(422_250)
	})

	it('rejects block and transaction responses whose native identities differ from the request', async () => {
		getBlockByHeight.mockResolvedValueOnce({
			...tipBlockWire,
			height: 10,
		})
		await expect(blockResolver.resolve.NetworkHeight.resolve({
			$network: arweaveNetwork,
			height: 9n,
		}, context)).rejects.toThrow('block height does not match request')

		getBlockByHash.mockResolvedValueOnce({
			...tipBlockWire,
			indep_hash: 'G'.repeat(64),
		})
		await expect(blockResolver.resolve.NetworkIndepHash.resolve({
			$network: arweaveNetwork,
			indepHash: blockId,
		}, context)).rejects.toThrow('block hash does not match request')

		getTransaction.mockResolvedValueOnce({
			format: 2,
			id: 'B'.repeat(43),
			last_tx: '',
			owner: 'owner-key-bytes',
			tags: [],
			target: '',
			quantity: '0',
			data: '',
			data_size: '0',
			data_root: '',
			reward: '0',
			signature: 'signature',
		})
		await expect(transactionResolver.resolve.NetworkTransactionId.resolve({
			$network: arweaveNetwork,
			transactionId,
		}, context)).rejects.toThrow('transaction ID does not match request')
	})

	it('fail-closes foreign networks', async () => {
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
	})

	it('projects resource identity and embeds gateway observations from the same browse read', async () => {
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
					[EntityMetaKey.Fields]: {
						[entityFieldAddressKey(EntityType.ArweaveResource_Timestamp, [], 'gatewayOrigin')]: 'https://arweave.net',
						[entityFieldAddressKey(EntityType.ArweaveResource_Timestamp, [], 'gatewayUrl')]: `https://arweave.net/${transactionId}`,
						[entityFieldAddressKey(EntityType.ArweaveResource_Timestamp, [], 'contentType')]: 'text/plain',
						[entityFieldAddressKey(EntityType.ArweaveResource_Timestamp, [], 'contentLength')]: 4,
						[entityFieldAddressKey(EntityType.ArweaveResource_Timestamp, [], 'text')]: 'demo',
						[entityFieldAddressKey(EntityType.ArweaveResource_Timestamp, [], 'reachable')]: true,
					},
				},
			],
		})
		expect(fetchBrowseResult).toHaveBeenCalledTimes(1)
	})

	it('does not register a direct ArweaveResource_Timestamp resolver', () => {
		expect(arweaveRest.resolvers.some((resolver) => (
			resolver.entityType === EntityType.ArweaveResource_Timestamp
		))).toBe(false)
	})

	it('normalizes nested resource paths before emitting the source-owned observation selector', async () => {
		const resource = await resourceResolver.resolve.TransactionIdContentPath.resolve(
			{
				transactionId,
				contentPath: '/assets/selected.txt/',
			},
			context
		)
		expect(resource).toMatchObject({
			contentPath: 'assets/selected.txt',
			canonicalUri: `ar://${transactionId}/assets/selected.txt`,
			timestamps: [
				{
					[EntityMetaKey.Selector]: {
						$resource: {
							transactionId,
							contentPath: 'assets/selected.txt',
						},
					},
				},
			],
		})
		await expect(resourceResolver.resolve.TransactionIdContentPath.resolve(
			{
				transactionId,
				contentPath: 'assets/../outside.txt',
			},
			context
		)).rejects.toThrow('traversal segment')
	})
})
