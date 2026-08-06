import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import { networkBySlug } from '$/constants/Network.ts'
import { EntityMetaKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

const getInscriptionInfo = vi.hoisted(() => vi.fn())
const getRuneInfo = vi.hoisted(() => vi.fn())
const getUtxoInfo = vi.hoisted(() => vi.fn())
const getUtxoRuneBalances = vi.hoisted(() => vi.fn())
const getAddressRuneBalances = vi.hoisted(() => vi.fn())
const getAddressInscriptions = vi.hoisted(() => vi.fn())

vi.mock('$/sources/UniSat/Rest/queries.ts', () => ({
	getInscriptionInfo,
	getRuneInfo,
	getUtxoInfo,
	getUtxoRuneBalances,
	getAddressRuneBalances,
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
const addressResolver = uniSatRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.UtxoAddress
	&& '$$bitcoinOrdinalInscriptions' in resolver.projections
))
const outputResolver = uniSatRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.UtxoOutput
	&& '$$bitcoinRuneBalances' in resolver.projections
))

const context = {
	filters: [],
	sorts: [],
	pagination: {
		limit: 16,
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
		getAddressInscriptions.mockReset()
	})

	it('registers under UniSat_Rest', () => {
		expect(uniSatRest.source).toBe(Source.UniSat_Rest)
		expect(inscriptionResolver).toBeDefined()
		expect(runeResolver).toBeDefined()
		expect(balanceResolver).toBeDefined()
		expect(addressResolver).toBeDefined()
		expect(outputResolver).toBeDefined()
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
		expect(runeResolver.projections.etchingTimestampMs(rune)).toBe(1_710_000_000_000)
		expect(runeResolver.projections.$etchingTransaction(rune)).toEqual({
			[EntityMetaKey.Selector]: {
				$network: bitcoinNetwork,
				txId: etchingTxId,
			},
		})
		expect(runeResolver.projections.premine(rune)).toBe('0')
		expect(runeResolver.projections.supply(rune)).toBe('1')
		expect(runeResolver.projections.holders(rune)).toBe(42)
		expect(runeResolver.projections.mintable(rune)).toBe(true)
		expect(runeResolver.projections.remaining(rune)).toBe('500')
		expect(runeResolver.projections.termsAmount(rune)).toBe('1')
		expect(runeResolver.projections.termsCap(rune)).toBe('1000')
		expect(runeResolver.projections.termsHeightStart(rune)).toBe(840000)
		expect(runeResolver.projections.termsHeightEnd(rune)).toBe(850000)
		expect(rune).not.toHaveProperty('etchingTxIndex')
		expect(rune).not.toHaveProperty('mints')
		expect(rune).not.toHaveProperty('burned')
		expect(rune).not.toHaveProperty('transactions')
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

	it('projects address inscription and rune-balance lists', async () => {
		if (addressResolver == null)
			throw new Error('missing UtxoAddress UniSat list facets')

		getAddressInscriptions.mockResolvedValueOnce({
			total: 1,
			start: 0,
			detail: [
				{
					inscriptionId: `${'aa'.repeat(32)}i0`,
				},
			],
		})
		getAddressRuneBalances.mockResolvedValueOnce({
			total: 1,
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
		expect(
			await addressResolver.projections.$$bitcoinOrdinalInscriptions.resolve(addressSelector, context)
		).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$network: bitcoinNetwork,
					inscriptionId: `${'aa'.repeat(32)}i0`,
				},
			},
		])
		expect(
			await addressResolver.projections.$$bitcoinRuneBalances.resolve(addressSelector, context)
		).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$address: addressSelector,
					$rune: {
						$network: bitcoinNetwork,
						runeId: '840000:1',
					},
				},
			},
		])
	})

	it('projects output inscription and rune-balance lists', async () => {
		if (outputResolver == null)
			throw new Error('missing UtxoOutput UniSat list facets')

		const $transaction = {
			$network: bitcoinNetwork,
			txId: 'ee'.repeat(32),
		}
		getUtxoInfo.mockResolvedValueOnce({
			txid: $transaction.txId,
			vout: 2,
			inscriptions: [
				{
					inscriptionId: `${'ff'.repeat(32)}i1`,
				},
			],
		})
		getUtxoRuneBalances.mockResolvedValueOnce([
			{
				amount: '7',
				runeid: '840000:9',
			},
		])

		expect(
			await outputResolver.projections.$$bitcoinOrdinalInscriptions.resolve({
				$transaction,
				indexInTransaction: 2,
			}, context)
		).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$network: bitcoinNetwork,
					inscriptionId: `${'ff'.repeat(32)}i1`,
				},
			},
		])
		expect(
			await outputResolver.projections.$$bitcoinRuneBalances.resolve({
				$transaction,
				indexInTransaction: 2,
			}, context)
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
			},
		])
	})

	it('returns an empty inscription list when UniSat utxo info is null (spent+confirmed)', async () => {
		if (outputResolver == null)
			throw new Error('missing UtxoOutput UniSat list facets')

		getUtxoInfo.mockResolvedValueOnce(null)

		expect(
			await outputResolver.projections.$$bitcoinOrdinalInscriptions.resolve({
				$transaction: {
					$network: bitcoinNetwork,
					txId: '11'.repeat(32),
				},
				indexInTransaction: 0,
			}, context)
		).toEqual([])
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
		getAddressRuneBalances.mockResolvedValueOnce({
			total: 1,
			start: 0,
			detail: [
				{
					amount: '4',
					runeid: '840000:1',
					divisibility: 2,
					symbol: 'R',
				},
			],
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
	})
})
