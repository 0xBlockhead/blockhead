import { readFileSync } from 'node:fs'
import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import {
	getLedger,
	getValidatedLedger,
} from '$/sources/Xrpl/JsonRpc/queries.ts'
import type {
	XrplLedgerResult,
} from '$/sources/Xrpl/JsonRpc/types.ts'

const sourceFetch = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_runtime/http.ts', () => ({
	firstHttpUrlForBinding: () => 'https://xrpl.example',
	sourceFetch,
}))

const validatedLedger = JSON.parse(readFileSync(
	new URL('./fixtures/ledger.json', import.meta.url),
	'utf8'
)) satisfies XrplLedgerResult

const jsonRpcResponse = (result: unknown) => (
	new Response(JSON.stringify({
		jsonrpc: '2.0',
		id: 1,
		result,
	}), {
		status: 200,
		headers: {
			'content-type': 'application/json',
		},
	})
)


describe('Xrpl_Rippled ledger transport', () => {
	beforeEach(() => {
		sourceFetch.mockReset()
	})

	it('loads validated ledger with nested body fields', async () => {
		sourceFetch.mockResolvedValueOnce(jsonRpcResponse(validatedLedger))
		await expect(getValidatedLedger()).resolves.toEqual(validatedLedger)
	})

	it('requests ledger by index and by hash', async () => {
		sourceFetch.mockResolvedValueOnce(jsonRpcResponse(validatedLedger))
		await expect(getLedger(93_412_781)).resolves.toEqual(validatedLedger)

		sourceFetch.mockResolvedValueOnce(jsonRpcResponse(validatedLedger))
		await expect(getLedger({
			ledgerHash: validatedLedger.ledger_hash,
		})).resolves.toEqual(validatedLedger)

		expect(sourceFetch).toHaveBeenCalledTimes(2)
	})

	it('fail-closes empty ledger hash and invalid index', async () => {
		await expect(getLedger({
			ledgerHash: '',
		})).rejects.toThrow('ledger hash must not be empty')

		await expect(getLedger(-1)).rejects.toThrow('ledger index must be a nonnegative safe integer')
		expect(sourceFetch).not.toHaveBeenCalled()
	})

	it('fail-closes malformed nested ledger body', async () => {
		sourceFetch.mockResolvedValueOnce(jsonRpcResponse({
			...validatedLedger,
			ledger: {
				...validatedLedger.ledger,
				total_coins: '',
			},
		}))
		await expect(getValidatedLedger()).rejects.toThrow('invalid ledger response envelope')
	})
})
