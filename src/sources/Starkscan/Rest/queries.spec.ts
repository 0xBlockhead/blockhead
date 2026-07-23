import { beforeEach, describe, expect, it, vi } from 'vitest'

import { Source } from '$/sources/Source.ts'
import { sourceProviderDefinitions } from '$/sources/$sourceProviders.ts'
import type {
	StarkscanAddressTransaction,
	StarkscanTokenHoldings,
} from '$/sources/Starkscan/Rest/types.ts'

const { getJson } = vi.hoisted(() => ({
	getJson: vi.fn(),
}))

vi.mock('$/sources/_shared/wire/HttpRest/client.ts', () => ({
	getJson,
}))

const {
	getAddressTransactions,
	getExactTokenHoldings,
} = await import('$/sources/Starkscan/Rest/queries.ts')

const binding = sourceProviderDefinitions
	.flatMap((provider) => provider.bindings)
	.find((candidate) => candidate.source === Source.Starkscan_Rest)

if (binding == null)
	throw new Error('Starkscan_Rest spec missing source binding')

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
} satisfies StarkscanAddressTransaction

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
} satisfies StarkscanTokenHoldings

describe('Starkscan account portfolio transport', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('loads a bounded direct-account transaction page with opaque continuation', async () => {
		getJson.mockResolvedValueOnce({
			items: [transaction],
			nextCursor: 'opaque:cursor+value',
		})

		await expect(getAddressTransactions(binding, {
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

		await expect(getExactTokenHoldings(binding, account)).resolves.toEqual(holdings)
		expect(getJson).toHaveBeenCalledWith(
			binding,
			'/v1/SN_MAIN/address/0x01/token-holdings'
		)
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
		await expect(getAddressTransactions(binding, {
			address: account,
			limit: 25,
		})).rejects.toThrow('foreign account row')

		getJson.mockResolvedValueOnce({
			items: [transaction],
			nextCursor: 'same',
		})
		await expect(getAddressTransactions(binding, {
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
		await expect(getAddressTransactions(binding, {
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
		await expect(getAddressTransactions(binding, {
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
		await expect(getAddressTransactions(binding, {
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
		await expect(getExactTokenHoldings(binding, account)).rejects.toThrow(
			'token holdings are incomplete (indexLag)'
		)

		getJson.mockResolvedValueOnce({
			...holdings,
			items: [{
				...holdings.items[0],
				indexedBalanceRaw: '1.5',
			}],
		})
		await expect(getExactTokenHoldings(binding, account)).rejects.toThrow(
			'invalid token balance'
		)
	})

	it('bounds requests and avoids transport for zero cardinality', async () => {
		await expect(getAddressTransactions(binding, {
			address: account,
			limit: 0,
		})).resolves.toEqual({
			items: [],
			nextCursor: null,
		})
		await expect(getAddressTransactions(binding, {
			address: account,
			limit: 101,
		})).rejects.toThrow('0 through 100')
		await expect(getAddressTransactions(binding, {
			address: account,
			limit: 25,
			cursor: '',
		})).rejects.toThrow('must not be empty')
		expect(getJson).not.toHaveBeenCalled()
	})
})
