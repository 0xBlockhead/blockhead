import { readFileSync } from 'node:fs'

import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import bindings from '$/sources/XrplClio/bindings.ts'
import { Source } from '$/sources/Source.ts'
import {
	SourceDelivery,
	sourceBindingId,
} from '$/sources/SourceBinding.ts'


const xrplLedgerLive = vi.hoisted(() => vi.fn())
const sourceFetch = vi.hoisted(() => vi.fn())

vi.mock('$/sources/XrplClio/JsonRpc/live.remote.ts', () => ({
	xrplLedgerLive,
}))

vi.mock('$/sources/_runtime/http.ts', () => ({
	firstHttpUrlForBinding: () => 'https://clio.example',
	sourceFetch,
}))

const {
	countCompleteLedgers,
	getLedger,
	getLedgerClosed,
	getLedgerData,
	getLedgerTransactions,
	getRecentLedgers,
	getServerInfo,
	getTransaction,
	getValidatedLedger,
	subscribeLedger,
} = await import('$/sources/XrplClio/JsonRpc/queries.ts')

const remoteLiveBinding = bindings[Source.XrplClio_JsonRpc].find((binding) => (
	binding.delivery === SourceDelivery.RemoteLive
))
const remoteQueryBinding = bindings[Source.XrplClio_JsonRpc].find((binding) => (
	binding.delivery === SourceDelivery.RemoteQuery
))

if (remoteLiveBinding == null)
	throw new Error('XrplClio_JsonRpc: RemoteLive binding is missing')
if (remoteQueryBinding == null)
	throw new Error('XrplClio_JsonRpc: RemoteQuery binding is missing')

const ledgerClosed = {
	type: 'ledgerClosed',
	ledger_index: 92_000_001,
	ledger_hash: 'ABCDEF',
	ledger_time: 7_800_000_000,
	fee_base: 10,
	fee_ref: 10,
	reserve_base: 10_000_000,
	reserve_inc: 2_000_000,
	txn_count: 3,
	validated_ledgers: '91900001-92000001',
} as const

const tipLedger = {
	ledger_hash: 'TIP_HASH',
	ledger_index: 92_000_002,
	validated: true,
	ledger: {
		account_hash: 'ACCOUNT_HASH',
		close_time: 780_000_000,
		close_time_human: '2024-09-18T18:40:00.000Z',
		parent_hash: 'PARENT_HASH',
		total_coins: '99999999999999999',
		transaction_hash: 'TX_ROOT',
	},
} as const

const priorLedger = {
	...tipLedger,
	ledger_hash: 'PRIOR_HASH',
	ledger_index: 92_000_001,
} as const

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


describe('XrplClio subscribeLedger RemoteLive transport', () => {
	beforeEach(() => {
		xrplLedgerLive.mockReset()
	})

	it('subscribes over RemoteLive WebSocket with streams:[ledger] and yields ledgerClosed frames', async () => {
		xrplLedgerLive.mockImplementation(() => (async function* () {
			yield ledgerClosed
		})())

		const controller = new AbortController()
		const messages = []

		for await (const message of subscribeLedger(remoteLiveBinding, controller.signal))
			messages.push(message)

		expect(xrplLedgerLive).toHaveBeenCalledTimes(1)
		expect(xrplLedgerLive).toHaveBeenCalledWith({
			bindingId: sourceBindingId(remoteLiveBinding),
			targetKey: remoteLiveBinding.target.key,
		})
		expect(messages).toEqual([ledgerClosed])
	})

	it('rejects non-RemoteLive bindings before opening a socket', async () => {
		await expect(async () => {
			for await (const _message of subscribeLedger(remoteQueryBinding))
				void _message
		}).rejects.toThrow('XrplClio_JsonRpc: subscribeLedger requires the RemoteLive WebSocket binding')

		expect(xrplLedgerLive).not.toHaveBeenCalled()
	})

	it('returns immediately when already aborted and stops cleanly after abort mid-stream', async () => {
		const preAborted = new AbortController()
		preAborted.abort()

		const preAbortedMessages = []
		for await (const message of subscribeLedger(remoteLiveBinding, preAborted.signal))
			preAbortedMessages.push(message)

		expect(preAbortedMessages).toEqual([])
		expect(xrplLedgerLive).not.toHaveBeenCalled()

		const midStream = new AbortController()
		xrplLedgerLive.mockImplementation(() => (async function* () {
			yield ledgerClosed
			midStream.abort()
			yield {
				...ledgerClosed,
				ledger_index: 92_000_002,
			}
		})())

		const midStreamMessages = []
		for await (const message of subscribeLedger(remoteLiveBinding, midStream.signal))
			midStreamMessages.push(message)

		expect(midStreamMessages).toEqual([ledgerClosed])
		expect(xrplLedgerLive).toHaveBeenCalledWith({
			bindingId: sourceBindingId(remoteLiveBinding),
			targetKey: remoteLiveBinding.target.key,
		})
	})

	it('keeps the initial ledger subscription on the server boundary', () => {
		const source = readFileSync('src/sources/XrplClio/JsonRpc/live.server.ts', 'utf8')

		expect(source).toContain("streams: ['ledger']")
		expect(source).toContain('iterateSourceLive')
		expect(source).not.toMatch(/\bsetTimeout\b|\bsetInterval\b|\bpoll\s*\(/)
	})

	it('does not poll and does not own a resolver', () => {
		const source = readFileSync('src/sources/XrplClio/JsonRpc/queries.ts', 'utf8')

		expect(source).toContain("from '$/sources/XrplClio/JsonRpc/live.remote.ts'")
		expect(source).not.toContain('.server.ts')
		expect(source).not.toMatch(/\bsetTimeout\b|\bsetInterval\b|\bpoll\s*\(/)
		expect(source).not.toContain('resolveLive')
		expect(source).not.toContain('defineResolver')
	})
})


describe('XrplClio historical JsonRpc transport', () => {
	beforeEach(() => {
		sourceFetch.mockReset()
	})

	it('fail-closes server_info / ledger_closed / ledger / tx / ledger_data envelopes', async () => {
		sourceFetch.mockResolvedValueOnce(jsonRpcResponse({
			info: {
				complete_ledgers: '91900001-92000002',
				validated_ledger: {
					hash: 'TIP_HASH',
					seq: 92_000_002,
				},
			},
		}))
		await expect(getServerInfo()).resolves.toMatchObject({
			info: {
				complete_ledgers: '91900001-92000002',
			},
		})

		sourceFetch.mockResolvedValueOnce(jsonRpcResponse({
			ledger_hash: 'TIP_HASH',
			ledger_index: 92_000_002,
		}))
		await expect(getLedgerClosed()).resolves.toEqual({
			ledger_hash: 'TIP_HASH',
			ledger_index: 92_000_002,
		})

		sourceFetch.mockResolvedValueOnce(jsonRpcResponse(tipLedger))
		await expect(getValidatedLedger()).resolves.toEqual(tipLedger)

		sourceFetch.mockResolvedValueOnce(jsonRpcResponse({
			...tipLedger,
			transactions: [{
				hash: 'TX1',
				TransactionType: 'Payment',
				Account: 'rAccount',
				Fee: '12',
			}],
		}))
		await expect(getLedgerTransactions(92_000_002)).resolves.toMatchObject({
			ledger_index: 92_000_002,
			transactions: [{
				hash: 'TX1',
			}],
		})

		sourceFetch.mockResolvedValueOnce(jsonRpcResponse({
			ledger_hash: 'TIP_HASH',
			ledger_index: 92_000_002,
			state: [{
				index: 'ENTRY1',
				LedgerEntryType: 'AccountRoot',
				Account: 'rAccount',
			}],
		}))
		await expect(getLedgerData(10, 92_000_002)).resolves.toMatchObject({
			ledger_index: 92_000_002,
			state: [{
				index: 'ENTRY1',
			}],
		})

		sourceFetch.mockResolvedValueOnce(jsonRpcResponse({
			hash: 'TXHASH',
			ledger_index: 92_000_002,
			validated: true,
			tx_json: {
				TransactionType: 'Payment',
				Account: 'rAccount',
				Fee: '10',
			},
			meta: {
				TransactionResult: 'tesSUCCESS',
			},
		}))
		await expect(getTransaction('TXHASH')).resolves.toMatchObject({
			hash: 'TXHASH',
			validated: true,
		})

		sourceFetch.mockResolvedValueOnce(jsonRpcResponse({
			ledger_hash: '',
			ledger_index: 1,
			validated: true,
		}))
		await expect(getLedger(1)).rejects.toThrow('invalid ledger response envelope')

		await expect(getLedger({
			ledgerHash: '',
		})).rejects.toThrow('ledger hash must not be empty')
		await expect(getTransaction('')).rejects.toThrow('transaction hash must not be empty')
		expect(sourceFetch).toHaveBeenCalledTimes(7)
	})

	it('loads a recent historical tip window newest-first', async () => {
		sourceFetch
			.mockResolvedValueOnce(jsonRpcResponse(tipLedger))
			.mockResolvedValueOnce(jsonRpcResponse(priorLedger))

		await expect(getRecentLedgers(2)).resolves.toEqual([
			tipLedger,
			priorLedger,
		])
	})

	it('counts complete_ledgers ranges fail-closed', () => {
		expect(countCompleteLedgers(undefined)).toBeUndefined()
		expect(countCompleteLedgers('')).toBeUndefined()
		expect(countCompleteLedgers('2-14,44-44,46-158')).toBe(127)
		expect(countCompleteLedgers('100')).toBe(1)
		expect(() => countCompleteLedgers('14-2')).toThrow('malformed complete_ledgers')
		expect(() => countCompleteLedgers('1,,2')).toThrow('malformed complete_ledgers')
	})
})
