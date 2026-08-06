import { beforeEach, describe, expect, it, vi } from 'vitest'

import { Source } from '$/sources/Source.ts'
import bindings from '$/sources/TronScan/bindings.ts'
import type { TronScanTransactions } from '$/sources/TronScan/Rest/types.ts'

const { sourceGetJson } = vi.hoisted(() => ({
	sourceGetJson: vi.fn(),
}))

vi.mock('$/sources/_runtime/http.ts', async (importOriginal) => ({
	...await importOriginal<typeof import('$/sources/_runtime/http.ts')>(),
	sourceGetJson,
}))

const { getAccount, getAccountTransactions, getBlock, getTransaction } = await import('$/sources/TronScan/Rest/queries.ts')

const binding = bindings[Source.TronScan_Rest][0]

describe('TronScan REST account transactions transport', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('uses the declared binding and exact account-filtered offset page', async () => {
		const response = {
			total: 12,
			rangeTotal: 12,
			data: [{
				hash: 'transaction-hash',
				block: 77,
				timestamp: 1_720_000_000_000,
				ownerAddress: 'T/account+address',
				toAddress: 'Trecipient',
				contractType: 1,
				contractRet: 'SUCCESS',
				amount: '42',
			}],
		} satisfies TronScanTransactions
		sourceGetJson.mockResolvedValueOnce(response)

		await expect(getAccountTransactions(
			'T/account+address',
			20,
			40
		)).resolves.toEqual(response)
		expect(sourceGetJson).toHaveBeenCalledWith(
			binding,
			'https://apilist.tronscanapi.com/api/transaction?sort=-timestamp&count=true&limit=20&start=40&address=T%2Faccount%2Baddress'
		)
	})

	it('rejects pages outside TronScan transaction-list limits before transport', async () => {
		await expect(getAccountTransactions('Taccount', 51)).rejects.toThrow(
			'TronScan_Rest: transaction list limit must be an integer from 1 through 50'
		)
		await expect(getAccountTransactions('Taccount', 50, 9_951)).rejects.toThrow(
			'TronScan_Rest: transaction list range must be within the first 10000 rows'
		)
		expect(sourceGetJson).not.toHaveBeenCalled()
	})
})

describe('TronScan REST arktype envelopes', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('accepts account / block / transaction envelopes', async () => {
		sourceGetJson
			.mockResolvedValueOnce({
				address: 'Taccount',
				balance: 1,
				date_created: 1_700_000_000_000,
			})
			.mockResolvedValueOnce({
				data: [{
					number: 77,
					hash: 'block-hash',
					timestamp: 1_720_000_000_000,
				}],
			})
			.mockResolvedValueOnce({
				hash: 'transaction-hash',
				block: 77,
				timestamp: 1_720_000_000_000,
				contractRet: 'SUCCESS',
			})

		await expect(getAccount('Taccount')).resolves.toMatchObject({
			address: 'Taccount',
		})
		await expect(getBlock(77n)).resolves.toMatchObject({
			data: [{
				number: 77,
			}],
		})
		await expect(getTransaction('transaction-hash')).resolves.toMatchObject({
			hash: 'transaction-hash',
		})
	})

	it('fail-closes malformed account / block / transaction list envelopes', async () => {
		sourceGetJson
			.mockResolvedValueOnce({
				totalTransactionCount: -1,
			})
			.mockResolvedValueOnce({
				data: [{
					number: 'not-a-height',
				}],
			})
			.mockResolvedValueOnce({
				total: 1,
				data: [{
					block: 1,
				}],
			})

		await expect(getAccount('Taccount')).rejects.toThrow('invalid account response envelope')
		await expect(getBlock(1n)).rejects.toThrow('invalid blocks response envelope')
		await expect(getAccountTransactions('Taccount', 1)).rejects.toThrow('invalid account transactions response envelope')
	})
})
