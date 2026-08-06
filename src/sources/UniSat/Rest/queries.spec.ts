import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import { Source } from '$/sources/Source.ts'

const sourceFetch = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_runtime/http.ts', async (importOriginal) => ({
	...await importOriginal<typeof import('$/sources/_runtime/http.ts')>(),
	sourceFetch,
}))

const {
	getAddressInscriptions,
	getAddressRuneBalances,
	getInscriptionInfo,
	getRuneInfo,
	getUtxoInfo,
	getUtxoRuneBalances,
} = await import('$/sources/UniSat/Rest/queries.ts')


const publicEnv = {
	PUBLIC_UNISAT_API_KEY: 'test-unisat-key',
}

const okJson = (
	data: unknown
) => ({
	ok: true,
	json: async () => ({
		code: 0 as const,
		msg: 'OK',
		data,
	}),
})


describe('UniSat Rest queries', () => {
	beforeEach(() => {
		sourceFetch.mockReset()
	})

	it('getInscriptionInfo requests the docs path with Bearer auth', async () => {
		sourceFetch.mockResolvedValueOnce(okJson({
			inscriptionId: 'aa'.repeat(32) + 'i0',
			contentType: 'text/plain',
		}))

		await expect(
			getInscriptionInfo(publicEnv, {
				inscriptionId: 'aa'.repeat(32) + 'i0',
			})
		).resolves.toMatchObject({
			inscriptionId: 'aa'.repeat(32) + 'i0',
			contentType: 'text/plain',
		})

		expect(sourceFetch).toHaveBeenCalledWith(
			expect.anything(),
			'https://open-api.unisat.io/v1/indexer/inscription/info/' + encodeURIComponent('aa'.repeat(32) + 'i0'),
			{
				headers: {
					Authorization: 'Bearer test-unisat-key',
					accept: 'application/json',
				},
			}
		)
	})

	it('getRuneInfo fail-closes on missing runeId and envelope errors', async () => {
		await expect(
			getRuneInfo(publicEnv, {
				runeId: '',
			})
		).rejects.toThrow(`${Source.UniSat_Rest}: missing runeId`)

		sourceFetch.mockResolvedValueOnce({
			ok: true,
			json: async () => ({
				code: -1 as const,
				msg: 'not found',
				data: null,
			}),
		})

		await expect(
			getRuneInfo(publicEnv, {
				runeId: '840000:1',
			})
		).rejects.toThrow(`${Source.UniSat_Rest}: not found`)
	})

	it('getUtxoRuneBalances and address list queries reject invalid pagination', async () => {
		await expect(
			getUtxoRuneBalances(publicEnv, {
				txId: 'aa'.repeat(32),
				outputIndex: -1,
			})
		).rejects.toThrow(`${Source.UniSat_Rest}: invalid outputIndex`)

		await expect(
			getAddressRuneBalances(publicEnv, {
				address: 'bc1qexample',
				limit: 0,
			})
		).rejects.toThrow(`${Source.UniSat_Rest}: limit must be 1..500`)

		await expect(
			getAddressInscriptions(publicEnv, {
				address: '',
			})
		).rejects.toThrow(`${Source.UniSat_Rest}: missing address`)
	})

	it('getUtxoRuneBalances hits the runes utxo balance path', async () => {
		sourceFetch.mockResolvedValueOnce(okJson([
			{
				amount: '100',
				runeid: '840000:1',
			},
		]))

		await expect(
			getUtxoRuneBalances(publicEnv, {
				txId: 'bb'.repeat(32),
				outputIndex: 2,
			})
		).resolves.toEqual([
			{
				amount: '100',
				runeid: '840000:1',
			},
		])

		expect(sourceFetch.mock.calls[0]?.[1]).toBe(
			`https://open-api.unisat.io/v1/indexer/runes/utxo/${'bb'.repeat(32)}/2/balance`
		)
	})

	it('getUtxoInfo hits the utxo detail path and accepts null spent data', async () => {
		sourceFetch.mockResolvedValueOnce(okJson({
			txid: 'cc'.repeat(32),
			vout: 1,
			inscriptions: [
				{
					inscriptionId: `${'dd'.repeat(32)}i0`,
				},
			],
		}))

		await expect(
			getUtxoInfo(publicEnv, {
				txId: 'cc'.repeat(32),
				outputIndex: 1,
			})
		).resolves.toMatchObject({
			txid: 'cc'.repeat(32),
			vout: 1,
			inscriptions: [
				{
					inscriptionId: `${'dd'.repeat(32)}i0`,
				},
			],
		})
		expect(sourceFetch.mock.calls[0]?.[1]).toBe(
			`https://open-api.unisat.io/v1/indexer/utxo/${'cc'.repeat(32)}/1`
		)

		sourceFetch.mockResolvedValueOnce(okJson(null))
		await expect(
			getUtxoInfo(publicEnv, {
				txId: 'cc'.repeat(32),
				outputIndex: 1,
			})
		).resolves.toBeNull()
	})

	it('getAddressInscriptions and getAddressRuneBalances hit list paths', async () => {
		sourceFetch.mockResolvedValueOnce(okJson({
			total: 0,
			start: 0,
			detail: [],
		}))
		await getAddressInscriptions(publicEnv, {
			address: 'bc1qexample',
			cursor: 4,
			size: 8,
		})
		expect(sourceFetch.mock.calls[0]?.[1]).toBe(
			'https://open-api.unisat.io/v1/indexer/address/bc1qexample/inscription-data?cursor=4&size=8'
		)

		sourceFetch.mockResolvedValueOnce(okJson({
			total: 0,
			start: 0,
			detail: [],
		}))
		await getAddressRuneBalances(publicEnv, {
			address: 'bc1qexample',
			start: 2,
			limit: 10,
		})
		expect(sourceFetch.mock.calls[1]?.[1]).toBe(
			'https://open-api.unisat.io/v1/indexer/address/bc1qexample/runes/balance-list?start=2&limit=10'
		)
	})
})
