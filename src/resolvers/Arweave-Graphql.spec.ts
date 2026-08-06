import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import {
	entityFieldAddressKey,
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

const getTransactionById = vi.hoisted(() => vi.fn())
const getTransactionsPage = vi.hoisted(() => vi.fn())
const getBlocksPage = vi.hoisted(() => vi.fn())
const getBlockById = vi.hoisted(() => vi.fn())
const getBlockByHeight = vi.hoisted(() => vi.fn())
const getBlockTransactionsPage = vi.hoisted(() => vi.fn())

vi.mock('$/sources/Arweave/Graphql/queries.ts', () => ({
	getTransactionById,
	getTransactionsPage,
	getBlocksPage,
	getBlockById,
	getBlockByHeight,
	getBlockTransactionsPage,
}))

const arweaveResolvers = (await import('$/resolvers/Arweave-Graphql.ts')).default

const networkResolver = arweaveResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.ArweaveNetwork
))
const directoryNetworkResolver = arweaveResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.Network
))
const transactionResolver = arweaveResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.ArweaveTransaction
))
const blockResolver = arweaveResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.ArweaveBlock
))
const resourceResolver = arweaveResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.ArweaveResource
))
const networkTimestampResolver = arweaveResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.ArweaveNetwork_Timestamp
))

if (
	networkResolver == null
	|| directoryNetworkResolver == null
	|| transactionResolver == null
	|| blockResolver == null
	|| resourceResolver == null
	|| networkTimestampResolver == null
)
	throw new Error('Arweave-Graphql spec missing resolvers')

const transactionId = 'A'.repeat(43)
const ownerAddress = 'B'.repeat(43)
const recipientAddress = 'C'.repeat(43)
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

const transactionWire = {
	id: transactionId,
	anchor: 'E'.repeat(43),
	signature: 'signature',
	recipient: recipientAddress,
	owner: {
		address: ownerAddress,
		key: 'owner-key',
	},
	fee: {
		winston: '9007199254740993',
	},
	quantity: {
		winston: '1000000000000',
	},
	data: {
		size: '12345678901234567',
		type: 'text/plain',
	},
	tags: [] as {
		name: string
		value: string
	}[],
	block: null as null | {
		id: string
		timestamp: number
		height: number
		previous: string
	},
}

const blockWire = {
	id: blockId,
	timestamp: 1_720_000_000,
	height: 1_500_000,
	previous: previousBlockId,
}

const emptyPage = {
	edges: [],
	pageInfo: {
		hasNextPage: false,
	},
}

describe('Arweave_Graphql blocks / resources / network hub', () => {
	beforeEach(() => {
		getTransactionById.mockReset()
		getTransactionsPage.mockReset()
		getBlocksPage.mockReset()
		getBlockById.mockReset()
		getBlockByHeight.mockReset()
		getBlockTransactionsPage.mockReset()
	})

	it('registers against Arweave_Graphql only', () => {
		expect(arweaveResolvers.source).toBe(Source.Arweave_Graphql)
	})

	it('materializes the Arweave network hub for the content-address scheme slug', async () => {
		getTransactionsPage.mockResolvedValueOnce(emptyPage)
		getBlocksPage.mockResolvedValueOnce(emptyPage)
		const snapshot = await networkResolver.resolve.Network.resolve(
			{
				$network: network,
			},
			context
		)
		expect(snapshot).toMatchObject({
			$network: {
				[EntityMetaKey.Selector]: network,
			},
			transactions: emptyPage,
			blocks: emptyPage,
		})
		expect(snapshot.timestamps).toHaveLength(1)

		await expect(networkResolver.resolve.Network.resolve(
			{
				$network: {
					slug: 'celestia',
				},
			},
			context
		)).rejects.toThrow('unsupported network')
	})

	it('maps GraphQL transaction and block pages into network facets', async () => {
		getTransactionsPage.mockResolvedValueOnce({
			edges: [
				{
					cursor: 'cursor-1',
					node: {
						...transactionWire,
						data: {
							size: '12',
							type: 'text/plain',
						},
					},
				},
			],
			pageInfo: {
				hasNextPage: true,
			},
		})
		getBlocksPage.mockResolvedValueOnce({
			edges: [
				{
					cursor: 'block-cursor-1',
					node: blockWire,
				},
			],
			pageInfo: {
				hasNextPage: true,
			},
		})
		const snapshot = await networkResolver.resolve.Network.resolve(
			{
				$network: network,
			},
			context
		)

		expect(networkResolver.projections.$$transactions.select(
			snapshot,
			arweaveNetwork,
			context
		)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$network: arweaveNetwork,
					transactionId,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.ArweaveTransaction, [], 'ownerAddress')]: ownerAddress,
					[entityFieldAddressKey(EntityType.ArweaveTransaction, [], 'targetAddress')]: recipientAddress,
					[entityFieldAddressKey(EntityType.ArweaveTransaction, [], 'quantityWinston')]: 1_000_000_000_000n,
					[entityFieldAddressKey(EntityType.ArweaveTransaction, [], 'rewardWinston')]: 9_007_199_254_740_993n,
					[entityFieldAddressKey(EntityType.ArweaveTransaction, [], 'signature')]: 'signature',
					[entityFieldAddressKey(EntityType.ArweaveTransaction, [], 'lastTx')]: 'E'.repeat(43),
					[entityFieldAddressKey(EntityType.ArweaveTransaction, [], 'dataSizeBytes')]: 12n,
					[entityFieldAddressKey(EntityType.ArweaveTransaction, [], 'tags')]: [],
					[entityFieldAddressKey(EntityType.ArweaveTransaction, [], '$resource')]: {
						[EntityMetaKey.Selector]: {
							transactionId,
							contentPath: '',
						},
						[EntityMetaKey.Fields]: {
							[entityFieldAddressKey(EntityType.ArweaveResource, [], 'canonicalUri')]: `ar://${transactionId}`,
						},
					},
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
					height: 1_500_000n,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.ArweaveBlock, [], 'indepHash')]: blockId,
					[entityFieldAddressKey(EntityType.ArweaveBlock, [], 'previousBlock')]: previousBlockId,
					[entityFieldAddressKey(EntityType.ArweaveBlock, [], 'timestampMs')]: 1_720_000_000_000,
				},
			},
		])
		expect(networkResolver.projections.$$resources.select(
			snapshot,
			arweaveNetwork,
			context
		)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					transactionId,
					contentPath: '',
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.ArweaveResource, [], 'canonicalUri')]: `ar://${transactionId}`,
					[entityFieldAddressKey(EntityType.ArweaveResource, [], '$transaction')]: {
						[EntityMetaKey.Selector]: {
							$network: arweaveNetwork,
							transactionId,
						},
					},
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
			token: 'block-cursor-1',
		})
	})

	it('projects Directory Network.Arweave block and resource facets', async () => {
		getTransactionsPage.mockResolvedValueOnce(emptyPage)
		getBlocksPage.mockResolvedValueOnce({
			edges: [
				{
					cursor: 'block-cursor-1',
					node: blockWire,
				},
			],
			pageInfo: {
				hasNextPage: false,
			},
		})
		const snapshot = await directoryNetworkResolver.resolve.Slug.resolve(network, context)
		expect(directoryNetworkResolver.projections.Arweave.$$blocks.select(
			snapshot,
			network,
			context
		)).toHaveLength(1)
		expect(directoryNetworkResolver.projections.Arweave.$$resources.select(
			snapshot,
			network,
			context
		)).toEqual([])
	})

	it('resolves ArweaveBlock by height with in-block transactions', async () => {
		getBlockByHeight.mockResolvedValueOnce(blockWire)
		getBlockTransactionsPage.mockResolvedValueOnce({
			edges: [
				{
					cursor: 'tx-1',
					node: transactionWire,
				},
			],
			pageInfo: {
				hasNextPage: false,
			},
		})
		const snapshot = await blockResolver.resolve.NetworkHeight.resolve(
			{
				$network: arweaveNetwork,
				height: 1_500_000n,
			},
			context
		)
		expect(snapshot).toMatchObject({
			height: 1_500_000n,
			indepHash: blockId,
			previousBlock: previousBlockId,
			timestampMs: 1_720_000_000_000,
		})
		expect(blockResolver.projections.$$transactions.select(
			snapshot,
			{
				$network: arweaveNetwork,
				height: 1_500_000n,
			},
			context
		)).toHaveLength(1)
		expect(getBlockByHeight).toHaveBeenCalledWith(1_500_000)
	})

	it('resolves ArweaveResource identity from a data-bearing transaction', async () => {
		getTransactionById.mockResolvedValueOnce({
			...transactionWire,
			data: {
				size: '12',
				type: 'text/plain',
			},
		})
		await expect(resourceResolver.resolve.TransactionIdContentPath.resolve(
			{
				transactionId,
				contentPath: '',
			},
			context
		)).resolves.toMatchObject({
			transactionId,
			contentPath: '',
			canonicalUri: `ar://${transactionId}`,
			$transaction: {
				[EntityMetaKey.Selector]: {
					$network: arweaveNetwork,
					transactionId,
				},
			},
		})
	})

	it('maps GraphQL transaction wire into ArweaveTransaction fields, nested block, and resource', async () => {
		getTransactionById.mockResolvedValueOnce({
			...transactionWire,
			tags: [
				{
					name: 'Content-Type',
					value: 'text/plain',
				},
			],
			block: {
				id: blockId,
				timestamp: 1_720_000_000,
				height: 1_500_000,
				previous: previousBlockId,
			},
		})

		await expect(transactionResolver.resolve.NetworkTransactionId.resolve(
			{
				$network: arweaveNetwork,
				transactionId,
			},
			context
		)).resolves.toEqual({
			ownerAddress,
			targetAddress: recipientAddress,
			quantityWinston: 1_000_000_000_000n,
			rewardWinston: 9_007_199_254_740_993n,
			signature: 'signature',
			lastTx: 'E'.repeat(43),
			dataSizeBytes: 12_345_678_901_234_567n,
			tags: [
				{
					name: 'Content-Type',
					value: 'text/plain',
				},
			],
			$block: {
				[EntityMetaKey.Selector]: {
					$network: arweaveNetwork,
					height: 1_500_000n,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.ArweaveBlock, [], 'indepHash')]: blockId,
					[entityFieldAddressKey(EntityType.ArweaveBlock, [], 'previousBlock')]: previousBlockId,
					[entityFieldAddressKey(EntityType.ArweaveBlock, [], 'timestampMs')]: 1_720_000_000_000,
				},
			},
			$resource: {
				[EntityMetaKey.Selector]: {
					transactionId,
					contentPath: '',
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.ArweaveResource, [], 'canonicalUri')]: `ar://${transactionId}`,
				},
			},
		})
		expect(getTransactionById).toHaveBeenCalledWith(transactionId)
	})

	it('maps the latest GraphQL block into ArweaveNetwork_Timestamp', async () => {
		getBlocksPage.mockResolvedValueOnce({
			edges: [
				{
					cursor: 'latest-block',
					node: blockWire,
				},
			],
			pageInfo: {
				hasNextPage: false,
			},
		})
		await expect(networkTimestampResolver.resolve.NetworkTimestampMsSource.resolve(
			{
				$network: arweaveNetwork,
				timestampMs: 1_700_000_000_000,
				source: Source.Arweave_Graphql,
			},
			context
		)).resolves.toMatchObject({
			latestHeight: 1_500_000n,
			latestBlockHash: blockId,
			currentBlockHash: blockId,
			graphqlCursor: 'latest-block',
			reachable: true,
		})
	})
})
