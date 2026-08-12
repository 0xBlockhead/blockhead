import { readFileSync } from 'node:fs'
import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import {
	getAccountInfo,
	getAccountLines,
	getAccountObjects,
	getAccountTransactions,
	getAmmInfo,
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
		})).rejects.toThrow('ledger hash must be canonical hexadecimal')

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

	it('binds ledger responses to an explicit index or hash and validated subject', async () => {
		sourceFetch
			.mockResolvedValueOnce(jsonRpcResponse({
				...validatedLedger,
				ledger_index: validatedLedger.ledger_index + 1,
			}))
			.mockResolvedValueOnce(jsonRpcResponse({
				...validatedLedger,
				ledger_hash: '0'.repeat(64),
			}))
			.mockResolvedValueOnce(jsonRpcResponse({
				...validatedLedger,
				validated: false,
			}))

		await expect(getLedger(validatedLedger.ledger_index)).rejects.toThrow('ledger response does not match request')
		await expect(getLedger({
			ledgerHash: validatedLedger.ledger_hash,
		})).rejects.toThrow('ledger response does not match request')
	await expect(getValidatedLedger()).rejects.toThrow('ledger is not validated')
		await expect(getLedger({
			ledgerHash: 'not-a-ledger-hash',
		})).rejects.toThrow('ledger hash must be canonical hexadecimal')
		expect(sourceFetch).toHaveBeenCalledTimes(3)
	})
})

describe('Xrpl_Rippled account and AMM request identity', () => {
	beforeEach(() => {
		sourceFetch.mockReset()
	})

	it('rejects substituted account and AMM subjects', async () => {
		const requestedAccount = 'rRequested'
		const foreignAccount = 'rForeign'
		for (const result of [
			{
				account_data: {
					Account: foreignAccount,
					Balance: '0',
					Flags: 0,
					LedgerEntryType: 'AccountRoot',
					OwnerCount: 0,
					Sequence: 1,
				},
				validated: true,
			},
			{
				account: foreignAccount,
				account_objects: [],
				validated: true,
			},
			{
				account: foreignAccount,
				lines: [],
				validated: true,
			},
			{
				account: foreignAccount,
				ledger_index_min: -1,
				ledger_index_max: -1,
				transactions: [],
				validated: true,
			},
			{
				amm: {
					account: foreignAccount,
					amount: '1',
					amount2: '2',
					lp_token: {
						currency: 'LP',
						issuer: foreignAccount,
						value: '3',
					},
					trading_fee: 0,
				},
				validated: true,
			},
		])
			sourceFetch.mockResolvedValueOnce(jsonRpcResponse(result))

		await expect(getAccountInfo(requestedAccount)).rejects.toThrow('account_info response does not match request')
		await expect(getAccountObjects(requestedAccount, 10)).rejects.toThrow('account_objects response does not match request')
		await expect(getAccountLines(requestedAccount, 10)).rejects.toThrow('account_lines response does not match request')
		await expect(getAccountTransactions(requestedAccount, 10)).rejects.toThrow('account_tx response does not match request')
		await expect(getAmmInfo(requestedAccount)).rejects.toThrow('amm_info response does not match request')
	})

	it('rejects empty account selectors before transport', async () => {
		await expect(getAccountInfo('')).rejects.toThrow('account must not be empty')
		await expect(getAccountObjects('', 10)).rejects.toThrow('account must not be empty')
		await expect(getAccountLines('', 10)).rejects.toThrow('account must not be empty')
		await expect(getAccountTransactions('', 10)).rejects.toThrow('account must not be empty')
		expect(sourceFetch).not.toHaveBeenCalled()
	})

	it('pins peer-filtered trustline reads to an exact ledger', async () => {
		const account = 'rRequested'
		sourceFetch.mockResolvedValueOnce(jsonRpcResponse({
			account,
			ledger_index: 123,
			lines: [],
			validated: true,
		}))
		await getAccountLines(account, 400, undefined, 'rPeer', 123)

		expect(JSON.parse(sourceFetch.mock.calls[0][2].body)).toMatchObject({
			method: 'account_lines',
			params: [{
				account,
				ledger_index: 123,
				peer: 'rPeer',
			}],
		})
	})
})
