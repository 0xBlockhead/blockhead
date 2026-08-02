import { beforeEach, describe, expect, it, vi } from 'vitest'

import bindings from '$/sources/TronFullNode/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceTargetKind } from '$/sources/SourceBinding.ts'

const sourceFetch = vi.fn()

vi.mock('$/sources/_runtime/http.ts', () => ({
	firstHttpUrlForBinding: (binding: { endpoints: { locator: string }[] }) => binding.endpoints[0]?.locator,
	sourceFetch,
}))

const { getBlockByNumber } = await import('$/sources/TronFullNode/Rest/queries.ts')

const binding = bindings[Source.TronFullNode_Rest][0]

describe('TRON local FullNode transport', () => {
	beforeEach(() => {
		sourceFetch.mockReset()
		sourceFetch.mockResolvedValue(new Response(JSON.stringify({
			blockID: 'block',
		}), {
			status: 200,
		}))
	})

	it('uses the exact generated binding for endpoint and delivery authority', async () => {
		await getBlockByNumber({
			binding,
			height: 7n,
		})

		expect(sourceFetch).toHaveBeenCalledWith(
			binding,
			'http://127.0.0.1:8090/wallet/getblockbynum',
			expect.objectContaining({
				method: 'POST',
			})
		)
	})
})
