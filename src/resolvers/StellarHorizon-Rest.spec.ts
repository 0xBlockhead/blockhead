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
		&& (
			fieldName !== '$$trades'
			|| candidate.entityType === EntityType.StellarAccount
		)
		&& (
			fieldName !== '$$operations'
			|| candidate.entityType === EntityType.StellarTransaction
		)
	))
	if (resolver == null)
		throw new Error(`Stellar Horizon spec missing ${fieldName} resolver`)

	return resolver
}

const directOfferResolver = stellarHorizonResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.StellarOffer
	&& '$seller' in resolver.projections
))
const offerTradesResolver = stellarHorizonResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.StellarOffer
	&& '$$trades' in resolver.projections
))
const offerTimestampResolver = stellarHorizonResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.StellarOffer_Timestamp
))
const ledgerOperationsResolver = stellarHorizonResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.StellarLedger
	&& '$$operations' in resolver.projections
))

if (
	directOfferResolver == null
	|| offerTradesResolver == null
	|| offerTimestampResolver == null
	|| ledgerOperationsResolver == null
)
	throw new Error('Stellar Horizon spec missing direct offer or ledger-operation resolvers')

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

	it('materializes ledger-owned transactions through the native ledger hierarchy', async () => {
		getJson.mockResolvedValueOnce(page([{
			id: 'ledger-transaction',
			paging_token: '200',
			successful: true,
			hash: 'c'.repeat(64),
			ledger: 100,
			created_at: '2026-07-22T00:00:00Z',
			source_account: accountId,
			source_account_sequence: '1',
			fee_account: accountId,
			fee_charged: '100',
			max_fee: '100',
			operation_count: 1,
			memo_type: 'none',
		}]))
		const resolver = stellarHorizonResolvers.resolvers.find((candidate) => (
			candidate.entityType === EntityType.StellarLedger
			&& '$$transactions' in candidate.projections
		))
		if (resolver == null)
			throw new Error('Stellar Horizon spec missing ledger transaction resolver')
		const ledger = {
			$network: account.$network,
			sequence: 100n,
		}
		const snapshot = await resolver.resolve.NetworkSequence.resolve(ledger, context)
		if (typeof resolver.projections.$$transactions === 'function')
			throw new Error('Stellar Horizon ledger transactions require a paginated projection')

		expect(resolver.projections.$$transactions.select(snapshot, ledger, context)).toEqual([{
			[EntityMetaKey.Selector]: {
				$network: account.$network,
				hash: 'c'.repeat(64),
			},
			[EntityMetaKey.Fields]: expect.objectContaining({
				[entityFieldAddressKey(EntityType.StellarTransaction, [], 'sourceAccount')]: accountId,
			}),
		}])
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

		expect(trustlineResolver.projections.$$trustlines.select(trustlines)).toEqual([{
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
		expect(trustlineResolver.projections.$$trustlines.resolveCount(trustlines)).toBe(1)

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

		expect(signerResolver.projections.$$signers.select(signers).map((signer) => signer[EntityMetaKey.Selector])).toEqual([
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
		expect(signerResolver.projections.$$signers.resolveCount(signers)).toBe(2)
	})

	it('resolves direct trustline and signer routes from exact account state', async () => {
		const accountSnapshot = {
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
			signers: [{
				key: otherAccountId,
				weight: 2,
				type: 'ed25519_public_key',
				sponsor: accountId,
			}],
		}
		getJson
			.mockResolvedValueOnce(accountSnapshot)
			.mockResolvedValueOnce(accountSnapshot)

		const trustlineResolver = stellarHorizonResolvers.resolvers.find((resolver) => (
			resolver.entityType === EntityType.StellarTrustline
		))
		const signerResolver = stellarHorizonResolvers.resolvers.find((resolver) => (
			resolver.entityType === EntityType.StellarAccountSigner
		))
		if (trustlineResolver == null || signerResolver == null)
			throw new Error('Stellar Horizon direct relationship resolvers missing')

		const trustlineSelector = {
			$account: account,
			$asset: {
				$network: account.$network,
				assetKey: `USDC-${otherAccountId}`,
			},
		}
		const trustline = await trustlineResolver.resolve.AccountAsset.resolve(
			trustlineSelector,
			context
		)
		expect(trustlineResolver.projections.$$timestamps(
			trustline,
			trustlineSelector,
			context
		)[0][EntityMetaKey.Fields]).toMatchObject({
			[entityFieldAddressKey(EntityType.StellarTrustline_Timestamp, [], 'balance')]: '12.3456789',
			[entityFieldAddressKey(EntityType.StellarTrustline_Timestamp, [], 'ledgerSequence')]: 49n,
		})

		const signerSelector = {
			$account: account,
			signerKey: otherAccountId,
			signerType: 'ed25519_public_key',
		}
		const signer = await signerResolver.resolve.AccountSignerKeySignerType.resolve(
			signerSelector,
			context
		)
		expect(signerResolver.projections.$$timestamps(
			signer,
			signerSelector,
			context
		)[0][EntityMetaKey.Fields]).toMatchObject({
			[entityFieldAddressKey(EntityType.StellarAccountSigner_Timestamp, [], 'weight')]: 2,
			[entityFieldAddressKey(EntityType.StellarAccountSigner_Timestamp, [], 'sponsor')]: accountId,
		})
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

	it('resolves an offer through its current observation and related fills', async () => {
		getJson.mockResolvedValueOnce({
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
		})
		const offer = await directOfferResolver.resolve['NetworkOfferId'].resolve({
			$network: account.$network,
			offerId: '2',
		}, context)
		expect(directOfferResolver.projections.$seller(offer)).toEqual({
			[EntityMetaKey.Selector]: {
				$network: account.$network,
				accountId,
			},
		})
		expect(directOfferResolver.projections.$$timestamps(offer)).toEqual([
			expect.objectContaining({
				[EntityMetaKey.Selector]: {
					$offer: {
						$network: account.$network,
						offerId: '2',
					},
					timestampMs: Date.parse('2026-07-22T00:00:00Z'),
					source: 'StellarHorizon_Rest',
				},
			}),
		])

		getJson.mockResolvedValueOnce(page([{
			id: '246907709817896961-0',
			paging_token: '246907709817896961-0',
			ledger_close_time: '2026-07-22T00:00:00Z',
			offer_id: '2',
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
		const tradePage = await offerTradesResolver.resolve['NetworkOfferId'].resolve({
			$network: account.$network,
			offerId: '2',
		}, context)
		const trades = offerTradesResolver.projections.$$trades.select(
			tradePage,
			{
				$network: account.$network,
				offerId: '2',
			},
			context
		)
		expect(trades[0][EntityMetaKey.Selector]).toEqual({
			$network: account.$network,
			tradeId: '246907709817896961-0',
			source: 'StellarHorizon_Rest',
		})
		expect(offerTradesResolver.projections.$$trades.continuation(
			tradePage,
			{
				$network: account.$network,
				offerId: '2',
			},
			context
		)).toEqual({
			operation: 'offer-trades',
			target: '2',
			terminal: true,
		})

		await expect(offerTimestampResolver.resolve[
			'OfferTimestampMsSource'
		].resolve({
			$offer: {
				$network: account.$network,
				offerId: '2',
			},
			timestampMs: 0,
			source: 'Other_Source',
		}, context)).rejects.toThrow('offer observation source mismatch')
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

describe('Stellar Horizon ledger hierarchy', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('pages ledger operations into their native transaction-owned identities', async () => {
		const ledger = {
			$network: account.$network,
			sequence: 100n,
		}
		getJson.mockResolvedValueOnce(page([{
			id: '273998503801384961',
			paging_token: '273998503801384961',
			transaction_successful: true,
			source_account: accountId,
			type: 'payment',
			type_i: 1,
			created_at: '2026-07-22T00:00:00Z',
			transaction_hash: 'd'.repeat(64),
			from: accountId,
			to: otherAccountId,
			amount: '1.0000000',
			asset_type: 'native',
		}]))

		const snapshot = await ledgerOperationsResolver.resolve.NetworkSequence.resolve(
			ledger,
			context
		)

		expect(ledgerOperationsResolver.projections.$$operations.select(
			snapshot,
			ledger,
			context
		)).toEqual([{
			[EntityMetaKey.Selector]: {
				$transaction: {
					$network: ledger.$network,
					hash: 'd'.repeat(64),
				},
				operationIndex: 1,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.StellarOperation, [], 'operationType')]: 'payment',
				[entityFieldAddressKey(EntityType.StellarOperation, [], 'sourceAccount')]: accountId,
				[entityFieldAddressKey(EntityType.StellarOperation, [], 'body')]: {
					from: accountId,
					to: otherAccountId,
					amount: '1.0000000',
					asset_type: 'native',
				},
				[entityFieldAddressKey(EntityType.StellarOperation, [], 'resultCode')]: 'successful',
			},
		}])
		expect(ledgerOperationsResolver.projections.$$operations.continuation(
			snapshot,
			ledger,
			context
		)).toEqual({
			operation: 'ledger-operations',
			target: '100',
			terminal: true,
		})
		expect(getJson).toHaveBeenLastCalledWith(
			expect.anything(),
			'/ledgers/100/operations?limit=2&order=desc'
		)
	})
})

describe('Stellar Horizon network history resolver', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('pages every APP-authorized native network collection', async () => {
		const network = account.$network
		for (const [fieldName, path] of [
			['$$accounts', '/accounts?'],
			['$$transactions', '/transactions?'],
			['$$operations', '/operations?'],
			['$$offers', '/offers?'],
			['$$trades', '/trades?'],
			['$$claimableBalances', '/claimable_balances?'],
		] as const) {
			getJson.mockResolvedValueOnce(page([]))
			const resolver = stellarHorizonResolvers.resolvers.find((candidate) => (
				candidate.entityType === EntityType.StellarNetwork
				&& fieldName in candidate.projections
			))
			if (resolver == null)
				throw new Error(`Stellar Horizon spec missing network ${fieldName} resolver`)

			const snapshot = await resolver.resolve.Network.resolve(network, context)
			expect(resolver.projections[fieldName].select(snapshot, network, context)).toEqual([])
			expect(resolver.projections[fieldName].continuation(snapshot, network, context)).toEqual({
				operation: `network-${fieldName.slice(2)}`,
				target: 'stellar',
				terminal: true,
			})
			expect(getJson).toHaveBeenLastCalledWith(
				expect.anything(),
				expect.stringContaining(path)
			)
		}
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

describe('Stellar Horizon claimable-balance resolver', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('materializes native claimable-balance lists and the source-clocked observation from the direct route', async () => {
		const claimableBalanceId = 'a'.repeat(72)
		const stellarNetwork = {
			$network: {
				slug: 'stellar',
			},
		}
		const claimableBalance = {
			$network: stellarNetwork,
			claimableBalanceId,
		}
		const claimableBalanceWire = {
			id: 'A'.repeat(72),
			paging_token: 'A'.repeat(72),
			asset: 'native',
			amount: '12.0000000',
			last_modified_ledger: 63_779_242,
			last_modified_time: '2026-08-03T11:35:17Z',
			claimants: [{
				destination: accountId,
				predicate: {
					unconditional: true,
				},
			}],
			sponsor: otherAccountId,
		}
		getJson
			.mockResolvedValueOnce(page([claimableBalanceWire]))
			.mockResolvedValueOnce(page([claimableBalanceWire]))
			.mockResolvedValueOnce(claimableBalanceWire)
			.mockResolvedValueOnce(claimableBalanceWire)

		const networkResolver = stellarHorizonResolvers.resolvers.find((resolver) => (
			resolver.entityType === EntityType.StellarNetwork
			&& '$$claimableBalances' in resolver.projections
		))
		const assetResolver = stellarHorizonResolvers.resolvers.find((resolver) => (
			resolver.entityType === EntityType.StellarAsset
			&& '$$claimableBalances' in resolver.projections
		))
		const claimableBalanceResolver = stellarHorizonResolvers.resolvers.find((resolver) => (
			resolver.entityType === EntityType.StellarClaimableBalance
		))
		const claimableBalanceTimestampResolver = stellarHorizonResolvers.resolvers.find((resolver) => (
			resolver.entityType === EntityType.StellarClaimableBalance_Timestamp
		))
		if (
			networkResolver == null
			|| assetResolver == null
			|| claimableBalanceResolver == null
			|| claimableBalanceTimestampResolver == null
		)
			throw new Error('Stellar Horizon spec missing claimable-balance resolvers')

		const networkSnapshot = await networkResolver.resolve.Network.resolve(stellarNetwork, context)
		const claimableBalances = networkResolver.projections.$$claimableBalances.select(
			networkSnapshot,
			stellarNetwork
		)
		expect(claimableBalances).toEqual([{
			[EntityMetaKey.Selector]: claimableBalance,
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.StellarClaimableBalance, [], '$$timestamps')]: [{
					[EntityMetaKey.Selector]: {
						$claimableBalance: claimableBalance,
						timestampMs: Date.parse(claimableBalanceWire.last_modified_time),
						source: 'StellarHorizon_Rest',
					},
					[EntityMetaKey.Fields]: {
						[entityFieldAddressKey(EntityType.StellarClaimableBalance_Timestamp, [], 'ledgerSequence')]: 63_779_242n,
						[entityFieldAddressKey(EntityType.StellarClaimableBalance_Timestamp, [], '$asset')]: {
							[EntityMetaKey.Selector]: {
								$network: stellarNetwork,
								assetKey: 'XLM',
							},
							[EntityMetaKey.Fields]: {
								[entityFieldAddressKey(EntityType.StellarAsset, [], 'assetKind')]: 'native',
								[entityFieldAddressKey(EntityType.StellarAsset, [], 'assetCode')]: 'XLM',
							},
						},
						[entityFieldAddressKey(EntityType.StellarClaimableBalance_Timestamp, [], 'amount')]: '12.0000000',
						[entityFieldAddressKey(EntityType.StellarClaimableBalance_Timestamp, [], 'claimants')]: claimableBalanceWire.claimants,
						[entityFieldAddressKey(EntityType.StellarClaimableBalance_Timestamp, [], 'sponsor')]: otherAccountId,
					},
				}],
			},
		}])

		const asset = {
			$network: stellarNetwork,
			assetKey: 'XLM',
		}
		const assetSnapshot = await assetResolver.resolve.NetworkAssetKey.resolve(asset, context)
		expect(assetResolver.projections.$$claimableBalances.select(assetSnapshot, asset)).toHaveLength(1)
		expect(getJson).toHaveBeenNthCalledWith(
			2,
			expect.anything(),
			expect.stringContaining('/claimable_balances?')
		)
		expect(getJson.mock.calls[1][1]).toContain('asset=native')

		const direct = await claimableBalanceResolver.resolve.NetworkClaimableBalanceId.resolve(
			claimableBalance,
			context
		)
		expect(claimableBalanceResolver.projections.$$timestamps(direct)).toHaveLength(1)

		const observation = await claimableBalanceTimestampResolver.resolve.ClaimableBalanceTimestampMsSource.resolve({
			$claimableBalance: claimableBalance,
			timestampMs: Date.parse(claimableBalanceWire.last_modified_time),
			source: 'StellarHorizon_Rest',
		}, context)
		expect(claimableBalanceTimestampResolver.projections.amount(observation)).toBe('12.0000000')
		expect(claimableBalanceTimestampResolver.projections.ledgerSequence(observation)).toBe(63_779_242n)
	})

	it('rejects an observation whose source or owner clock cannot be proven', async () => {
		const claimableBalanceTimestampResolver = stellarHorizonResolvers.resolvers.find((resolver) => (
			resolver.entityType === EntityType.StellarClaimableBalance_Timestamp
		))
		if (claimableBalanceTimestampResolver == null)
			throw new Error('Stellar Horizon spec missing claimable-balance timestamp resolver')

		await expect(claimableBalanceTimestampResolver.resolve.ClaimableBalanceTimestampMsSource.resolve({
			$claimableBalance: {
				$network: {
					$network: {
						slug: 'stellar',
					},
				},
				claimableBalanceId: 'a'.repeat(72),
			},
			timestampMs: 0,
			source: 'Other_Source',
		}, context)).rejects.toThrow('claimable balance observation source mismatch')

		getJson.mockResolvedValueOnce({
			id: 'a'.repeat(72),
			paging_token: 'a'.repeat(72),
			asset: 'native',
			amount: '12.0000000',
			last_modified_ledger: 1,
			last_modified_time: '2026-08-03T11:35:17Z',
			claimants: [{
				destination: accountId,
				predicate: {
					unconditional: true,
				},
			}],
		})
		await expect(claimableBalanceTimestampResolver.resolve.ClaimableBalanceTimestampMsSource.resolve({
			$claimableBalance: {
				$network: {
					$network: {
						slug: 'stellar',
					},
				},
				claimableBalanceId: 'a'.repeat(72),
			},
			timestampMs: 0,
			source: 'StellarHorizon_Rest',
		}, context)).rejects.toThrow('claimable balance observation timestamp mismatch')
	})
})
