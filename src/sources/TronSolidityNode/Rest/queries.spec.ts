import { beforeEach, describe, expect, it, vi } from 'vitest'

import bindings from '$/sources/TronSolidityNode/bindings.ts'
import { Source } from '$/sources/Source.ts'

const sourceFetch = vi.fn()

vi.mock('$/sources/_runtime/http.ts', () => ({
	firstHttpUrlForBinding: (binding: { endpoints: { locator: string }[] }) => binding.endpoints[0]?.locator,
	sourceFetch,
}))

const {
	getAccount,
	getBlockById,
	getTransactionById,
	getTransactionInfoById,
} = await import('$/sources/TronSolidityNode/Rest/queries.ts')

const binding = bindings[Source.TronSolidityNode_Rest][0]

describe('TronSolidityNode Rest', () => {
	beforeEach(() => {
		sourceFetch.mockReset()
		sourceFetch.mockResolvedValue(new Response(JSON.stringify({}), {
			status: 200,
		}))
	})

	it('posts walletsolidity/getaccount', async () => {
		await getAccount({
			address: 'Taccount',
		})

		expect(sourceFetch).toHaveBeenCalledWith(
			binding,
			'http://127.0.0.1:8091/walletsolidity/getaccount',
			expect.objectContaining({
				body: JSON.stringify({
					address: 'Taccount',
					visible: true,
				}),
				method: 'POST',
			})
		)
	})

	it('posts walletsolidity/getblockbyid', async () => {
		await getBlockById({
			hash: 'solid-block',
		})

		expect(sourceFetch).toHaveBeenCalledWith(
			binding,
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

	it('posts walletsolidity/gettransactionbyid', async () => {
		await getTransactionById({
			transactionId: 'tx-1',
		})

		expect(sourceFetch).toHaveBeenCalledWith(
			binding,
			'http://127.0.0.1:8091/walletsolidity/gettransactionbyid',
			expect.objectContaining({
				body: JSON.stringify({
					value: 'tx-1',
					visible: true,
				}),
				method: 'POST',
			})
		)
	})

	it('posts walletsolidity/gettransactioninfobyid', async () => {
		await getTransactionInfoById({
			transactionId: 'tx-1',
		})

		expect(sourceFetch).toHaveBeenCalledWith(
			binding,
			'http://127.0.0.1:8091/walletsolidity/gettransactioninfobyid',
			expect.objectContaining({
				body: JSON.stringify({
					value: 'tx-1',
				}),
				method: 'POST',
			})
		)
	})
})
