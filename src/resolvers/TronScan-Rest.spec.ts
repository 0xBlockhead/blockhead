import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
	Caip2Namespace,
	Caip2Reference,
	networkBySlug,
} from '$/constants/Network.ts'
import {
	entityFieldAddressKey,
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import bindings from '$/sources/TronScan/bindings.ts'
import type { TronScanTransactions } from '$/sources/TronScan/Rest/types.ts'

const getAccount = vi.fn()
const getAccountTokens = vi.fn()
const getAccountTransactions = vi.fn()
const getBlock = vi.fn()
const getContract = vi.fn()
const getTokenOverview = vi.fn()
const getTrc10Token = vi.fn()

vi.mock('$/sources/TronScan/Rest/queries.ts', () => ({
	getAccount,
	getAccountTokens,
	getAccountTransactions,
	getBlock,
	getContract,
	getTokenOverview,
	getTrc10Token,
}))

const { default: tronScanResolvers } = await import('$/resolvers/TronScan-Rest.ts')
const { default: tronGridResolvers } = await import('$/resolvers/TronGrid-Rest.ts')

const accountTransactionsResolver = tronScanResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.TronAccount
	&& '$$transactions' in resolver.projections
))

if (accountTransactionsResolver == null)
	throw new Error('TronScan-Rest spec missing TronAccount.$$transactions resolver')

const binding = bindings[Source.TronScan_Rest][0]

const resolverContext = {
	filters: [],
	sorts: [],
	pagination: {
		limit: 2,
	},
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [],
	publicEnv: {},
	providerContinuationToken: '4',
}
const tronMainnetCaip2 = {
	namespace: Caip2Namespace.Tron,
	reference: Caip2Reference.TronMainnet,
} as const
const network = {
	caip2: tronMainnetCaip2,
}
const account = {
	$network: network,
	address: 'Taccount',
}

describe('TronScan account transaction resolver', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('declares architecture-neutral selector applicability', () => {
		for (const resolver of [
			...tronGridResolvers.resolvers,
			...tronScanResolvers.resolvers,
		])
			for (const selectorEntry of Object.values(resolver.resolve))
				expect(selectorEntry.appliesTo.length).toBeGreaterThan(0)

		expect(accountTransactionsResolver.resolve[
			'NetworkAddress'
		].appliesTo).toEqual([
			{
				$network: {
					caip2: tronMainnetCaip2,
				},
			},
			{
				$network: {
					slug: networkBySlug.tron.slug,
				},
			},
		])
	})

	it('rejects a block returned by height when its hash disagrees with the exact selector', async () => {
		getBlock.mockResolvedValueOnce({
			data: [{
				hash: 'returned-block-hash',
				number: 123,
				timestamp: 1_720_000_000_000,
			}],
		})

		const resolver = tronScanResolvers.resolvers.find((candidate) => (
			candidate.entityType === EntityType.TronBlock
		))
		if (resolver == null) throw new Error('Tron block resolver is missing')

		await expect(
			resolver.resolve.NetworkHeightHash.resolve({
				$network: network,
				height: 123n,
				hash: 'requested-block-hash',
			}, resolverContext)
		).rejects.toThrow('block hash returned-block-hash does not match selector requested-block-hash')

		getBlock.mockResolvedValueOnce({
			data: [{
				hash: 'requested-block-hash',
				number: 124,
				timestamp: 1_720_000_000_000,
			}],
		})
		await expect(
			resolver.resolve.NetworkHeightHash.resolve({
				$network: network,
				height: 123n,
				hash: 'requested-block-hash',
			}, resolverContext)
		).rejects.toThrow('block height does not match selector 123')
	})

	it('materializes transaction membership Fields and pagination', async () => {
		getAccountTransactions.mockResolvedValueOnce({
			total: 10,
			data: [
				{
					hash: 'outgoing-transaction',
					block: 77,
					timestamp: 1_720_000_000_000,
					ownerAddress: account.address,
					toAddress: 'Trecipient',
					contractType: 1,
					contractRet: 'SUCCESS',
					amount: '42',
					cost: {
						fee: 3,
					},
				},
				{
					hash: 'incoming-transaction',
					blockNumber: 78,
					timestamp: 1_720_000_003_000,
					contractData: {
						owner_address: 'Tsender',
						to_address: account.address,
						amount: '7',
						asset_name: 'asset',
					},
					contractType: 'TransferAssetContract',
					result: 'REVERT',
				},
			],
		} satisfies TronScanTransactions)

		const page = await accountTransactionsResolver.resolve[
			'NetworkAddress'
		].resolve(account, resolverContext)
		const projection = accountTransactionsResolver.projections.$$transactions
		if (
			typeof projection === 'function'
			|| projection.select == null
			|| projection.continuation == null
		)
			throw new Error('TronScan-Rest spec missing account transaction pagination')

		const transactions = projection.select(page, account, resolverContext)
		expect(tronScanResolvers.source).toBe(Source.TronScan_Rest)
		expect(getAccountTransactions).toHaveBeenCalledWith(
			account.address,
			2,
			4
		)
		expect(transactions.map((transaction) => transaction[EntityMetaKey.Selector])).toEqual([
			{
				$network: network,
				transactionId: 'outgoing-transaction',
			},
			{
				$network: network,
				transactionId: 'incoming-transaction',
			},
		])
		expect(transactions.every((transaction) => (
			Object.hasOwn(transaction, EntityMetaKey.Fields)
		))).toBe(true)
		expect(projection.resolveCount(page, account, resolverContext)).toBe(10)
		expect(projection.continuation(page, account, resolverContext)).toEqual({
			operation: 'account-transactions',
			target: account.address,
			terminal: false,
			token: '6',
		})
	})

	it('accepts the canonical slug selector and rejects other CAIP-2 identities before transport', async () => {
		getAccountTransactions.mockResolvedValueOnce({
			total: 0,
			data: [],
		} satisfies TronScanTransactions)

		await accountTransactionsResolver.resolve[
			'NetworkAddress'
		].resolve({
			$network: {
				slug: networkBySlug.tron.slug,
			},
			address: account.address,
		}, resolverContext)
		expect(getAccountTransactions).toHaveBeenCalledTimes(1)

		vi.clearAllMocks()
		for (const $network of [
			{
				caip2: {
					namespace: 'wrong-namespace',
					reference: tronMainnetCaip2.reference,
				},
			},
			{
				caip2: {
					namespace: tronMainnetCaip2.namespace,
					reference: 'wrong-mainnet',
				},
			},
			{
				slug: 'wrong-tron',
			},
		])
			await expect(accountTransactionsResolver.resolve[
				'NetworkAddress'
			].resolve({
				$network,
				address: account.address,
			}, resolverContext)).rejects.toThrow('TronScan_Rest: unsupported network')
		expect(getAccountTransactions).not.toHaveBeenCalled()
	})
})

describe('TronScan native current observations', () => {
	beforeEach(() => {
		vi.clearAllMocks()
		vi.spyOn(Date, 'now').mockReturnValue(1_700_000_000_000)
	})

	it('embeds contract verification state on the source read', async () => {
		getContract.mockResolvedValue({
			data: [{
				name: 'Proxy',
				compiler: 'solc',
				verifyStatus: 'verified',
				is_proxy: true,
				proxy_implementation: 'Timplementation',
			}],
		})
		const resolver = tronScanResolvers.resolvers.find((candidate) => (
			candidate.entityType === EntityType.TronContract
		))
		if (resolver == null)
			throw new Error('TronScan-Rest spec missing contract resolver')

		const contract = await resolver.resolve.NetworkAddress.resolve({
			$network: network,
			address: 'Tcontract',
		}, resolverContext)
		expect(resolver.projections.$$timestamps(contract)).toEqual([{
			[EntityMetaKey.Selector]: {
				$contract: {
					$network: network,
					address: 'Tcontract',
				},
				timestampMs: 1_700_000_000_000,
				source: Source.TronScan_Rest,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.TronContract_Timestamp, [], 'compiler')]: 'solc',
				[entityFieldAddressKey(EntityType.TronContract_Timestamp, [], 'verifyStatus')]: 'verified',
				[entityFieldAddressKey(EntityType.TronContract_Timestamp, [], 'isProxy')]: true,
				[entityFieldAddressKey(EntityType.TronContract_Timestamp, [], '$implementation')]: {
					[EntityMetaKey.Selector]: {
						$network: network,
						address: 'Timplementation',
					},
				},
			},
		}])
	})

	it('embeds token supply state and removes arbitrary observation replay', async () => {
		getTokenOverview.mockResolvedValue({
			tokens: [{
				contractAddress: 'Ttoken',
				name: 'Token',
				symbol: 'TOK',
				decimals: 6,
				totalSupply: '1000000',
				holderCount: 7,
			}],
		})
		const resolver = tronScanResolvers.resolvers.find((candidate) => (
			candidate.entityType === EntityType.TronToken
		))
		if (resolver == null)
			throw new Error('TronScan-Rest spec missing token resolver')

		const token = await resolver.resolve.NetworkTokenId.resolve({
			$network: network,
			tokenId: 'Ttoken',
		}, resolverContext)
		expect(resolver.projections.$$timestamps(token)[0]?.[EntityMetaKey.Fields]).toEqual({
			[entityFieldAddressKey(EntityType.TronToken_Timestamp, [], 'name')]: 'Token',
			[entityFieldAddressKey(EntityType.TronToken_Timestamp, [], 'symbol')]: 'TOK',
			[entityFieldAddressKey(EntityType.TronToken_Timestamp, [], 'decimals')]: 6,
			[entityFieldAddressKey(EntityType.TronToken_Timestamp, [], 'totalSupply')]: 1000000n,
			[entityFieldAddressKey(EntityType.TronToken_Timestamp, [], 'holderCount')]: 7,
		})
	})

	it('embeds TronAccount current state on $$timestamps after the account read', async () => {
		getAccount.mockResolvedValueOnce({
			name: 'Alice',
			balanceStr: '1000',
			date_created: 1_600_000_000_000,
			latest_operation_time: 1_650_000_000_000,
			totalTransactionCount: 12,
			bandwidth: {
				netRemaining: 500,
			},
			accountResource: {
				energyRemaining: 7,
			},
			contractMap: {
				[account.address]: false,
			},
		})
		const resolver = tronScanResolvers.resolvers.find((candidate) => (
			candidate.entityType === EntityType.TronAccount
			&& '$$timestamps' in candidate.projections
		))
		if (resolver == null)
			throw new Error('TronScan-Rest spec missing TronAccount.$$timestamps resolver')

		const snapshot = await resolver.resolve.NetworkAddress.resolve(account, resolverContext)
		expect(getAccount).toHaveBeenCalledWith(account.address)
		expect(resolver.projections.name(snapshot)).toBe('Alice')
		expect(resolver.projections.$$timestamps(snapshot)).toEqual([{
			[EntityMetaKey.Selector]: {
				$account: {
					$network: network,
					address: account.address,
				},
				timestampMs: 1_700_000_000_000,
				source: Source.TronScan_Rest,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.TronAccount_Timestamp, [], 'balanceSun')]: 1000n,
				[entityFieldAddressKey(EntityType.TronAccount_Timestamp, [], 'createdTimestampMs')]: 1_600_000_000_000,
				[entityFieldAddressKey(EntityType.TronAccount_Timestamp, [], 'latestOperationTimestampMs')]: 1_650_000_000_000,
				[entityFieldAddressKey(EntityType.TronAccount_Timestamp, [], 'totalTransactionCount')]: 12,
				[entityFieldAddressKey(EntityType.TronAccount_Timestamp, [], 'netLimit')]: 500n,
				[entityFieldAddressKey(EntityType.TronAccount_Timestamp, [], 'energyLimit')]: 7n,
				[entityFieldAddressKey(EntityType.TronAccount_Timestamp, [], 'isContract')]: false,
			},
		}])
	})

	it('embeds TronAccount.$$tokenBalanceTimestamps after the token-list read', async () => {
		getAccountTokens.mockResolvedValueOnce({
			data: [{
				contractAddress: 'Ttoken',
				name: 'Token',
				symbol: 'TOK',
				tokenType: 'trc20',
				balance: '42',
			}],
		})
		const resolver = tronScanResolvers.resolvers.find((candidate) => (
			candidate.entityType === EntityType.TronAccount
			&& '$$tokenBalanceTimestamps' in candidate.projections
		))
		if (resolver == null)
			throw new Error('TronScan-Rest spec missing TronAccount.$$tokenBalanceTimestamps resolver')

		const timestamps = await resolver.resolve.NetworkAddress.resolve(account, resolverContext)
		expect(getAccountTokens).toHaveBeenCalledWith(account.address, 2)
		expect(resolver.projections.$$tokenBalanceTimestamps(timestamps)).toEqual([{
			[EntityMetaKey.Selector]: {
				$account: {
					$network: network,
					address: account.address,
				},
				$token: {
					$network: network,
					tokenId: 'Ttoken',
				},
				timestampMs: 1_700_000_000_000,
				source: Source.TronScan_Rest,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.TronAccountTokenBalance_Timestamp, [], '$token')]: {
					[EntityMetaKey.Selector]: {
						$network: network,
						tokenId: 'Ttoken',
					},
				},
				[entityFieldAddressKey(EntityType.TronAccountTokenBalance_Timestamp, [], 'standard')]: 'trc20',
				[entityFieldAddressKey(EntityType.TronAccountTokenBalance_Timestamp, [], 'balance')]: 42n,
				[entityFieldAddressKey(EntityType.TronAccountTokenBalance_Timestamp, [], 'tokenId')]: 'Ttoken',
				[entityFieldAddressKey(EntityType.TronAccountTokenBalance_Timestamp, [], 'tokenName')]: 'Token',
				[entityFieldAddressKey(EntityType.TronAccountTokenBalance_Timestamp, [], 'tokenSymbol')]: 'TOK',
			},
		}])
	})

	it('does not register direct TronAccount or token-balance timestamp resolvers', () => {
		const entityTypes = tronScanResolvers.resolvers.map((resolver) => (
			`${resolver.entityType}`
		))
		expect(entityTypes).not.toContain(`${EntityType.TronAccount_Timestamp}`)
		expect(entityTypes).not.toContain(`${EntityType.TronAccountTokenBalance_Timestamp}`)
		expect(entityTypes).not.toContain(`${EntityType.TronContract_Timestamp}`)
		expect(entityTypes).not.toContain(`${EntityType.TronToken_Timestamp}`)
	})
})
