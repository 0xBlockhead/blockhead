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
})
