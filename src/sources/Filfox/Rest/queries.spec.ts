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
		])
	})

	it('hard-fails when sourceGetJson rejects instead of soft-emptying', async () => {
		sourceGetJson.mockRejectedValueOnce(new Error('GET https://filfox.info/api/v1/message/missing → 404'))

		await expect(getMessage({
			messageCid: 'missing',
		})).rejects.toThrow('404')
		expect(sourceGetJson).toHaveBeenCalledTimes(1)
	})
})
