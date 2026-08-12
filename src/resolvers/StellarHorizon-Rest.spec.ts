import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
	entityFieldAddressKey,
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'

const { getJson } = vi.hoisted(() => ({
	getJson: vi.fn(),
}))

vi.mock('$/sources/_shared/wire/HttpRest/client.ts', () => ({
	getJson,
}))

const { default: stellarHorizonResolvers } = await import('$/resolvers/StellarHorizon-Rest.ts')

const resolverFor = (
	fieldName: (
		| '$$timestamps'
		| '$$transactions'
		| '$$trustlines'
		| '$$signers'
		| '$$offers'
		| '$$trades'
		| '$$operations'
		| 'sourceAccount'
	)
) => {
	const resolver = stellarHorizonResolvers.resolvers.find((candidate) => (
		fieldName in candidate.projections
	))
	if (resolver == null)
		throw new Error(`Stellar Horizon spec missing ${fieldName} resolver`)

	return resolver
}

const accountId = `G${'A'.repeat(55)}`
const otherAccountId = `G${'B'.repeat(55)}`
const account = {
	$network: {
		$network: {
			slug: 'stellar',
		},
	},
	accountId,
}
const context = {
	filters: [],
	sorts: [],
	pagination: {
		limit: 2,
	},
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [],
	publicEnv: {},
}
const page = <_Record>(records: _Record[]) => ({
	_links: {
		next: {
			href: 'https://horizon.stellar.org/next',
		},
	},
	_embedded: {
		records,
	},
})

describe('Stellar Horizon public-account resolver', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('materializes an exact source-provenanced account observation', async () => {
		getJson.mockResolvedValueOnce({
			id: accountId,
			account_id: accountId,
			sequence: '9223372036854775807',
			subentry_count: 3,
			last_modified_ledger: 5_000_000,
			last_modified_time: '2026-07-22T00:00:00Z',
			thresholds: {
				low_threshold: 1,
				med_threshold: 2,
				high_threshold: 3,
			},
			balances: [
				{
					asset_type: 'native',
					balance: '12345678901234567890.1234567',
					buying_liabilities: '0.0000000',
					selling_liabilities: '0.0000000',
				},
				{
					asset_type: 'credit_alphanum4',
					asset_code: 'USDC',
					asset_issuer: otherAccountId,
					balance: '12.3456789',
				},
			],
			signers: [
				{
					key: accountId,
					weight: 1,
					type: 'ed25519_public_key',
				},
			],
		})
		const resolver = resolverFor('$$timestamps')
		const timestamps = await resolver.resolve['NetworkAccountId'].resolve(
			account,
			context
		)

		expect(resolver.projections.$$timestamps(timestamps)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$account: account,
					timestampMs: Date.parse('2026-07-22T00:00:00Z'),
					source: 'StellarHorizon_Rest',
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.StellarAccount_Timestamp, [], 'ledgerSequence')]: 5_000_000n,
					[entityFieldAddressKey(EntityType.StellarAccount_Timestamp, [], 'sequence')]: '9223372036854775807',
					[entityFieldAddressKey(EntityType.StellarAccount_Timestamp, [], 'nativeBalance')]: '12345678901234567890.1234567',
					[entityFieldAddressKey(EntityType.StellarAccount_Timestamp, [], 'subentryCount')]: 3,
					[entityFieldAddressKey(EntityType.StellarAccount_Timestamp, [], 'thresholds')]: {
						low_threshold: 1,
						med_threshold: 2,
						high_threshold: 3,
					},
					[entityFieldAddressKey(EntityType.StellarAccount_Timestamp, [], 'signerCount')]: 1,
				},
			},
		])
		expect(getJson.mock.calls[0]).toEqual([
			expect.objectContaining({
				source: 'StellarHorizon_Rest',
				target: {
					kind: 'Global',
					key: 'stellar-public-horizon',
				},
			}),
			`/accounts/${accountId}`,
		])
	})

	it('rejects malformed account thresholds before projecting schema fields', async () => {
		getJson.mockResolvedValueOnce({
			id: accountId,
			account_id: accountId,
			sequence: '1',
			subentry_count: 0,
			last_modified_ledger: 1,
			last_modified_time: '2026-07-22T00:00:00Z',
			thresholds: {
				low_threshold: 0,
				med_threshold: 128,
				high_threshold: 256,
			},
			balances: [],
			signers: [],
		})

		await expect(resolverFor('$$timestamps').resolve[
			'NetworkAccountId'
		].resolve(account, context)).rejects.toThrow('invalid account response envelope')
	})

	it('preserves descending transaction order, ledger identity, amounts, and cursor', async () => {
		getJson.mockResolvedValueOnce(page([
			{
				id: 'transaction-2',
				paging_token: '200',
				successful: true,
				hash: 'b'.repeat(64),
				ledger: 102,
				created_at: '2026-07-22T00:02:00Z',
				source_account: otherAccountId,
				source_account_sequence: '9223372036854775807',
				fee_account: otherAccountId,
				fee_charged: '9223372036854775807',
				max_fee: '9223372036854775808',
				operation_count: 2,
				memo_type: 'text',
				memo: 'invoice-2',
			},
			{
				id: 'transaction-1',
				paging_token: '190',
				successful: false,
				hash: 'a'.repeat(64),
				ledger: 101,
				created_at: '2026-07-22T00:01:00Z',
				source_account: accountId,
				source_account_sequence: '9223372036854775806',
				fee_account: accountId,
				fee_charged: '100',
				max_fee: '200',
				operation_count: 1,
				memo_type: 'none',
			},
		]))
		const resolver = resolverFor('$$transactions')
		const snapshot = await resolver.resolve['NetworkAccountId'].resolve(
			account,
			context
		)
		const transactions = resolver.projections.$$transactions.select(snapshot, account, context)

		expect(transactions.map((transaction) => transaction[EntityMetaKey.Selector])).toEqual([
			{
				$network: account.$network,
				hash: 'b'.repeat(64),
			},
			{
				$network: account.$network,
				hash: 'a'.repeat(64),
			},
		])
		expect(transactions[0][EntityMetaKey.Fields]).toEqual({
			[entityFieldAddressKey(EntityType.StellarTransaction, [], 'sourceAccount')]: otherAccountId,
			[entityFieldAddressKey(EntityType.StellarTransaction, [], '$$timestamps')]: [{
				[EntityMetaKey.Selector]: {
					$transaction: {
						$network: account.$network,
						hash: 'b'.repeat(64),
					},
					timestampMs: Date.parse('2026-07-22T00:02:00Z'),
					source: 'StellarHorizon_Rest',
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.StellarTransaction_Timestamp, [], 'ledgerSequence')]: 102n,
					[entityFieldAddressKey(EntityType.StellarTransaction_Timestamp, [], 'successful')]: true,
					[entityFieldAddressKey(EntityType.StellarTransaction_Timestamp, [], 'feeCharged')]: 9_223_372_036_854_775_807n,
					[entityFieldAddressKey(EntityType.StellarTransaction_Timestamp, [], 'maxFee')]: 9_223_372_036_854_775_808n,
					[entityFieldAddressKey(EntityType.StellarTransaction_Timestamp, [], 'memo')]: {
						type: 'text',
						value: 'invoice-2',
					},
				},
			}],
		})
		expect(resolver.projections.$$transactions.continuation(snapshot, account, context)).toEqual({
			operation: 'account-transactions',
			target: accountId,
			terminal: false,
			token: '190',
		})
		expect(getJson.mock.calls[0][1]).toBe(
			`/accounts/${accountId}/transactions?limit=2&order=desc`
		)
	})

	it('caps Horizon pages, terminates short pages, and rejects non-G or foreign-network subjects', async () => {
		getJson.mockResolvedValueOnce(page([]))
		const resolver = resolverFor('$$transactions')
		const snapshot = await resolver.resolve['NetworkAccountId'].resolve(account, {
			...context,
			pagination: {
				limit: 1_000,
			},
		})

		expect(getJson.mock.calls[0][1]).toBe(
			`/accounts/${accountId}/transactions?limit=200&order=desc`
		)
		expect(resolver.projections.$$transactions.continuation(snapshot, account, context)).toEqual({
			operation: 'account-transactions',
			target: accountId,
			terminal: true,
		})

		vi.clearAllMocks()
		await expect(resolver.resolve['NetworkAccountId'].resolve({
			...account,
			accountId: `M${'A'.repeat(68)}`,
		}, context)).rejects.toThrow('invalid account ID')
		await expect(resolver.resolve['NetworkAccountId'].resolve({
			...account,
			$network: {
				$network: {
					slug: 'stellar-testnet',
				},
			},
		}, context)).rejects.toThrow('unsupported network')
		expect(getJson).not.toHaveBeenCalled()
	})

	it('fails closed on invalid account and transaction observation clocks', async () => {
		const timestampResolver = resolverFor('$$timestamps')
		getJson.mockResolvedValueOnce({
			id: accountId,
			account_id: accountId,
			sequence: '1',
			subentry_count: 0,
			last_modified_ledger: 1,
			last_modified_time: 'not-a-time',
			thresholds: {
				low_threshold: 0,
				med_threshold: 0,
				high_threshold: 0,
			},
			balances: [{
				asset_type: 'native',
				balance: '1.0000000',
			}],
			signers: [],
		})
		await expect(timestampResolver.resolve[
			'NetworkAccountId'
		].resolve(account, context)).rejects.toThrow('invalid account modification time')

		const transactionResolver = resolverFor('$$transactions')
		getJson.mockResolvedValueOnce(page([{
			id: 'transaction',
			paging_token: '1',
			successful: true,
			hash: 'a'.repeat(64),
			ledger: 1,
			created_at: 'not-a-time',
			source_account: accountId,
			source_account_sequence: '1',
			fee_account: accountId,
			fee_charged: '100',
			max_fee: '100',
			operation_count: 1,
			memo_type: 'none',
		}]))
		const snapshot = await transactionResolver.resolve[
			'NetworkAccountId'
		].resolve(account, context)
		expect(() => transactionResolver.projections.$$transactions.select(
			snapshot,
			account,
			context
		)).toThrow('invalid transaction creation time')
	})

	it('materializes trustlines and signers from exact account state', async () => {
		getJson.mockResolvedValueOnce({
			id: accountId,
			account_id: accountId,
			sequence: '1',
			subentry_count: 2,
			last_modified_ledger: 50,
			last_modified_time: '2026-07-22T00:00:00Z',
			thresholds: {
				low_threshold: 0,
				med_threshold: 0,
				high_threshold: 0,
			},
			balances: [
				{
					asset_type: 'native',
					balance: '1.0000000',
				},
				{
					asset_type: 'credit_alphanum4',
					asset_code: 'USDC',
					asset_issuer: otherAccountId,
					balance: '12.3456789',
					limit: '1000.0000000',
					last_modified_ledger: 49,
					is_authorized: true,
				},
			],
			signers: [
				{
					key: accountId,
					weight: 1,
					type: 'ed25519_public_key',
				},
				{
					key: otherAccountId,
					weight: 2,
					type: 'ed25519_public_key',
					sponsor: accountId,
				},
			],
		})
		const trustlineResolver = resolverFor('$$trustlines')
		const trustlines = await trustlineResolver.resolve['NetworkAccountId'].resolve(
			account,
			context
		)

		expect(trustlineResolver.projections.$$trustlines(trustlines)).toEqual([{
			[EntityMetaKey.Selector]: {
				$account: account,
				$asset: {
					$network: account.$network,
					assetKey: `USDC-${otherAccountId}`,
				},
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.StellarTrustline, [], '$asset')]: {
					[EntityMetaKey.Selector]: {
						$network: account.$network,
						assetKey: `USDC-${otherAccountId}`,
					},
					[EntityMetaKey.Fields]: {
						[entityFieldAddressKey(EntityType.StellarAsset, [], 'assetKind')]: 'credit_alphanum4',
						[entityFieldAddressKey(EntityType.StellarAsset, [], 'assetCode')]: 'USDC',
						[entityFieldAddressKey(EntityType.StellarAsset, [], 'issuer')]: otherAccountId,
						[entityFieldAddressKey(EntityType.StellarAsset, [], '$issuerAccount')]: {
							[EntityMetaKey.Selector]: {
								$network: account.$network,
								accountId: otherAccountId,
							},
						},
					},
				},
				[entityFieldAddressKey(EntityType.StellarTrustline, [], '$$timestamps')]: [{
					[EntityMetaKey.Selector]: {
						$trustline: {
							$account: account,
							$asset: {
								$network: account.$network,
								assetKey: `USDC-${otherAccountId}`,
							},
						},
						timestampMs: Date.parse('2026-07-22T00:00:00Z'),
						source: 'StellarHorizon_Rest',
					},
					[EntityMetaKey.Fields]: {
						[entityFieldAddressKey(EntityType.StellarTrustline_Timestamp, [], 'balance')]: '12.3456789',
						[entityFieldAddressKey(EntityType.StellarTrustline_Timestamp, [], 'limit')]: '1000.0000000',
						[entityFieldAddressKey(EntityType.StellarTrustline_Timestamp, [], 'ledgerSequence')]: 49n,
						[entityFieldAddressKey(EntityType.StellarTrustline_Timestamp, [], 'authorized')]: true,
					},
				}],
			},
		}])

		getJson.mockResolvedValueOnce({
			id: accountId,
			account_id: accountId,
			sequence: '1',
			subentry_count: 2,
			last_modified_ledger: 50,
			last_modified_time: '2026-07-22T00:00:00Z',
			thresholds: {
				low_threshold: 0,
				med_threshold: 0,
				high_threshold: 0,
			},
			balances: [{
				asset_type: 'native',
				balance: '1.0000000',
			}],
			signers: [
				{
					key: accountId,
					weight: 1,
					type: 'ed25519_public_key',
				},
				{
					key: otherAccountId,
					weight: 2,
					type: 'ed25519_public_key',
					sponsor: accountId,
				},
			],
		})
		const signerResolver = resolverFor('$$signers')
		const signers = await signerResolver.resolve['NetworkAccountId'].resolve(
			account,
			context
		)

		expect(signerResolver.projections.$$signers(signers).map((signer) => signer[EntityMetaKey.Selector])).toEqual([
			{
				$account: account,
				signerKey: accountId,
				signerType: 'ed25519_public_key',
			},
			{
				$account: account,
				signerKey: otherAccountId,
				signerType: 'ed25519_public_key',
			},
		])
	})

	it('pages account offers and trades into schema-shaped rows', async () => {
		getJson.mockResolvedValueOnce(page([{
			id: '2',
			paging_token: '2',
			seller: accountId,
			selling: {
				asset_type: 'native',
			},
			buying: {
				asset_type: 'credit_alphanum4',
				asset_code: 'USDC',
				asset_issuer: otherAccountId,
			},
			amount: '1.0000000',
			price_r: {
				n: 1,
				d: 2,
			},
			price: '0.5000000',
			last_modified_ledger: 100,
			last_modified_time: '2026-07-22T00:00:00Z',
		}]))
		const offerResolver = resolverFor('$$offers')
		const offerSnapshot = await offerResolver.resolve['NetworkAccountId'].resolve(
			account,
			context
		)
		const offers = offerResolver.projections.$$offers.select(offerSnapshot, account, context)

		expect(offers[0][EntityMetaKey.Selector]).toEqual({
			$network: account.$network,
			offerId: '2',
		})
		expect(offers[0][EntityMetaKey.Fields]?.[entityFieldAddressKey(EntityType.StellarOffer, [], '$seller')]).toEqual({
			[EntityMetaKey.Selector]: {
				$network: account.$network,
				accountId,
			},
		})

		getJson.mockResolvedValueOnce(page([{
			id: '246907709817896961-0',
			paging_token: '246907709817896961-0',
			ledger_close_time: '2026-07-22T00:00:00Z',
			trade_type: 'orderbook',
			base_offer_id: '1',
			base_account: accountId,
			base_amount: '1.0000000',
			base_asset_type: 'native',
			counter_offer_id: '2',
			counter_account: otherAccountId,
			counter_amount: '2.0000000',
			counter_asset_type: 'credit_alphanum4',
			counter_asset_code: 'USDC',
			counter_asset_issuer: otherAccountId,
			price: {
				n: '2',
				d: '1',
			},
		}]))
		const tradeResolver = resolverFor('$$trades')
		const tradeSnapshot = await tradeResolver.resolve['NetworkAccountId'].resolve(
			account,
			context
		)
		const trades = tradeResolver.projections.$$trades.select(tradeSnapshot, account, context)

		expect(trades[0][EntityMetaKey.Selector]).toEqual({
			$network: account.$network,
			tradeId: '246907709817896961-0',
			source: 'StellarHorizon_Rest',
		})
		expect(trades[0][EntityMetaKey.Fields]?.[entityFieldAddressKey(EntityType.StellarTrade, [], 'baseAmount')]).toBe('1.0000000')
	})

	it('resolves transaction headers and operation lists by network hash', async () => {
		const hash = 'd'.repeat(64)
		const transaction = {
			$network: account.$network,
			hash,
		}
		getJson.mockResolvedValueOnce({
			id: hash,
			paging_token: '200',
			successful: true,
			hash,
			ledger: 100,
			created_at: '2026-07-22T00:00:00Z',
			source_account: accountId,
			source_account_sequence: '1',
			fee_account: accountId,
			fee_charged: '100',
			max_fee: '100',
			operation_count: 1,
			memo_type: 'none',
			envelope_xdr: 'AAAAAg==',
			result_xdr: 'AAAAAAAAAGQ=',
			fee_meta_xdr: 'AAAAAg==',
			signatures: ['sig-a', 'sig-b'],
		})
		const headerResolver = resolverFor('sourceAccount')
		const header = await headerResolver.resolve['NetworkHash'].resolve(
			transaction,
			context
		)

		expect(headerResolver.projections.sourceAccount(header)).toBe(accountId)
		expect(headerResolver.projections.$$timestamps(header)).toEqual([{
			[EntityMetaKey.Selector]: {
				$transaction: transaction,
				timestampMs: Date.parse('2026-07-22T00:00:00Z'),
				source: 'StellarHorizon_Rest',
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.StellarTransaction_Timestamp, [], 'ledgerSequence')]: 100n,
				[entityFieldAddressKey(EntityType.StellarTransaction_Timestamp, [], 'successful')]: true,
				[entityFieldAddressKey(EntityType.StellarTransaction_Timestamp, [], 'feeCharged')]: 100n,
				[entityFieldAddressKey(EntityType.StellarTransaction_Timestamp, [], 'maxFee')]: 100n,
				[entityFieldAddressKey(EntityType.StellarTransaction_Timestamp, [], 'envelopeXdr')]: 'AAAAAg==',
				[entityFieldAddressKey(EntityType.StellarTransaction_Timestamp, [], 'resultXdr')]: 'AAAAAAAAAGQ=',
				[entityFieldAddressKey(EntityType.StellarTransaction_Timestamp, [], 'feeMetaXdr')]: 'AAAAAg==',
				[entityFieldAddressKey(EntityType.StellarTransaction_Timestamp, [], 'signatures')]: ['sig-a', 'sig-b'],
			},
		}])

		getJson.mockResolvedValueOnce(page([{
			id: '273998503801384961',
			paging_token: '273998503801384961',
			transaction_successful: true,
			source_account: accountId,
			type: 'payment',
			type_i: 1,
			created_at: '2026-07-22T00:00:00Z',
			transaction_hash: hash,
			from: accountId,
			to: otherAccountId,
			amount: '1.0000000',
			asset_type: 'native',
		}]))
		const operationResolver = resolverFor('$$operations')
		const operationSnapshot = await operationResolver.resolve['NetworkHash'].resolve(
			transaction,
			context
		)
		const operations = operationResolver.projections.$$operations.select(
			operationSnapshot,
			transaction,
			context
		)

		expect(operations[0][EntityMetaKey.Selector]).toEqual({
			$transaction: transaction,
			operationIndex: 1,
		})
		expect(operations[0][EntityMetaKey.Fields]).toEqual({
			[entityFieldAddressKey(EntityType.StellarOperation, [], 'operationType')]: 'payment',
			[entityFieldAddressKey(EntityType.StellarOperation, [], 'sourceAccount')]: accountId,
			[entityFieldAddressKey(EntityType.StellarOperation, [], 'body')]: {
				from: accountId,
				to: otherAccountId,
				amount: '1.0000000',
				asset_type: 'native',
			},
			[entityFieldAddressKey(EntityType.StellarOperation, [], 'resultCode')]: 'successful',
		})
	})
})

describe('Stellar Horizon liquidity-pool resolver', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('materializes pool assets and its source-clocked reserve observation from both the network list and direct route', async () => {
		const liquidityPoolId = 'a'.repeat(64)
		const stellarNetwork = {
			$network: {
				slug: 'stellar',
			},
		}
		const liquidityPool = {
			$network: stellarNetwork,
			liquidityPoolId,
		}
		const liquidityPoolWire = {
			id: liquidityPoolId,
			paging_token: liquidityPoolId,
			fee_bp: 30,
			type: 'constant_product',
			total_trustlines: '12',
			total_shares: '5494.2144063',
			reserves: [
				{
					asset: 'native',
					amount: '0.2500452',
				},
				{
					asset: `USDC:${otherAccountId}`,
					amount: '223681544.4698246',
				},
			],
			last_modified_ledger: 63_779_242,
			last_modified_time: '2026-08-03T11:35:17Z',
		}
		getJson
			.mockResolvedValueOnce(page([liquidityPoolWire]))
			.mockResolvedValueOnce(liquidityPoolWire)
			.mockResolvedValueOnce(liquidityPoolWire)

		const networkResolver = stellarHorizonResolvers.resolvers.find((resolver) => (
			resolver.entityType === EntityType.StellarNetwork
			&& '$$liquidityPools' in resolver.projections
		))
		const poolResolver = stellarHorizonResolvers.resolvers.find((resolver) => (
			resolver.entityType === EntityType.StellarLiquidityPool
			&& 'poolType' in resolver.projections
		))
		const poolTimestampResolver = stellarHorizonResolvers.resolvers.find((resolver) => (
			resolver.entityType === EntityType.StellarLiquidityPool_Timestamp
		))
		if (networkResolver == null || poolResolver == null || poolTimestampResolver == null)
			throw new Error('Stellar Horizon spec missing liquidity-pool resolvers')

		const networkSnapshot = await networkResolver.resolve.Network.resolve(stellarNetwork, context)
		const pools = networkResolver.projections.$$liquidityPools.select(networkSnapshot, stellarNetwork)
		expect(pools).toHaveLength(1)
		expect(pools[0]).toMatchObject({
			[EntityMetaKey.Selector]: liquidityPool,
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.StellarLiquidityPool, [], 'poolType')]: 'constant_product',
				[entityFieldAddressKey(EntityType.StellarLiquidityPool, [], 'feeBps')]: 30,
				[entityFieldAddressKey(EntityType.StellarLiquidityPool, [], '$$timestamps')]: [
					expect.objectContaining({
						[EntityMetaKey.Selector]: {
							$liquidityPool: liquidityPool,
							timestampMs: Date.parse(liquidityPoolWire.last_modified_time),
							source: 'StellarHorizon_Rest',
						},
					}),
				],
			},
		})

		const directPool = await poolResolver.resolve.NetworkLiquidityPoolId.resolve(liquidityPool, context)
		expect(poolResolver.projections.$assetB(directPool, liquidityPool)).toMatchObject({
			[EntityMetaKey.Selector]: {
				$network: stellarNetwork,
				assetKey: `USDC-${otherAccountId}`,
			},
		})

		const poolTimestamp = await poolTimestampResolver.resolve.LiquidityPoolTimestampMsSource.resolve({
			$liquidityPool: liquidityPool,
			timestampMs: Date.parse(liquidityPoolWire.last_modified_time),
			source: 'StellarHorizon_Rest',
		}, context)
		expect(poolTimestampResolver.projections).toMatchObject({
			reserveA: expect.any(Function),
			totalShares: expect.any(Function),
		})
		expect(poolTimestampResolver.projections.reserveA(poolTimestamp)).toBe('0.2500452')
		expect(poolTimestampResolver.projections.totalShares(poolTimestamp)).toBe('5494.2144063')
	})

	it('rejects an observation whose source or owner clock cannot be proven', async () => {
		const poolTimestampResolver = stellarHorizonResolvers.resolvers.find((resolver) => (
			resolver.entityType === EntityType.StellarLiquidityPool_Timestamp
		))
		if (poolTimestampResolver == null)
			throw new Error('Stellar Horizon spec missing liquidity-pool timestamp resolver')

		await expect(poolTimestampResolver.resolve.LiquidityPoolTimestampMsSource.resolve({
			$liquidityPool: {
				$network: {
					$network: {
						slug: 'stellar',
					},
				},
				liquidityPoolId: 'a'.repeat(64),
			},
			timestampMs: 0,
			source: 'Other_Source',
		}, context)).rejects.toThrow('liquidity pool observation source mismatch')
	})
})
