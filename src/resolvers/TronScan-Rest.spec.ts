import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
	Caip2Namespace,
	Caip2Reference,
	networkBySlug,
} from '$/constants/Network.ts'
import { entityFieldAddressKey, EntityMetaKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { TronAccountSelector } from '$/schema/TronAccount.ts'
import { TronAccountTokenBalance_TimestampSelector } from '$/schema/TronAccountTokenBalance_Timestamp.ts'
import { Source } from '$/sources/Source.ts'
import { sourceProviderDefinitions } from '$/sources/$sourceProviders.ts'
import type { TronScanTransactions } from '$/sources/TronScan/Rest/types.ts'

const getAccountTransactions = vi.fn()

vi.mock('$/sources/TronScan/Rest/queries.ts', () => ({
	getAccountTransactions,
}))

const { default: tronScanResolvers } = await import('$/resolvers/TronScan-Rest.ts')
const { default: tronGridResolvers } = await import('$/resolvers/TronGrid-Rest.ts')

const accountTransactionsResolver = tronScanResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.TronAccount
	&& '$$transactions' in resolver.projections
))

if (accountTransactionsResolver == null)
	throw new Error('TronScan-Rest spec missing TronAccount.$$transactions resolver')

const binding = sourceProviderDefinitions
	.flatMap((provider) => provider.bindings)
	.find((candidate) => candidate.source === Source.TronScan_Rest)

if (binding == null)
	throw new Error('TronScan-Rest spec missing source binding')

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
			TronAccountSelector.NetworkAddress
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

		const accountTokenTimestampResolver = tronScanResolvers.resolvers.find((resolver) => (
			resolver.entityType === EntityType.TronAccountTokenBalance_Timestamp
		))
		if (accountTokenTimestampResolver == null)
			throw new Error('TronScan-Rest spec missing account token timestamp resolver')

		expect(accountTokenTimestampResolver.resolve[
			TronAccountTokenBalance_TimestampSelector.AccountTokenTimestampMsSource
		].appliesTo).toHaveLength(2)
	})

	it('materializes incoming and outgoing transaction identity, fields, pagination, and provenance', async () => {
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
			TronAccountSelector.NetworkAddress
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
			binding,
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
		expect(transactions[0][EntityMetaKey.Fields]).toMatchObject({
			[entityFieldAddressKey(EntityType.TronTransaction, [], 'blockHeight')]: 77n,
			[entityFieldAddressKey(EntityType.TronTransaction, [], 'timestampMs')]: 1_720_000_000_000,
			[entityFieldAddressKey(EntityType.TronTransaction, [], 'contractType')]: '1',
			[entityFieldAddressKey(EntityType.TronTransaction, [], 'result')]: 'SUCCESS',
			[entityFieldAddressKey(EntityType.TronTransaction, [], 'feeSun')]: 3n,
			[entityFieldAddressKey(EntityType.TronTransaction, [], 'amountSun')]: 42n,
		})
		expect(transactions[1][EntityMetaKey.Fields]).toMatchObject({
			[entityFieldAddressKey(EntityType.TronTransaction, [], 'blockHeight')]: 78n,
			[entityFieldAddressKey(EntityType.TronTransaction, [], 'timestampMs')]: 1_720_000_003_000,
			[entityFieldAddressKey(EntityType.TronTransaction, [], 'contractType')]: 'TransferAssetContract',
			[entityFieldAddressKey(EntityType.TronTransaction, [], 'result')]: 'REVERT',
			[entityFieldAddressKey(EntityType.TronTransaction, [], 'amountSun')]: 7n,
			[entityFieldAddressKey(EntityType.TronTransaction, [], 'assetName')]: 'asset',
		})
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
			TronAccountSelector.NetworkAddress
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
				TronAccountSelector.NetworkAddress
			].resolve({
				$network,
				address: account.address,
			}, resolverContext)).rejects.toThrow('TronScan_Rest: unsupported network')
		expect(getAccountTransactions).not.toHaveBeenCalled()
	})
})
