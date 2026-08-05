import { QueryClient } from '@tanstack/query-core'
import { readFileSync } from 'node:fs'
import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import { networkBySlug } from '$/constants/Network.ts'
import { EntityMetaKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

const streamLedger = vi.hoisted(() => vi.fn())

vi.mock('$/sources/XrplClio/JsonRpc/queries.ts', () => ({
	streamLedger,
}))

const { default: xrplClio } = await import('$/resolvers/XrplClio-JsonRpc.ts')

const networkLedgersResolver = xrplClio.resolvers.find((candidate) => (
	candidate.entityType === EntityType.Network
	&& 'Xrpl' in candidate.projections
	&& '$$ledgers' in candidate.projections.Xrpl
	&& typeof candidate.projections.Xrpl.$$ledgers === 'function'
	&& candidate.resolveLive != null
))
if (networkLedgersResolver == null)
	throw new Error('XrplClio Network $$ledgers resolveLive resolver is missing')

const liveFields = () => ({
	'$$ledgers': {
		replaceRows: vi.fn(),
		invalidate: vi.fn(),
		count: {
			replaceRows: vi.fn(),
			invalidate: vi.fn(),
		},
	},
})

const context = {
	filters: [],
	sorts: [],
	pagination: {},
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [],
	publicEnv: {},
}

const startLedgerStreamLive = (
	fields: ReturnType<typeof liveFields>,
	signal = new AbortController().signal
) => networkLedgersResolver.resolveLive.ledgerStream.start({
	parentEntitySelector: {
		caip2: networkBySlug.xrpl.caip2,
	},
	queryClient: new QueryClient(),
	signal,
	trigger: context,
	fields,
})

describe('XRPL Clio Network $$ledgers resolveLive', () => {
	beforeEach(() => {
		streamLedger.mockReset()
	})

	it('publishes Clio-provenance ledger rows from push messages only', async () => {
		streamLedger.mockImplementation(async function* () {
			yield {
				type: 'ledgerClosed',
				ledger_index: 92_000_001,
				ledger_hash: 'LEDGER_HASH_1',
			}
			yield {
				type: 'ledgerClosed',
				ledger_index: 92_000_002,
				ledger_hash: 'LEDGER_HASH_2',
			}
		})

		const fields = liveFields()
		await startLedgerStreamLive(fields)

		expect(streamLedger).toHaveBeenCalledWith(expect.any(AbortSignal))
		expect(fields.$$ledgers.replaceRows).toHaveBeenNthCalledWith(1, [{
			source: Source.XrplClio_JsonRpc,
			value: [{
				[EntityMetaKey.Selector]: {
					$network: {
						caip2: networkBySlug.xrpl.caip2,
					},
					ledgerIndex: 92000001n,
				},
			}],
		}])
		expect(fields.$$ledgers.replaceRows).toHaveBeenNthCalledWith(2, [{
			source: Source.XrplClio_JsonRpc,
			value: [{
				[EntityMetaKey.Selector]: {
					$network: {
						caip2: networkBySlug.xrpl.caip2,
					},
					ledgerIndex: 92000002n,
				},
			}],
		}])
		expect(fields.$$ledgers.invalidate).not.toHaveBeenCalled()
	})

	it('threads abort into the stream and stops publishing', async () => {
		const fields = liveFields()
		const abortController = new AbortController()
		streamLedger.mockImplementation(async function* (signal) {
			yield {
				type: 'ledgerClosed',
				ledger_index: 92_000_010,
				ledger_hash: 'LEDGER_HASH_ABORT_1',
			}
			await new Promise<void>((resolve) => {
				signal.addEventListener('abort', resolve, { once: true })
			})
			if (signal.aborted)
				return
			yield {
				type: 'ledgerClosed',
				ledger_index: 92_000_011,
				ledger_hash: 'LEDGER_HASH_ABORT_2',
			}
		})

		const liveResolution = startLedgerStreamLive(fields, abortController.signal)
		await vi.waitFor(() => {
			expect(fields.$$ledgers.replaceRows).toHaveBeenCalledTimes(1)
		})
		abortController.abort()
		await liveResolution

		expect(streamLedger).toHaveBeenCalledWith(abortController.signal)
		expect(fields.$$ledgers.replaceRows).toHaveBeenCalledTimes(1)
	})

	it('rejects unsupported networks before opening the stream', async () => {
		await expect(networkLedgersResolver.resolveLive.ledgerStream.start({
			parentEntitySelector: {
				caip2: networkBySlug.ethereum.caip2,
			},
			queryClient: new QueryClient(),
			signal: new AbortController().signal,
			trigger: context,
			fields: liveFields(),
		})).rejects.toThrow('XrplClio_JsonRpc: unsupported network')

		expect(streamLedger).not.toHaveBeenCalled()
	})

	it('does not poll HTTP as the live driver', () => {
		const source = readFileSync('src/resolvers/XrplClio-JsonRpc.ts', 'utf8')

		expect(source).toContain('streamLedger')
		expect(source).toContain('resolveLive')
		expect(source).not.toMatch(/\bsetTimeout\b|\bsetInterval\b|\bpoll\s*\(/)
		expect(source).not.toContain('getValidatedLedger')
	})
})
