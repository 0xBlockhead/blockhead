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
} from '$/sources/SourceBinding.ts'


const xrplLedgerLive = vi.hoisted(() => vi.fn())

vi.mock('$/sources/XrplClio/JsonRpc/live.remote.ts', () => ({
	xrplLedgerLive,
}))

const {
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
