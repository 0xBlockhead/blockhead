import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import { networkBySlug } from '$/constants/Network.ts'
import { entityFieldAddressKey, EntityMetaKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

const getInscriptionInfo = vi.hoisted(() => vi.fn())
const getRuneInfo = vi.hoisted(() => vi.fn())
const getUtxoInfo = vi.hoisted(() => vi.fn())
const getUtxoRuneBalances = vi.hoisted(() => vi.fn())
const getAddressRuneBalances = vi.hoisted(() => vi.fn())
const getAddressRuneBalance = vi.hoisted(() => vi.fn())
const getAddressInscriptions = vi.hoisted(() => vi.fn())

vi.mock('$/sources/UniSat/Rest/queries.ts', () => ({
	getInscriptionInfo,
	getRuneInfo,
	getUtxoInfo,
	getUtxoRuneBalances,
	getAddressRuneBalances,
	getAddressRuneBalance,
	getAddressInscriptions,
}))

const { default: uniSatRest } = await import('$/resolvers/UniSat-Rest.ts')

const inscriptionResolver = uniSatRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.BitcoinOrdinalInscription
))
const runeResolver = uniSatRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.BitcoinRune
))
const balanceResolver = uniSatRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.BitcoinRuneBalance
))
const addressInscriptionsResolver = uniSatRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.UtxoAddress
	&& '$$bitcoinOrdinalInscriptions' in resolver.projections
))
const addressRuneBalancesResolver = uniSatRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.UtxoAddress
	&& '$$bitcoinRuneBalances' in resolver.projections
))
const outputInscriptionsResolver = uniSatRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.UtxoOutput
	&& '$$bitcoinOrdinalInscriptions' in resolver.projections
))
const outputRuneBalancesResolver = uniSatRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.UtxoOutput
	&& '$$bitcoinRuneBalances' in resolver.projections
))

const context = {
	filters: [],
	sorts: [],
	pagination: {
		limit: 16,
		offset: 0,
	},
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [],
	publicEnv: {
		PUBLIC_UNISAT_API_KEY: 'test-key',
	},
}

const bitcoinNetwork = {
	caip2: networkBySlug.bitcoin.caip2,
}


describe('UniSat Rest resolver module', () => {
	beforeEach(() => {
		getInscriptionInfo.mockReset()
		getRuneInfo.mockReset()
		getUtxoInfo.mockReset()
		getUtxoRuneBalances.mockReset()
		getAddressRuneBalances.mockReset()
		getAddressRuneBalance.mockReset()
		getAddressInscriptions.mockReset()
	})

	it('registers under UniSat_Rest', () => {
		expect(uniSatRest.source).toBe(Source.UniSat_Rest)
		expect(inscriptionResolver).toBeDefined()
		expect(runeResolver).toBeDefined()
		expect(balanceResolver).toBeDefined()
		expect(addressInscriptionsResolver).toBeDefined()
		expect(addressRuneBalancesResolver).toBeDefined()
		expect(outputInscriptionsResolver).toBeDefined()
		expect(outputRuneBalancesResolver).toBeDefined()
	})

	it('fail-closes non-Bitcoin networks before transport', async () => {
		if (runeResolver == null)
			throw new Error('missing BitcoinRune resolver')

		await expect(
			runeResolver.resolve.NetworkRuneId.resolve({
				$network: {
					slug: 'liquid',
				},
				runeId: '840000:1',
			}, context)
		).rejects.toThrow(`${Source.UniSat_Rest}: unsupported Bitcoin network`)
		expect(getRuneInfo).not.toHaveBeenCalled()
	})

	it('maps inscription detail onto every enrolled UniSat field', async () => {
		if (inscriptionResolver == null)
			throw new Error('missing BitcoinOrdinalInscription resolver')

		const revealTxId = 'aa'.repeat(32)
		const inscriptionId = `${revealTxId}i0`
		const contentTxId = 'bb'.repeat(32)
		getInscriptionInfo.mockResolvedValueOnce({
			inscriptionId,
			inscriptionIndex: 0,
			contentType: 'text/plain',
			contentLength: 12,
			contentBody: 'Hello, world',
			inscriptionNumber: 1,
			height: 780000,
			timestamp: 1_700_000_000,
			offset: 0,
			address: 'bc1qinscription',
			utxo: {
				txid: contentTxId,
				vout: 1,
			},
		})

		const inscription = await inscriptionResolver.resolve.NetworkInscriptionId.resolve({
			$network: bitcoinNetwork,
			inscriptionId,
		}, context)

		expect(inscriptionResolver.projections.inscriptionIndex(inscription)).toBe(0)
		expect(inscriptionResolver.projections.$revealTransaction(inscription)).toEqual({
			[EntityMetaKey.Selector]: {
				$network: bitcoinNetwork,
				txId: revealTxId,
			},
		})
		expect(inscriptionResolver.projections.contentType(inscription)).toBe('text/plain')
		expect(inscriptionResolver.projections.contentLength(inscription)).toBe(12)
		expect(inscriptionResolver.projections.contentBody(inscription)).toBe('Hello, world')
		expect(inscriptionResolver.projections.inscriptionNumber(inscription)).toBe(1)
		expect(inscriptionResolver.projections.genesisHeight(inscription)).toBe(780000)
		expect(inscriptionResolver.projections.genesisTimestampMs(inscription)).toBe(1_700_000_000_000)
		expect(inscriptionResolver.projections.satOffset(inscription)).toBe(0)
		expect(inscriptionResolver.projections.$address(inscription)).toEqual({
			[EntityMetaKey.Selector]: {
				$network: bitcoinNetwork,
				address: 'bc1qinscription',
			},
		})
		expect(inscriptionResolver.projections.$contentOutput(inscription)).toEqual({
			[EntityMetaKey.Selector]: {
				$transaction: {
					$network: bitcoinNetwork,
					txId: contentTxId,
				},
				indexInTransaction: 1,
			},
		})
	})

	it('derives inscriptionIndex from inscriptionId when UniSat omits the wire index', async () => {
		if (inscriptionResolver == null)
			throw new Error('missing BitcoinOrdinalInscription resolver')

		const revealTxId = 'aa'.repeat(32)
		const inscriptionId = `${revealTxId}i7`
		getInscriptionInfo.mockResolvedValueOnce({
			inscriptionId,
			contentType: 'text/plain',
		})

		const inscription = await inscriptionResolver.resolve.NetworkInscriptionId.resolve({
			$network: bitcoinNetwork,
			inscriptionId,
		}, context)

		expect(inscriptionResolver.projections.inscriptionIndex(inscription)).toBe(7)
		expect(inscriptionResolver.projections.$revealTransaction(inscription)).toEqual({
			[EntityMetaKey.Selector]: {
				$network: bitcoinNetwork,
				txId: revealTxId,
			},
		})
	})

	it('exposes authoritative output inscription resolveCount from UniSat inscriptionsCount', async () => {
		if (outputInscriptionsResolver == null)
			throw new Error('missing UtxoOutput UniSat inscription facets')

		getUtxoInfo.mockResolvedValueOnce({
			txid: 'ee'.repeat(32),
			vout: 0,
			inscriptionsCount: 99,
			inscriptions: [
				{
					inscriptionId: `${'ff'.repeat(32)}i0`,
				},
				{
					inscriptionId: `${'ff'.repeat(32)}i1`,
				},
			],
		})

		const output = await outputInscriptionsResolver.resolve.TransactionIndexInTransaction.resolve({
			$transaction: {
				$network: bitcoinNetwork,
				txId: 'ee'.repeat(32),
			},
			indexInTransaction: 0,
		}, context)

		expect(
			outputInscriptionsResolver.projections.$$bitcoinOrdinalInscriptions.select(output)
		).toHaveLength(2)
		expect(
			outputInscriptionsResolver.projections.$$bitcoinOrdinalInscriptions.resolveCount(output)
		).toBe(99)
	})

	it('maps rune detail onto every enrolled UniSat field', async () => {
		if (runeResolver == null)
			throw new Error('missing BitcoinRune resolver')

		const etchingTxId = 'cc'.repeat(32)
		getRuneInfo.mockResolvedValueOnce({
			runeid: '840000:1',
			rune: 'UNCOMMONGOODS',
			spacedRune: 'UNCOMMON•GOODS',
			number: 1,
			height: 840000,
			txidx: 1,
			timestamp: 1_710_000_000,
			divisibility: 0,
			symbol: '⧉',
			etching: etchingTxId,
			premine: '0',
			mints: '100',
			burned: '0',
			supply: '1',
			holders: 42,
			transactions: 99,
			mintable: true,
			remaining: '500',
			terms: {
				amount: '1',
				cap: '1000',
				heightStart: 840000,
				heightEnd: 850000,
				offsetStart: 10,
				offsetEnd: 20,
			},
		})

		const rune = await runeResolver.resolve.NetworkRuneId.resolve({
			$network: bitcoinNetwork,
			runeId: '840000:1',
		}, context)

		expect(runeResolver.projections.rune(rune)).toBe('UNCOMMONGOODS')
		expect(runeResolver.projections.spacedRune(rune)).toBe('UNCOMMON•GOODS')
		expect(runeResolver.projections.number(rune)).toBe(1)
		expect(runeResolver.projections.symbol(rune)).toBe('⧉')
		expect(runeResolver.projections.divisibility(rune)).toBe(0)
		expect(runeResolver.projections.etchingHeight(rune)).toBe(840000)
		expect(runeResolver.projections.etchingTxIndex(rune)).toBe(1)
		expect(runeResolver.projections.etchingTimestampMs(rune)).toBe(1_710_000_000_000)
		expect(runeResolver.projections.$etchingTransaction(rune)).toEqual({
			[EntityMetaKey.Selector]: {
				$network: bitcoinNetwork,
				txId: etchingTxId,
			},
		})
		expect(runeResolver.projections.premine(rune)).toBe('0')
		expect(runeResolver.projections.supply(rune)).toBe('1')
		expect(runeResolver.projections.mints(rune)).toBe('100')
		expect(runeResolver.projections.burned(rune)).toBe('0')
		expect(runeResolver.projections.holders(rune)).toBe(42)
		expect(runeResolver.projections.transactions(rune)).toBe(99)
		expect(runeResolver.projections.mintable(rune)).toBe(true)
		expect(runeResolver.projections.remaining(rune)).toBe('500')
		expect(runeResolver.projections.termsAmount(rune)).toBe('1')
		expect(runeResolver.projections.termsCap(rune)).toBe('1000')
		expect(runeResolver.projections.termsHeightStart(rune)).toBe(840000)
		expect(runeResolver.projections.termsHeightEnd(rune)).toBe(850000)
		expect(runeResolver.projections.termsOffsetStart(rune)).toBe(10)
		expect(runeResolver.projections.termsOffsetEnd(rune)).toBe(20)
	})

	it('fail-closes when a rune is absent from a utxo balance list', async () => {
		if (balanceResolver == null)
			throw new Error('missing BitcoinRuneBalance resolver')

		getUtxoRuneBalances.mockResolvedValueOnce([
			{
				amount: '10',
				runeid: '840000:2',
			},
		])

		await expect(
			balanceResolver.resolve.UtxoOutputRune.resolve({
				$output: {
					$transaction: {
						$network: bitcoinNetwork,
						txId: 'dd'.repeat(32),
					},
					indexInTransaction: 0,
				},
				$rune: {
					$network: bitcoinNetwork,
					runeId: '840000:1',
				},
			}, context)
		).rejects.toThrow(`${Source.UniSat_Rest}: rune 840000:1 not on utxo`)
	})

	it('projects address inscription and rune-balance lists with authoritative totals', async () => {
		if (addressInscriptionsResolver == null || addressRuneBalancesResolver == null)
			throw new Error('missing UtxoAddress UniSat list facets')

		getAddressInscriptions.mockResolvedValueOnce({
			total: 41,
			start: 0,
			detail: [
				{
					inscriptionId: `${'aa'.repeat(32)}i0`,
					inscriptionNumber: 42,
					contentType: 'image/png',
					utxo: {
						txid: 'bb'.repeat(32),
						vout: 1,
						address: 'bc1qlist',
						satoshi: 10_000,
						scriptPk: '0014',
						scriptType: 'v0_p2wpkh',
					},
				},
			],
		})
		getAddressRuneBalances.mockResolvedValueOnce({
			total: 7,
			start: 0,
			detail: [
				{
					amount: '3',
					runeid: '840000:1',
					divisibility: 0,
					symbol: '⧉',
				},
			],
		})

		const addressSelector = {
			$network: bitcoinNetwork,
			address: 'bc1qlist',
		}
		const inscriptionPage = await addressInscriptionsResolver.resolve.NetworkAddress.resolve(
			addressSelector,
			context
		)
		expect(
			addressInscriptionsResolver.projections.$$bitcoinOrdinalInscriptions.select(inscriptionPage)
		).toMatchObject([
			{
				[EntityMetaKey.Selector]: {
					$network: bitcoinNetwork,
					inscriptionId: `${'aa'.repeat(32)}i0`,
				},
				[EntityMetaKey.Fields]: expect.objectContaining({
					[entityFieldAddressKey(EntityType.BitcoinOrdinalInscription, [], 'inscriptionIndex')]: 0,
					[entityFieldAddressKey(EntityType.BitcoinOrdinalInscription, [], 'inscriptionNumber')]: 42,
					[entityFieldAddressKey(EntityType.BitcoinOrdinalInscription, [], 'contentType')]: 'image/png',
					[entityFieldAddressKey(EntityType.BitcoinOrdinalInscription, [], '$contentOutput')]: expect.objectContaining({
						[EntityMetaKey.Selector]: {
							$transaction: {
								$network: bitcoinNetwork,
								txId: 'bb'.repeat(32),
							},
							indexInTransaction: 1,
						},
						[EntityMetaKey.Fields]: expect.objectContaining({
							[entityFieldAddressKey(EntityType.UtxoOutput, [], 'valueSats')]: 10_000n,
						}),
					}),
				}),
			},
		])
		expect(
			addressInscriptionsResolver.projections.$$bitcoinOrdinalInscriptions.resolveCount(inscriptionPage)
		).toBe(41)
		expect(getAddressInscriptions).toHaveBeenCalledWith(context.publicEnv, {
			address: 'bc1qlist',
			cursor: 0,
			size: 16,
		})

		const runePage = await addressRuneBalancesResolver.resolve.NetworkAddress.resolve(
			addressSelector,
			context
		)
		expect(
			addressRuneBalancesResolver.projections.$$bitcoinRuneBalances.select(runePage)
		).toMatchObject([
			{
				[EntityMetaKey.Selector]: {
					$address: addressSelector,
					$rune: {
						$network: bitcoinNetwork,
						runeId: '840000:1',
					},
				},
				[EntityMetaKey.Fields]: expect.objectContaining({
					[entityFieldAddressKey(EntityType.BitcoinRuneBalance, [], 'amount')]: '3',
					[entityFieldAddressKey(EntityType.BitcoinRuneBalance, [], 'divisibility')]: 0,
					[entityFieldAddressKey(EntityType.BitcoinRuneBalance, [], 'symbol')]: '⧉',
					[entityFieldAddressKey(EntityType.BitcoinRuneBalance, [], '$rune')]: {
						[EntityMetaKey.Selector]: {
							$network: bitcoinNetwork,
							runeId: '840000:1',
						},
						[EntityMetaKey.Fields]: {
							[entityFieldAddressKey(EntityType.BitcoinRune, [], 'divisibility')]: 0,
							[entityFieldAddressKey(EntityType.BitcoinRune, [], 'symbol')]: '⧉',
						},
					},
				}),
			},
		])
		expect(
			addressRuneBalancesResolver.projections.$$bitcoinRuneBalances.resolveCount(runePage)
		).toBe(7)
		expect(getAddressRuneBalances).toHaveBeenCalledWith(context.publicEnv, {
			address: 'bc1qlist',
			start: 0,
			limit: 16,
		})
	})

	it('preserves UniSat inscription and rune-balance list continuation tokens', async () => {
		if (addressInscriptionsResolver == null || addressRuneBalancesResolver == null)
			throw new Error('missing UtxoAddress UniSat list facets')

		getAddressInscriptions.mockResolvedValueOnce({
			total: 41,
			start: 16,
			detail: [
				{
					inscriptionId: `${'cc'.repeat(32)}i0`,
				},
			],
		})
		getAddressRuneBalances.mockResolvedValueOnce({
			total: 7,
			start: 16,
			detail: [
				{
					amount: '1',
					runeid: '840000:2',
				},
			],
		})

		const addressSelector = {
			$network: bitcoinNetwork,
			address: 'bc1qpage',
		}
		const inscriptionPage = await addressInscriptionsResolver.resolve.NetworkAddress.resolve(
			addressSelector,
			{
				...context,
				providerContinuationToken: '16',
			}
		)
		expect(getAddressInscriptions).toHaveBeenCalledWith(context.publicEnv, {
			address: 'bc1qpage',
			cursor: 16,
			size: 16,
		})
		expect(
			addressInscriptionsResolver.projections.$$bitcoinOrdinalInscriptions.continuation?.(inscriptionPage)
		).toEqual({
			operation: 'address-inscriptions',
			target: 'bc1qpage',
			terminal: false,
			token: '17',
		})

		const runePage = await addressRuneBalancesResolver.resolve.NetworkAddress.resolve(
			addressSelector,
			{
				...context,
				providerContinuationToken: '16',
			}
		)
		expect(getAddressRuneBalances).toHaveBeenCalledWith(context.publicEnv, {
			address: 'bc1qpage',
			start: 16,
			limit: 16,
		})
		expect(
			addressRuneBalancesResolver.projections.$$bitcoinRuneBalances.continuation?.(runePage)
		).toEqual({
			operation: 'address-rune-balances',
			target: 'bc1qpage',
			terminal: true,
		})
	})

	it('fail-closes invalid UniSat list continuation tokens', async () => {
		if (addressInscriptionsResolver == null)
			throw new Error('missing UtxoAddress UniSat inscription facets')

		await expect(
			addressInscriptionsResolver.resolve.NetworkAddress.resolve({
				$network: bitcoinNetwork,
				address: 'bc1qbad',
			}, {
				...context,
				providerContinuationToken: 'not-a-number',
			})
		).rejects.toThrow(`${Source.UniSat_Rest}: invalid inscription list continuation`)
	})

	it('projects output inscriptions plus enrolled utxo wire fields from UniSat indexer', async () => {
		if (outputInscriptionsResolver == null)
			throw new Error('missing UtxoOutput UniSat inscription facets')

		const $transaction = {
			$network: bitcoinNetwork,
			txId: 'ee'.repeat(32),
		}
		getUtxoInfo.mockResolvedValueOnce({
			txid: $transaction.txId,
			vout: 2,
			satoshi: 546,
			scriptType: 'p2tr',
			scriptPk: '5120ab',
			address: 'bc1poutput',
			isSpent: false,
			inscriptions: [
				{
					inscriptionId: `${'ff'.repeat(32)}i1`,
				},
			],
		})

		const output = await outputInscriptionsResolver.resolve.TransactionIndexInTransaction.resolve({
			$transaction,
			indexInTransaction: 2,
		}, context)

		expect(
			outputInscriptionsResolver.projections.$$bitcoinOrdinalInscriptions.select(output)
		).toMatchObject([
			{
				[EntityMetaKey.Selector]: {
					$network: bitcoinNetwork,
					inscriptionId: `${'ff'.repeat(32)}i1`,
				},
			},
		])
		expect(
			outputInscriptionsResolver.projections.$$bitcoinOrdinalInscriptions.resolveCount(output)
		).toBe(1)
		expect(outputInscriptionsResolver.projections.valueSats(output)).toBe(546n)
		expect(outputInscriptionsResolver.projections.scriptPubKeyType(output)).toBe('p2tr')
		expect(outputInscriptionsResolver.projections.scriptPubKeyHex(output)).toBe('5120ab')
		expect(outputInscriptionsResolver.projections.isSpent(output)).toBe(false)
		expect(outputInscriptionsResolver.projections.$address(output)).toEqual({
			[EntityMetaKey.Selector]: {
				$network: bitcoinNetwork,
				address: 'bc1poutput',
			},
		})
	})

	it('projects output rune-balance lists', async () => {
		if (outputRuneBalancesResolver == null)
			throw new Error('missing UtxoOutput UniSat rune balance facets')

		const $transaction = {
			$network: bitcoinNetwork,
			txId: 'ee'.repeat(32),
		}
		getUtxoRuneBalances.mockResolvedValueOnce([
			{
				amount: '7',
				runeid: '840000:9',
			},
		])

		const output = await outputRuneBalancesResolver.resolve.TransactionIndexInTransaction.resolve({
			$transaction,
			indexInTransaction: 2,
		}, context)
		expect(
			outputRuneBalancesResolver.projections.$$bitcoinRuneBalances.select(output)
		).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$output: {
						$transaction,
						indexInTransaction: 2,
					},
					$rune: {
						$network: bitcoinNetwork,
						runeId: '840000:9',
					},
				},
				[EntityMetaKey.Fields]: expect.objectContaining({
					[entityFieldAddressKey(EntityType.BitcoinRuneBalance, [], 'amount')]: '7',
				}),
			},
		])
		expect(
			outputRuneBalancesResolver.projections.$$bitcoinRuneBalances.resolveCount(output)
		).toBe(1)
	})

	it('returns an empty inscription list and marks spent when UniSat utxo info is null', async () => {
		if (outputInscriptionsResolver == null)
			throw new Error('missing UtxoOutput UniSat inscription facets')

		getUtxoInfo.mockResolvedValueOnce(null)

		const output = await outputInscriptionsResolver.resolve.TransactionIndexInTransaction.resolve({
			$transaction: {
				$network: bitcoinNetwork,
				txId: '11'.repeat(32),
			},
			indexInTransaction: 0,
		}, context)
		expect(
			outputInscriptionsResolver.projections.$$bitcoinOrdinalInscriptions.select(output)
		).toEqual([])
		expect(
			outputInscriptionsResolver.projections.$$bitcoinOrdinalInscriptions.resolveCount(output)
		).toBe(0)
		expect(outputInscriptionsResolver.projections.isSpent(output)).toBe(true)
	})

	it('projects address and output rune balance detail rows', async () => {
		if (balanceResolver == null)
			throw new Error('missing BitcoinRuneBalance resolver')

		getUtxoRuneBalances.mockResolvedValueOnce([
			{
				amount: '10',
				runeid: '840000:1',
				divisibility: 2,
				symbol: 'R',
			},
		])
		getAddressRuneBalance.mockResolvedValueOnce({
			amount: '4',
			runeid: '840000:1',
			divisibility: 2,
			symbol: 'R',
		})

		const $output = {
			$transaction: {
				$network: bitcoinNetwork,
				txId: '22'.repeat(32),
			},
			indexInTransaction: 0,
		}
		const $rune = {
			$network: bitcoinNetwork,
			runeId: '840000:1',
		}
		const $address = {
			$network: bitcoinNetwork,
			address: 'bc1qbalance',
		}

		const utxoBalance = await balanceResolver.resolve.UtxoOutputRune.resolve({
			$output,
			$rune,
		}, context)
		expect(balanceResolver.projections.amount(utxoBalance)).toBe('10')
		expect(balanceResolver.projections.divisibility(utxoBalance)).toBe(2)
		expect(balanceResolver.projections.symbol(utxoBalance)).toBe('R')
		expect(balanceResolver.projections.$output(utxoBalance)).toEqual({
			[EntityMetaKey.Selector]: $output,
		})

		const addressBalance = await balanceResolver.resolve.UtxoAddressRune.resolve({
			$address,
			$rune,
		}, context)
		expect(balanceResolver.projections.amount(addressBalance)).toBe('4')
		expect(balanceResolver.projections.$address(addressBalance)).toEqual({
			[EntityMetaKey.Selector]: $address,
		})
		expect(getAddressRuneBalance).toHaveBeenCalledWith(context.publicEnv, {
			address: 'bc1qbalance',
			runeId: '840000:1',
		})
		expect(getAddressRuneBalances).not.toHaveBeenCalled()
	})
})
