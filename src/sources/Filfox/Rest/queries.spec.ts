import { beforeEach, describe, expect, it, vi } from 'vitest'

import bindings from '$/sources/Filfox/bindings.ts'
import { Source } from '$/sources/Source.ts'

const sourceGetJson = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_runtime/http.ts', () => ({
	firstHttpUrlForBinding: (binding: {
		endpoints: {
			locator: string
		}[]
	}) => binding.endpoints[0]?.locator,
	sourceGetJson,
}))

const {
	getAddress,
	getBlock,
	getBlockMessages,
	getDeal,
	getDeals,
	getMessage,
	getOverview,
	getTipset,
} = await import('$/sources/Filfox/Rest/queries.ts')

const binding = bindings[Source.Filfox_Rest][0]

describe('Filfox REST queries', () => {
	beforeEach(() => {
		sourceGetJson.mockReset()
		sourceGetJson.mockResolvedValue({})
	})

	it('appends the API-family prefix for every product endpoint', async () => {
		await getTipset({
			height: 42n,
		})
		await getMessage({
			messageCid: 'bafy-message',
		})
		await getBlock({
			blockCid: 'bafy-block',
		})
		await getBlockMessages({
			blockCid: 'bafy-block',
			pageSize: 16,
		})
		await getAddress({
			address: 'f01234',
		})
		await getOverview()
		await getDeals({
			page: 3,
			pageSize: 16,
		})
		await getDeal({
			dealId: 42n,
		})

		expect(sourceGetJson.mock.calls).toEqual([
			[
				binding,
				'https://filfox.info/api/v1/tipset/42',
			],
			[
				binding,
				'https://filfox.info/api/v1/message/bafy-message',
			],
			[
				binding,
				'https://filfox.info/api/v1/block/bafy-block',
			],
			[
				binding,
				'https://filfox.info/api/v1/block/bafy-block/messages?pageSize=16',
			],
			[
				binding,
				'https://filfox.info/api/v1/address/f01234',
			],
			[
				binding,
				'https://filfox.info/api/v1/overview',
			],
			[
				binding,
				'https://filfox.info/api/v1/deal/list?pageSize=16&page=3',
			],
			[
				binding,
				'https://filfox.info/api/v1/deal/42',
			],
		])
	})

	it('hard-fails when sourceGetJson rejects instead of soft-emptying', async () => {
		sourceGetJson.mockRejectedValueOnce(new Error('GET https://filfox.info/api/v1/message/missing → 404'))

		await expect(getMessage({
			messageCid: 'missing',
		})).rejects.toThrow('404')
		expect(sourceGetJson).toHaveBeenCalledTimes(1)
	})

	it('returns typed deal list and detail responses unchanged', async () => {
		sourceGetJson
			.mockResolvedValueOnce({
				totalCount: 1,
				deals: [{
					id: 42,
					height: 100,
					timestamp: 1_700_000_000,
					pieceSize: 2048,
					verifiedDeal: true,
					client: 'f1client',
					provider: 'f01000',
					startEpoch: 101,
					startTimestamp: 1_700_000_030,
					endEpoch: 201,
					endTimestamp: 1_700_003_030,
					stroagePrice: '0',
				}],
			})
			.mockResolvedValueOnce({
				id: 42,
				height: 100,
				timestamp: 1_700_000_000,
				pieceCid: 'baga-piece',
				pieceSize: 2048,
				verifiedDeal: true,
				client: 'f1client',
				clientTag: {
					name: 'Official',
					signed: false,
				},
				provider: 'f01000',
				providerTag: {
					name: 'Official',
					signed: false,
				},
				startEpoch: 101,
				startTimestamp: 1_700_000_030,
				endEpoch: 201,
				endTimestamp: 1_700_003_030,
				storagePricePerEpoch: '0',
				stroagePrice: '0',
				clientCollateral: '1',
				providerCollateral: '2',
			})

		await expect(getDeals({
			page: 0,
			pageSize: 1,
		})).resolves.toMatchObject({
			totalCount: 1,
			deals: [{
				id: 42,
				stroagePrice: '0',
			}],
		})
		await expect(getDeal({
			dealId: 42n,
		})).resolves.toMatchObject({
			id: 42,
			storagePricePerEpoch: '0',
			clientCollateral: '1',
			providerCollateral: '2',
		})
	})
})
