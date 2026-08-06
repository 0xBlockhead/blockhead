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
const getUtxoRuneBalances = vi.hoisted(() => vi.fn())
const getAddressRuneBalances = vi.hoisted(() => vi.fn())
const getAddressInscriptions = vi.hoisted(() => vi.fn())

vi.mock('$/sources/UniSat/Rest/queries.ts', () => ({
	getInscriptionInfo,
	getRuneInfo,
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
		getUtxoRuneBalances.mockReset()
		getAddressRuneBalances.mockReset()
		getAddressInscriptions.mockReset()
	})

	it('registers under UniSat_Rest', () => {
		expect(uniSatRest.source).toBe(Source.UniSat_Rest)
		expect(inscriptionResolver).toBeDefined()
		expect(runeResolver).toBeDefined()
		expect(balanceResolver).toBeDefined()
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

	it('maps inscription and rune indexer snapshots', async () => {
		if (inscriptionResolver == null || runeResolver == null)
			throw new Error('missing UniSat entity resolvers')

		const inscriptionId = `${'aa'.repeat(32)}i0`
		getInscriptionInfo.mockResolvedValueOnce({
			inscriptionId,
			contentType: 'text/plain',
			inscriptionNumber: 1,
			height: 780000,
			timestamp: 1_700_000_000,
			utxo: {
				txid: 'bb'.repeat(32),
				vout: 1,
			},
		})
		getRuneInfo.mockResolvedValueOnce({
			runeid: '840000:1',
			rune: 'UNCOMMONGOODS',
			spacedRune: 'UNCOMMON•GOODS',
			divisibility: 0,
			etching: 'cc'.repeat(32),
			supply: '1',
		})

		const inscription = await inscriptionResolver.resolve.NetworkInscriptionId.resolve({
			$network: bitcoinNetwork,
			inscriptionId,
		}, context)
		expect(inscriptionResolver.projections.contentType(inscription)).toBe('text/plain')
		expect(inscriptionResolver.projections.$contentOutput(inscription)).toEqual({
			[EntityMetaKey.Selector]: {
				$transaction: {
					$network: bitcoinNetwork,
					txId: 'bb'.repeat(32),
				},
				indexInTransaction: 1,
			},
		})

		const rune = await runeResolver.resolve.NetworkRuneId.resolve({
			$network: bitcoinNetwork,
			runeId: '840000:1',
		}, context)
		expect(runeResolver.projections.spacedRune(rune)).toBe('UNCOMMON•GOODS')
		expect(runeResolver.projections.$etchingTransaction(rune)).toEqual({
			[EntityMetaKey.Selector]: {
				$network: bitcoinNetwork,
				txId: 'cc'.repeat(32),
			},
		})
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
})
