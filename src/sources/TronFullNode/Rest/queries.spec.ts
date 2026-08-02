import { beforeEach, describe, expect, it, vi } from 'vitest'

import bindings from '$/sources/TronFullNode/bindings.ts'
import { Source } from '$/sources/Source.ts'
import tronSolidityNodeBindings from '$/sources/TronSolidityNode/bindings.ts'

const sourceFetch = vi.fn()

vi.mock('$/sources/_runtime/http.ts', () => ({
	firstHttpUrlForBinding: (binding: { endpoints: { locator: string }[] }) => binding.endpoints[0]?.locator,
	sourceFetch,
}))

const { getBlockByNumber: getFullNodeBlockByNumber } = await import('$/sources/TronFullNode/Rest/queries.ts')
const { getBlockByNumber: getSolidityNodeBlockByNumber } = await import('$/sources/TronSolidityNode/Rest/queries.ts')

const binding = bindings[Source.TronFullNode_Rest][0]
const solidityBinding = tronSolidityNodeBindings[Source.TronSolidityNode_Rest][0]

describe('TRON local node transport', () => {
	beforeEach(() => {
		sourceFetch.mockReset()
		sourceFetch.mockResolvedValue(new Response(JSON.stringify({
			blockID: 'block',
		}), {
			status: 200,
		}))
	})

	it('uses the exact generated binding for endpoint and delivery authority', async () => {
		await getFullNodeBlockByNumber({
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

	it('keeps SolidityNode requests on the walletsolidity namespace', async () => {
		await getSolidityNodeBlockByNumber({
			height: 8n,
		})

		expect(sourceFetch).toHaveBeenCalledWith(
			solidityBinding,
			'http://127.0.0.1:8091/walletsolidity/getblockbynum',
			expect.objectContaining({
				method: 'POST',
			})
		)
	})
})
