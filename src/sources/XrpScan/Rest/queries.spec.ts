import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import { sourceGetJson } from '$/sources/_runtime/http.ts'
import bindings from '$/sources/XrpScan/bindings.ts'
import { Source } from '$/sources/Source.ts'

vi.mock('$/sources/_runtime/http.ts', () => ({
	firstHttpUrlForBinding: () => 'https://api.xrpscan.com',
	sourceGetJson: vi.fn(),
}))

const sourceGetJsonMock = vi.mocked(sourceGetJson)
const queries = await import('$/sources/XrpScan/Rest/queries.ts')
const {
	getAccount,
	getAccountTransactions,
	getAccountTrustlines,
	getAmm,
	getLedger,
	getLedgers,
	getLedgerTransactions,
	getObject,
	getServerInfo,
	getTransaction,
} = queries

const binding = bindings[Source.XrpScan_Rest][0]

describe('XrpScan Rest fail-closed envelopes', () => {
	beforeEach(() => {
		sourceGetJsonMock.mockReset()
	})

	it('asserts server_info / account / ledger / tx / amm / object envelopes', async () => {
		sourceGetJsonMock
			.mockResolvedValueOnce({
				info: {
					complete_ledgers: '1-10',
					load_factor: 1,
					peers: 12,
					validated_ledger: {
						hash: 'ABCDEF',
						seq: 10,
					},
				},
			})
			.mockResolvedValueOnce({
				Account: 'rAccount',
				Balance: '1000',
				Flags: 0,
				LedgerEntryType: 'AccountRoot',
				OwnerCount: 0,
				Sequence: 1,
				ledger_index: 32570,
			})
			.mockResolvedValueOnce({
				ledger_index: 80000000,
				ledger_hash: 'LEDGERHASH',
				close_time: 1684953531,
				parent_hash: 'PARENTHASH',
				transaction_hash: 'TXHASH',
				total_coins: '99988894618845390',
			})
			.mockResolvedValueOnce({
				hash: 'TXHASH',
				TransactionType: 'Payment',
				Account: 'rAccount',
				Sequence: 1,
				Fee: '12',
				ledger_index: 80000000,
				date: '2023-05-24T18:38:51.000Z',
				validated: true,
				meta: {
					TransactionResult: 'tesSUCCESS',
				},
			})
			.mockResolvedValueOnce({
				account: 'rAmm',
				amount: '100',
				amount2: {
					currency: 'USD',
					issuer: 'rIssuer',
					value: '1',
				},
				lp_token: {
					currency: 'LP',
					issuer: 'rAmm',
					value: '2',
				},
				trading_fee: 290,
			})
			.mockResolvedValueOnce({
				index: 'ENTRYHASH',
				ledger_hash: 'LEDGERHASH',
				ledger_index: 80000000,
				node: {
					LedgerEntryType: 'AccountRoot',
					Account: 'rAccount',
				},
				validated: true,
			})

		await expect(getServerInfo()).resolves.toMatchObject({
			info: {
				validated_ledger: {
					seq: 10,
				},
			},
		})
		await expect(getAccount('rAccount')).resolves.toMatchObject({
			Balance: '1000',
		})
		await expect(getLedger(80000000)).resolves.toMatchObject({
			ledger_hash: 'LEDGERHASH',
		})
		await expect(getTransaction('TXHASH')).resolves.toMatchObject({
			TransactionType: 'Payment',
		})
		await expect(getAmm('rAmm')).resolves.toMatchObject({
			trading_fee: 290,
		})
		await expect(getObject('ENTRYHASH')).resolves.toMatchObject({
			validated: true,
		})

		expect(sourceGetJsonMock).toHaveBeenNthCalledWith(
			1,
			binding,
			'https://api.xrpscan.com/api/v1/network/server_info'
		)
		expect(sourceGetJsonMock).toHaveBeenNthCalledWith(
			2,
			binding,
			'https://api.xrpscan.com/api/v1/account/rAccount'
		)
		expect(sourceGetJsonMock).toHaveBeenNthCalledWith(
			3,
			binding,
			'https://api.xrpscan.com/api/v1/ledger/80000000'
		)
		expect(sourceGetJsonMock).toHaveBeenNthCalledWith(
			4,
			binding,
			'https://api.xrpscan.com/api/v1/tx/TXHASH'
		)
		expect(sourceGetJsonMock).toHaveBeenNthCalledWith(
			5,
			binding,
			'https://api.xrpscan.com/api/v1/amm/rAmm'
		)
		expect(sourceGetJsonMock).toHaveBeenNthCalledWith(
			6,
			binding,
			'https://api.xrpscan.com/api/v1/object/ENTRYHASH'
		)
	})

	it('asserts account transactions / trustlines / ledgers list / ledger transactions', async () => {
		sourceGetJsonMock
			.mockResolvedValueOnce({
				account: 'rAccount',
				ledger_index_min: 1,
				ledger_index_max: 10,
				marker: 'next',
				transactions: [{
					hash: 'TXHASH',
					TransactionType: 'Payment',
					Account: 'rAccount',
					ledger_index: 9,
					validated: true,
					meta: {
						TransactionResult: 'tesSUCCESS',
					},
				}],
			})
			.mockResolvedValueOnce({
				account: 'rAccount',
				ledger_current_index: 10,
				validated: false,
				lines: [{
					account: 'rIssuer',
					balance: '0',
					currency: 'USD',
					limit: '100',
					limit_peer: '0',
				}],
			})
			.mockResolvedValueOnce({
				current_ledger: 10,
				ledgers: [{
					ledger_index: 10,
					ledger_hash: 'TIP',
					close_time: 1,
				}],
			})
			.mockResolvedValueOnce([{
				hash: 'TXHASH',
				TransactionType: 'OfferCreate',
				Account: 'rAccount',
				Fee: 15,
				ledger_index: 10,
			}])

		await expect(getAccountTransactions({
			account: 'rAccount',
			limit: 25,
			marker: 'next',
		})).resolves.toMatchObject({
			marker: 'next',
		})
		await expect(getAccountTrustlines({
			account: 'rAccount',
		})).resolves.toMatchObject({
			validated: false,
		})
		await expect(getLedgers()).resolves.toMatchObject({
			current_ledger: 10,
		})
		await expect(getLedgerTransactions(10)).resolves.toHaveLength(1)

		expect(sourceGetJsonMock).toHaveBeenNthCalledWith(
			1,
			binding,
			'https://api.xrpscan.com/api/v1/account/rAccount/transactions?limit=25&marker=next'
		)
		expect(sourceGetJsonMock).toHaveBeenNthCalledWith(
			2,
			binding,
			'https://api.xrpscan.com/api/v1/account/rAccount/trustlines2'
		)
		expect(sourceGetJsonMock).toHaveBeenNthCalledWith(
			3,
			binding,
			'https://api.xrpscan.com/api/v1/ledgers'
		)
		expect(sourceGetJsonMock).toHaveBeenNthCalledWith(
			4,
			binding,
			'https://api.xrpscan.com/api/v1/ledger/10/transactions'
		)
	})

	it.each([
		[
			'account',
			() => getAccount('rAccount'),
			{
				Account: 'rAccount',
			},
		],
		[
			'server_info',
			() => getServerInfo(),
			{
				info: {
					peers: -1,
				},
			},
		],
		[
			'transaction',
			() => getTransaction('TXHASH'),
			{
				hash: 'TXHASH',
			},
		],
		[
			'amm',
			() => getAmm('rAmm'),
			{
				account: 'rAmm',
			},
		],
	] as const)('rejects invalid %s envelopes', async (_label, run, payload) => {
		sourceGetJsonMock.mockResolvedValueOnce(payload)
		await expect(run()).rejects.toThrow(/invalid .+ response envelope/)
	})

	it('exports the modeled explorer operations', () => {
		expect(Object.keys(queries).sort()).toEqual([
			'getAccount',
			'getAccountTransactions',
			'getAccountTrustlines',
			'getAmm',
			'getLedger',
			'getLedgerTransactions',
			'getLedgers',
			'getObject',
			'getServerInfo',
			'getTransaction',
		])
	})
})
