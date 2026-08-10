import { beforeEach, describe, expect, it, vi } from 'vitest'

import bindings from '$/sources/TronFullNode/bindings.ts'
import { Source } from '$/sources/Source.ts'
import tronSolidityNodeBindings from '$/sources/TronSolidityNode/bindings.ts'

const sourceFetch = vi.fn()

vi.mock('$/sources/_runtime/http.ts', () => ({
	firstHttpUrlForBinding: (binding: { endpoints: { locator: string }[] }) => binding.endpoints[0]?.locator,
	sourceFetch,
}))

const {
	getAccount: getFullNodeAccount,
	getBlockById: getFullNodeBlockById,
} = await import('$/sources/TronFullNode/Rest/queries.ts')
const { getBlockById: getSolidityNodeBlockById } = await import('$/sources/TronSolidityNode/Rest/queries.ts')

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
		await getFullNodeBlockById({
			hash: 'full-block',
		})

		expect(sourceFetch).toHaveBeenCalledWith(
			binding,
			'http://127.0.0.1:8090/wallet/getblockbyid',
			expect.objectContaining({
				body: JSON.stringify({
					value: 'full-block',
					visible: true,
				}),
				method: 'POST',
			})
		)
	})

	it('preserves account resource usage from the typed account envelope', async () => {
		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			address: 'Taccount',
			free_net_usage: 11,
			net_usage: 12,
			account_resource: {
				energy_usage: 13,
			},
		}), {
			status: 200,
		}))

		await expect(getFullNodeAccount({
			address: 'Taccount',
		})).resolves.toMatchObject({
			free_net_usage: 11,
			net_usage: 12,
			account_resource: {
				energy_usage: 13,
			},
		})
	})

	it('keeps SolidityNode requests on the walletsolidity namespace', async () => {
		await getSolidityNodeBlockById({
			hash: 'solid-block',
		})

		expect(sourceFetch).toHaveBeenCalledWith(
			solidityBinding,
			'http://127.0.0.1:8091/walletsolidity/getblockbyid',
			expect.objectContaining({
				body: JSON.stringify({
					value: 'solid-block',
					visible: true,
				}),
				method: 'POST',
			})
		)
	})
})
