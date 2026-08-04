import { beforeEach, describe, expect, it, vi } from 'vitest'

import { Source } from '$/sources/Source.ts'
import bindings from '$/sources/Starkscan/bindings.ts'
import type { components } from '$/sources/Starkscan/OpenApi/openapi.d.ts'

type AddressSummary = components['schemas']['AddressSummaryView']
type AddressTransaction = components['schemas']['AddressTransactionListItem']
type AddressTokenHoldings = components['schemas']['AddressTokenHoldingsView']
type ContractEvent = components['schemas']['ContractEventItem']

const { getJson } = vi.hoisted(() => ({
	getJson: vi.fn(),
}))

vi.mock('$/sources/_shared/wire/HttpRest/client.ts', () => ({
	getJson,
}))

const {
	getAddressSummary,
	getAddressTransactions,
	getContractEvents,
	getExactTokenHoldings,
} = await import('$/sources/Starkscan/Rest/queries.ts')

const binding = bindings[Source.Starkscan][0]

const account = '0x01'
const transaction = {
	blockNumber: 10_630_025,
	timestampIso: '2026-07-15T12:00:00Z',
	txIndex: 4,
	txHash: '0xabc',
	kinds: ['invoke'],
	counterparty: '0x2',
	txType: 'INVOKE',
	executionStatus: 'SUCCEEDED',
	finalityStatus: 'ACCEPTED_ON_L2',
	fromAddress: '0x0001',
	toAddress: '0x2',
	primaryMethod: 'transfer',
	callCount: 1,
	methodsDiffer: false,
	transferCount: 1,
	topTransferTokenAddress: '0x3',
	topTransferAmount: '340282366920938463463374607431768211455',
	topTransferStandard: 'ERC20',
} satisfies AddressTransaction

const holdings = {
	chainId: 'SN_MAIN',
	ownerAddress: '0x0001',
	items: [{
		tokenAddress: '0x03',
		normalizedTokenAddress: '0x3',
		indexedBalanceRaw: '340282366920938463463374607431768211455',
		symbol: 'STRK',
		name: 'Starknet Token',
		decimals: 18,
	}],
	exact: true,
	truncated: false,
	completeness: {
		exact: true,
		truncated: false,
		complete: true,
		reasonCode: 'complete',
		reason: 'Complete indexed holdings',
		lagBlocks: 0,
		capped: false,
		cap: null,
	},
} satisfies AddressTokenHoldings

const summary = {
	address: '0x0001',
	totalActivityCount: 12,
	latestActivityBlock: 10_630_025,
	classHash: '0x0abc',
	isAccount: true,
	contractExistence: null,
} satisfies AddressSummary

const event = {
	blockNumber: 10_630_025,
	timestampIso: '2026-07-15T12:00:00Z',
	txHash: '0xabc',
	txIndex: 4,
	logIndex: 2,
	address: '0x0001',
	keys: ['0x11', '0x22'],
	topic0: '0x11',
	topic1: '0x22',
	topic2: null,
	topic3: null,
	data: ['0x33'],
	decodingStatus: 'unknown',
} satisfies ContractEvent

describe('Starkscan account portfolio transport', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('loads a bounded direct-account transaction page with opaque continuation', async () => {
		getJson.mockResolvedValueOnce({
			items: [transaction],
			nextCursor: 'opaque:cursor+value',
		})

		await expect(getAddressTransactions({
			address: account,
			limit: 25,
			cursor: 'previous+cursor',
		})).resolves.toEqual({
			items: [transaction],
			nextCursor: 'opaque:cursor+value',
		})
		expect(getJson).toHaveBeenCalledWith(
			binding,
			'/v1/SN_MAIN/address/0x01/transactions?limit=25&cursor=previous%2Bcursor'
		)
	})

	it('returns only exact, complete, owner-matched indexed holdings', async () => {
		getJson.mockResolvedValueOnce(holdings)

		await expect(getExactTokenHoldings(account)).resolves.toEqual(holdings)
		expect(getJson).toHaveBeenCalledWith(
			binding,
			'/v1/SN_MAIN/address/0x01/token-holdings'
		)
	})

	it('certifies address summaries with class or not-deployed evidence', async () => {
		getJson.mockResolvedValueOnce(summary)
		await expect(getAddressSummary(account)).resolves.toEqual(summary)
		expect(getJson).toHaveBeenCalledWith(
			binding,
			'/v1/SN_MAIN/address/0x01'
		)

		getJson.mockResolvedValueOnce({
			address: '0x0001',
			totalActivityCount: 0,
			latestActivityBlock: null,
			classHash: null,
			contractExistence: {
				status: 'not_deployed',
				reasonCode: 'contract_not_found',
				evidenceSource: 'finalized_class_hash_at',
				observedBlockNumber: 42,
				observedBlockHash: '0xdead',
				expiresAtIso: '2026-07-15T12:00:00Z',
			},
		})
		await expect(getAddressSummary(account)).resolves.toMatchObject({
			contractExistence: {
				status: 'not_deployed',
				observedBlockNumber: 42,
			},
		})

		getJson.mockResolvedValueOnce({
			...summary,
			classHash: null,
			contractExistence: null,
		})
		await expect(getAddressSummary(account)).rejects.toThrow('lacks contract existence evidence')

		getJson.mockResolvedValueOnce({
			...summary,
			latestActivityBlock: null,
		})
		await expect(getAddressSummary(account)).rejects.toThrow('lacks observation block')
	})

	it('loads newest-first contract events and rejects degraded or foreign pages', async () => {
		getJson.mockResolvedValueOnce({
			items: [event],
			nextCursor: '10630024:1:0',
			eventDecodingDegraded: false,
		})
		await expect(getContractEvents({
			address: account,
			limit: 25,
			cursor: '10630025:4:2',
		})).resolves.toMatchObject({
			items: [event],
			nextCursor: '10630024:1:0',
		})
		expect(getJson).toHaveBeenCalledWith(
			binding,
			'/v1/SN_MAIN/contract/0x01/events?limit=25&cursor=10630025%3A4%3A2'
		)

		getJson.mockResolvedValueOnce({
			items: [{
				...event,
				address: '0x2',
			}],
			nextCursor: null,
			eventDecodingDegraded: false,
		})
		await expect(getContractEvents({
			address: account,
			limit: 25,
		})).rejects.toThrow('foreign contract row')

		getJson.mockResolvedValueOnce({
			items: [event],
			nextCursor: null,
			eventDecodingDegraded: true,
		})
		await expect(getContractEvents({
			address: account,
			limit: 25,
		})).rejects.toThrow('operationally degraded')
	})

	it('fails closed on foreign transaction rows and stalled cursors', async () => {
		getJson.mockResolvedValueOnce({
			items: [{
				...transaction,
				fromAddress: '0x2',
				toAddress: '0x3',
			}],
			nextCursor: null,
		})
		await expect(getAddressTransactions({
			address: account,
			limit: 25,
		})).rejects.toThrow('foreign account row')

		getJson.mockResolvedValueOnce({
			items: [transaction],
			nextCursor: 'same',
		})
		await expect(getAddressTransactions({
			address: account,
			limit: 25,
			cursor: 'same',
		})).rejects.toThrow('did not advance')
	})

	it('rejects transaction pages with reversed ledger order or malformed clocks', async () => {
		getJson.mockResolvedValueOnce({
			items: [
				transaction,
				{
					...transaction,
					blockNumber: transaction.blockNumber + 1,
					txHash: '0xdef',
				},
			],
			nextCursor: null,
		})
		await expect(getAddressTransactions({
			address: account,
			limit: 25,
		})).rejects.toThrow('not newest-first')

		getJson.mockResolvedValueOnce({
			items: [{
				...transaction,
				timestampIso: 'not-a-clock',
			}],
			nextCursor: null,
		})
		await expect(getAddressTransactions({
			address: account,
			limit: 25,
		})).rejects.toThrow('invalid transaction timestamp')

		getJson.mockResolvedValueOnce({
			items: [
				transaction,
				{
					...transaction,
					blockNumber: transaction.blockNumber - 1,
					txHash: '0x0abc',
				},
			],
			nextCursor: null,
		})
		await expect(getAddressTransactions({
			address: account,
			limit: 25,
		})).rejects.toThrow('duplicate hash')
	})

	it('rejects incomplete holdings and malformed lossless amounts', async () => {
		getJson.mockResolvedValueOnce({
			...holdings,
			exact: false,
			completeness: {
				...holdings.completeness,
				exact: false,
				complete: false,
				reasonCode: 'indexLag',
			},
		})
		await expect(getExactTokenHoldings(account)).rejects.toThrow(
			'token holdings are incomplete (indexLag)'
		)

		getJson.mockResolvedValueOnce({
			...holdings,
			items: [{
				...holdings.items[0],
				indexedBalanceRaw: '1.5',
			}],
		})
		await expect(getExactTokenHoldings(account)).rejects.toThrow(
			'invalid token balance'
		)
	})

	it('bounds requests and avoids transport for zero cardinality', async () => {
		await expect(getAddressTransactions({
			address: account,
			limit: 0,
		})).resolves.toEqual({
			items: [],
			nextCursor: null,
		})
		await expect(getContractEvents({
			address: account,
			limit: 0,
		})).resolves.toEqual({
			items: [],
			nextCursor: null,
			eventDecodingDegraded: false,
		})
		await expect(getAddressTransactions({
			address: account,
			limit: 101,
		})).rejects.toThrow('0 through 100')
		await expect(getAddressTransactions({
			address: account,
			limit: 25,
			cursor: '',
		})).rejects.toThrow('must not be empty')
		expect(getJson).not.toHaveBeenCalled()
	})
})
