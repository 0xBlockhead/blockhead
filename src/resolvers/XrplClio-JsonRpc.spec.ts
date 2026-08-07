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
import {
	entityFieldAddressKey,
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

const getLedger = vi.hoisted(() => vi.fn())
const getLedgerData = vi.hoisted(() => vi.fn())
const getLedgerTransactions = vi.hoisted(() => vi.fn())
const getRecentLedgers = vi.hoisted(() => vi.fn())
const getServerInfo = vi.hoisted(() => vi.fn())
const getTransaction = vi.hoisted(() => vi.fn())
const getValidatedLedger = vi.hoisted(() => vi.fn())
const countCompleteLedgers = vi.hoisted(() => vi.fn())
const streamLedger = vi.hoisted(() => vi.fn())

vi.mock('$/sources/XrplClio/JsonRpc/queries.ts', () => ({
	countCompleteLedgers,
	getLedger,
	getLedgerData,
	getLedgerTransactions,
	getRecentLedgers,
	getServerInfo,
	getTransaction,
	getValidatedLedger,
	streamLedger,
}))

const { default: xrplClio } = await import('$/resolvers/XrplClio-JsonRpc.ts')

const resolverFor = (
	entityType: EntityType,
	projectionKey: string
) => {
	const resolver = xrplClio.resolvers.find((candidate) => (
		candidate.entityType === entityType
		&& projectionKey in candidate.projections
	))
	if (resolver == null)
		throw new Error(`XrplClio_JsonRpc spec missing ${entityType}.${projectionKey} resolver`)
	return resolver
}

const networkLedgersResolver = xrplClio.resolvers.find((candidate) => (
	candidate.entityType === EntityType.Network
	&& 'Xrpl' in candidate.projections
	&& '$$ledgers' in candidate.projections.Xrpl
	&& typeof candidate.projections.Xrpl.$$ledgers === 'function'
	&& candidate.resolveLive != null
))
if (networkLedgersResolver == null)
	throw new Error('XrplClio Network $$ledgers resolveLive resolver is missing')

const networkLedgersCountResolver = xrplClio.resolvers.find((candidate) => (
	candidate.entityType === EntityType.Network
	&& 'Xrpl' in candidate.projections
	&& typeof candidate.projections.Xrpl.$$ledgers === 'object'
	&& candidate.projections.Xrpl.$$ledgers != null
	&& 'resolveCount' in candidate.projections.Xrpl.$$ledgers
))
if (networkLedgersCountResolver == null)
	throw new Error('XrplClio Network $$ledgers resolveCount resolver is missing')

const ledgerResolver = resolverFor(EntityType.XrplLedger, 'ledgerHash')
const ledgerTxResolver = resolverFor(EntityType.XrplLedger, '$$transactions')
const ledgerEntriesResolver = resolverFor(EntityType.XrplLedger, '$$ledgerEntries')
const transactionResolver = resolverFor(EntityType.XrplTransaction, '$$timestamps')

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
	pagination: {
		limit: 2,
	},
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [],
	publicEnv: {},
}

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
}

const priorLedger = {
	...tipLedger,
	ledger_hash: 'PRIOR_HASH',
	ledger_index: 92_000_001,
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
		expect(source).not.toContain('getValidatedLedgerHead')
	})
})


describe('XRPL Clio historical ledger deepen', () => {
	beforeEach(() => {
		getLedger.mockReset()
		getLedgerData.mockReset()
		getLedgerTransactions.mockReset()
		getRecentLedgers.mockReset()
		getServerInfo.mockReset()
		getTransaction.mockReset()
		getValidatedLedger.mockReset()
		countCompleteLedgers.mockReset()
	})

	it('projects a historical tip ledger window with enrolled tip fields', async () => {
		getRecentLedgers.mockResolvedValue([
			tipLedger,
			priorLedger,
		])

		const ledgers = await networkLedgersResolver.resolve.Caip2.resolve({
			caip2: networkBySlug.xrpl.caip2,
		}, context)

		expect(getRecentLedgers).toHaveBeenCalledWith(2)
		expect(networkLedgersResolver.projections.Xrpl.$$ledgers(ledgers)).toEqual([{
			[EntityMetaKey.Selector]: {
				$network: {
					caip2: networkBySlug.xrpl.caip2,
				},
				ledgerIndex: 92000002n,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.XrplLedger, [], 'ledgerHash')]: 'TIP_HASH',
				[entityFieldAddressKey(EntityType.XrplLedger, [], 'validated')]: true,
				[entityFieldAddressKey(EntityType.XrplLedger, [], 'closeTimeMs')]: 1_726_684_800_000,
				[entityFieldAddressKey(EntityType.XrplLedger, [], 'totalCoinsDrops')]: 99999999999999999n,
				[entityFieldAddressKey(EntityType.XrplLedger, [], 'parentHash')]: 'PARENT_HASH',
				[entityFieldAddressKey(EntityType.XrplLedger, [], 'accountHash')]: 'ACCOUNT_HASH',
				[entityFieldAddressKey(EntityType.XrplLedger, [], 'transactionHash')]: 'TX_ROOT',
			},
		}, {
			[EntityMetaKey.Selector]: {
				$network: {
					caip2: networkBySlug.xrpl.caip2,
				},
				ledgerIndex: 92000001n,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.XrplLedger, [], 'ledgerHash')]: 'PRIOR_HASH',
				[entityFieldAddressKey(EntityType.XrplLedger, [], 'validated')]: true,
				[entityFieldAddressKey(EntityType.XrplLedger, [], 'closeTimeMs')]: 1_726_684_800_000,
				[entityFieldAddressKey(EntityType.XrplLedger, [], 'totalCoinsDrops')]: 99999999999999999n,
				[entityFieldAddressKey(EntityType.XrplLedger, [], 'parentHash')]: 'PARENT_HASH',
				[entityFieldAddressKey(EntityType.XrplLedger, [], 'accountHash')]: 'ACCOUNT_HASH',
				[entityFieldAddressKey(EntityType.XrplLedger, [], 'transactionHash')]: 'TX_ROOT',
			},
		}])
	})

	it('authoritative $$ledgers resolveCount prefers complete_ledgers span', async () => {
		getServerInfo.mockResolvedValue({
			info: {
				complete_ledgers: '91900001-92000002',
			},
		})
		getValidatedLedger.mockResolvedValue(tipLedger)
		countCompleteLedgers.mockReturnValue(100_002)

		const count = await networkLedgersCountResolver.resolve.Caip2.resolve({
			caip2: networkBySlug.xrpl.caip2,
		}, context)

		expect(countCompleteLedgers).toHaveBeenCalledWith('91900001-92000002')
		expect(networkLedgersCountResolver.projections.Xrpl.$$ledgers.resolveCount(count)).toBe(100_002)
	})

	it('projects singular historical ledger + ledger transactions + ledger entries', async () => {
		getLedger.mockResolvedValue(tipLedger)
		getLedgerTransactions.mockResolvedValue({
			...tipLedger,
			transactions: [{
				hash: 'TX1',
				TransactionType: 'Payment',
				Account: 'rSender',
				Sequence: 7,
				Fee: '12',
				date: 780_000_000,
			}],
		})
		getLedgerData.mockResolvedValue({
			ledger_hash: 'TIP_HASH',
			ledger_index: 92_000_002,
			state: [{
				index: 'ENTRY1',
				LedgerEntryType: 'AccountRoot',
				Account: 'rSender',
				PreviousTxnID: 'PREVTX',
				PreviousTxnLgrSeq: 91_999_999,
			}],
		})

		const ledger = await ledgerResolver.resolve.NetworkLedgerIndex.resolve({
			$network: {
				caip2: networkBySlug.xrpl.caip2,
			},
			ledgerIndex: 92000002n,
		}, context)

		expect(ledgerResolver.projections.ledgerHash(ledger)).toBe('TIP_HASH')
		expect(ledgerResolver.projections.closeTimeMs(ledger)).toBe(1_726_684_800_000)
		expect(ledgerResolver.projections.accountHash(ledger)).toBe('ACCOUNT_HASH')

		const transactions = await ledgerTxResolver.resolve.NetworkLedgerIndex.resolve({
			$network: {
				caip2: networkBySlug.xrpl.caip2,
			},
			ledgerIndex: 92000002n,
		}, context)

		expect(ledgerTxResolver.projections.$$transactions(transactions)).toHaveLength(1)
		expect(transactions[0][EntityMetaKey.Selector]).toEqual({
			$network: {
				caip2: networkBySlug.xrpl.caip2,
			},
			hash: 'TX1',
		})

		const entriesPage = await ledgerEntriesResolver.resolve.NetworkLedgerIndex.resolve({
			$network: {
				caip2: networkBySlug.xrpl.caip2,
			},
			ledgerIndex: 92000002n,
		}, context)
		const entries = ledgerEntriesResolver.projections.$$ledgerEntries.select(entriesPage)

		expect(entries).toHaveLength(1)
		expect(entries[0][EntityMetaKey.Selector]).toEqual({
			$ledger: {
				$network: {
					caip2: networkBySlug.xrpl.caip2,
				},
				ledgerIndex: 92000002n,
			},
			entryHash: 'ENTRY1',
		})
	})

	it('projects historical transaction tip observation via tx', async () => {
		getTransaction.mockResolvedValue({
			hash: 'TXHASH',
			ledger_index: 92_000_002,
			validated: true,
			tx_json: {
				TransactionType: 'Payment',
				Account: 'rSender',
				Sequence: 9,
				Fee: '10',
				date: 780_000_000,
			},
			meta: {
				TransactionResult: 'tesSUCCESS',
			},
		})

		const snapshot = await transactionResolver.resolve.NetworkHash.resolve({
			$network: {
				caip2: networkBySlug.xrpl.caip2,
			},
			hash: 'TXHASH',
		}, context)

		expect(transactionResolver.projections.transactionType(snapshot)).toBe('Payment')
		expect(transactionResolver.projections.$$timestamps(snapshot)).toEqual([{
			[EntityMetaKey.Selector]: {
				$transaction: {
					$network: {
						caip2: networkBySlug.xrpl.caip2,
					},
					hash: 'TXHASH',
				},
				ledgerIndex: 92000002n,
				source: Source.XrplClio_JsonRpc,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.XrplTransaction_Timestamp, [], 'timestampMs')]: 1_726_684_800_000,
				[entityFieldAddressKey(EntityType.XrplTransaction_Timestamp, [], 'fee')]: 10n,
				[entityFieldAddressKey(EntityType.XrplTransaction_Timestamp, [], 'status')]: 'tesSUCCESS',
				[entityFieldAddressKey(EntityType.XrplTransaction_Timestamp, [], 'resultCode')]: 'tesSUCCESS',
				[entityFieldAddressKey(EntityType.XrplTransaction_Timestamp, [], 'validated')]: true,
				[entityFieldAddressKey(EntityType.XrplTransaction_Timestamp, [], 'meta')]: {
					TransactionResult: 'tesSUCCESS',
				},
			},
		}])
	})
})
