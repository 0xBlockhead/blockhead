import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import { Source } from '$/sources/Source.ts'
import bindings from '$/sources/StellarExpert/bindings.ts'

const getJson = vi.hoisted(() => vi.fn())
const getText = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_shared/wire/HttpRest/client.ts', () => ({
	getJson,
	getText,
}))

const queries = await import('$/sources/StellarExpert/Rest/queries.ts')
const {
	getAllAssets,
	getAssetRating,
	getAssetSupply,
	getSequenceFromTimestamp,
	getTimestampFromSequence,
} = queries
const binding = bindings[Source.StellarExpert][0]

describe('StellarExpert OpenAPI operations', () => {
	beforeEach(() => {
		getJson.mockReset()
		getText.mockReset()
	})

	it('queries the asset catalog with documented search, ordering, and paging parameters', async () => {
		getJson.mockResolvedValue({
			_embedded: {
				records: [],
			},
		})

		await getAllAssets({
			network: 'public',
			search: 'dollar',
			sort: 'rating',
			order: 'desc',
			limit: 25,
			cursor: 10,
		})

		expect(getJson).toHaveBeenCalledWith(
			binding,
			'/explorer/public/asset?search=dollar&sort=rating&order=desc&limit=25&cursor=10'
		)
	})

	it('omits an empty asset query instead of emitting a meaningless suffix', async () => {
		getJson.mockResolvedValue({})

		await getAllAssets({ network: 'testnet' })

		expect(getJson).toHaveBeenCalledWith(
			binding,
			'/explorer/testnet/asset'
		)
	})

	it('queries asset rating with an encoded asset path', async () => {
		getJson.mockResolvedValue({
			asset: 'USDC-GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN',
			rating: {
				average: 8.1,
			},
		})

		await getAssetRating({
			network: 'public',
			asset: 'USDC-GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN',
		})

		expect(getJson).toHaveBeenCalledWith(
			binding,
			'/explorer/public/asset/USDC-GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN/rating'
		)
	})

	it('rejects an empty asset path before I/O', () => {
		expect(() => getAssetRating({
			network: 'public',
			asset: '',
		})).toThrow('asset path is empty')
		expect(() => getAssetSupply({
			network: 'public',
			asset: '',
		})).toThrow('asset path is empty')
		expect(getJson).not.toHaveBeenCalled()
		expect(getText).not.toHaveBeenCalled()
	})

	it('queries asset supply as plain text', async () => {
		getText.mockResolvedValue('1203229.6298700')

		await expect(getAssetSupply({
			network: 'public',
			asset: 'EURT-GAP5LETOV6YIE62YAM56STDANPRDO7ZFDBGSNHJQIYGGKSMOZAHOOS2S',
		})).resolves.toBe('1203229.6298700')
		expect(getText).toHaveBeenCalledWith(
			binding,
			'/explorer/public/asset/EURT-GAP5LETOV6YIE62YAM56STDANPRDO7ZFDBGSNHJQIYGGKSMOZAHOOS2S/supply'
		)
	})

	it('queries a ledger sequence by timestamp', async () => {
		getJson.mockResolvedValue({
			sequence: 42_431_435,
			timestamp: 1_661_781_078,
			date: '2022-08-29T13:51:18.000Z',
		})

		await getSequenceFromTimestamp({
			network: 'public',
			timestamp: 1_661_781_078,
		})

		expect(getJson).toHaveBeenCalledWith(
			binding,
			'/explorer/public/ledger/sequence-from-timestamp?timestamp=1661781078'
		)
	})

	it('queries a ledger close timestamp by exact sequence', async () => {
		getJson.mockResolvedValue({
			sequence: 42_431_435,
			timestamp: 1_661_781_078,
			date: '2022-08-29T13:51:18.000Z',
		})

		await getTimestampFromSequence({
			network: 'public',
			sequence: 42_431_435,
		})

		expect(getJson).toHaveBeenCalledWith(
			binding,
			'/explorer/public/ledger/timestamp-from-sequence?sequence=42431435'
		)
	})

	it('propagates HTTP failures from getJson and getText without soft-empty fallbacks', async () => {
		getJson.mockRejectedValue(new Error('HTTP 404: Not Found'))
		getText.mockRejectedValue(new Error('HTTP 502: Bad Gateway'))

		await expect(getAssetRating({
			network: 'public',
			asset: 'MISSING-GAKP6AHQM4JDI55SK2FGEPLOZU7BTEODS3Y5QNT3VMQQIU3WM99T0L4C',
		})).rejects.toThrow('HTTP 404')
		await expect(getAssetSupply({
			network: 'public',
			asset: 'MISSING-GAKP6AHQM4JDI55SK2FGEPLOZU7BTEODS3Y5QNT3VMQQIU3WM99T0L4C',
		})).rejects.toThrow('HTTP 502')
		await expect(getSequenceFromTimestamp({
			network: 'public',
			timestamp: 0,
		})).rejects.toThrow('HTTP 404')
	})

	it('exports only product-relevant endpoint operations', () => {
		expect(Object.keys(queries).sort()).toEqual([
			'getAllAssets',
			'getAssetRating',
			'getAssetSupply',
			'getSequenceFromTimestamp',
			'getTimestampFromSequence',
		])
	})
})
