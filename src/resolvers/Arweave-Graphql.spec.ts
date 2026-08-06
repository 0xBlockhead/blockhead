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

vi.mock('$/sources/Arweave/Graphql/queries.ts', () => ({
	getTransactionById,
	getTransactionsPage,
}))

const arweaveResolvers = (await import('$/resolvers/Arweave-Graphql.ts')).default

const networkResolver = arweaveResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.ArweaveNetwork
))
const transactionResolver = arweaveResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.ArweaveTransaction
))

if (networkResolver == null || transactionResolver == null)
	throw new Error('Arweave-Graphql spec missing resolvers')

const transactionId = 'A'.repeat(43)
const ownerAddress = 'B'.repeat(43)
const recipientAddress = 'C'.repeat(43)
const blockId = 'D'.repeat(64)
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

describe('Arweave_Graphql thin Network / Transaction resolvers', () => {
	beforeEach(() => {
		getTransactionById.mockReset()
		getTransactionsPage.mockReset()
	})

	it('registers against Arweave_Graphql only', () => {
		expect(arweaveResolvers.source).toBe(Source.Arweave_Graphql)
	})

	it('materializes the Arweave network hub for the content-address scheme slug', async () => {
		getTransactionsPage.mockResolvedValueOnce({
			edges: [],
			pageInfo: {
				hasNextPage: false,
			},
		})
		await expect(networkResolver.resolve.Network.resolve(
			{
				$network: network,
			},
			context
		)).resolves.toEqual({
			$network: {
				[EntityMetaKey.Selector]: network,
			},
			transactions: {
				edges: [],
				pageInfo: {
					hasNextPage: false,
				},
			},
		})

		await expect(networkResolver.resolve.Network.resolve(
			{
				$network: {
					slug: 'celestia',
				},
			},
			context
		)).rejects.toThrow('unsupported network')
	})

	it('maps the latest GraphQL page into the Arweave network transaction facet', async () => {
		getTransactionsPage.mockResolvedValueOnce({
			edges: [
				{
					cursor: 'cursor-1',
					node: {
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
						tags: [],
						block: null,
					},
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
					[entityFieldAddressKey(EntityType.ArweaveTransaction, [], 'dataSizeBytes')]: 12_345_678_901_234_567n,
					[entityFieldAddressKey(EntityType.ArweaveTransaction, [], 'tags')]: [],
				},
			},
		])
		expect(networkResolver.projections.$$transactions.continuation(
			snapshot,
			arweaveNetwork,
			context
		)).toEqual({
			operation: 'transactions',
			target: 'arweave',
			terminal: false,
			token: 'cursor-1',
		})
		expect(getTransactionsPage).toHaveBeenCalledWith({
			first: 64,
		})
	})

	it('maps GraphQL transaction wire into ArweaveTransaction fields and nested block', async () => {
		getTransactionById.mockResolvedValueOnce({
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
				previous: 'F'.repeat(64),
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
					[entityFieldAddressKey(EntityType.ArweaveBlock, [], 'previousBlock')]: 'F'.repeat(64),
					[entityFieldAddressKey(EntityType.ArweaveBlock, [], 'timestampMs')]: 1_720_000_000_000,
				},
			},
		})
		expect(getTransactionById).toHaveBeenCalledWith(transactionId)
	})
})
