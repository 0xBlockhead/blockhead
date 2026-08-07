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

const { getAccount, getAccountTransactions, getBlock, getContract, getTokenOverview, getTransaction, getTrc10Token, getTrc20Transfers } = await import('$/sources/TronScan/Rest/queries.ts')

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
				extraAccountField: true,
			})
			.mockResolvedValueOnce({
				total: 1,
				rangeTotal: 1,
				data: [{
					number: 77,
					hash: 'block-hash',
					timestamp: 1_720_000_000_000,
					// Live explorer versions return version as a string.
					version: '29',
					nrOfTrx: 866,
					size: 202067,
					confirmed: true,
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
				version: '29',
				nrOfTrx: 866,
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

	it('accepts token / contract / trc20 transfer envelopes', async () => {
		sourceGetJson
			.mockResolvedValueOnce({
				all: 193563,
				total: 1,
				tokens: [{
					contractAddress: 'Ttoken',
					name: 'USDT',
					decimals: 6,
					marketCapUSD: 1,
				}],
			})
			.mockResolvedValueOnce({
				total: 1,
				contractMap: {},
				data: [{
					id: '1002000',
					name: 'BitTorrent',
					precision: 6,
					reputation: 'Ok',
				}],
			})
			.mockResolvedValueOnce({
				type: 'null',
				count: 0,
				status: {
					code: 0,
					message: 'SUCCESS',
				},
				data: [{
					address: 'Tcontract',
					name: 'USDT',
					balance: 1,
					trc20token: {
						symbol: 'USDT',
						decimals: 6,
					},
				}],
			})
			.mockResolvedValueOnce({
				token_transfers: [{
					transaction_id: 'tx-hash',
					contract_address: 'Ttoken',
					from_address: 'Tfrom',
					to_address: 'Tto',
					quant: '1000',
					block_ts: 1_720_000_000_000,
					riskTransaction: false,
				}],
			})

		await expect(getTokenOverview('Ttoken')).resolves.toMatchObject({
			tokens: [{
				contractAddress: 'Ttoken',
			}],
		})
		await expect(getTrc10Token('1002000')).resolves.toMatchObject({
			data: [{
				id: '1002000',
			}],
		})
		await expect(getContract('Tcontract')).resolves.toMatchObject({
			data: [{
				address: 'Tcontract',
			}],
		})
		await expect(getTrc20Transfers('tx-hash', 20)).resolves.toMatchObject({
			token_transfers: [{
				transaction_id: 'tx-hash',
			}],
		})
	})

	it('accepts account transaction list envelopes with explorer drift keys', async () => {
		sourceGetJson.mockResolvedValueOnce({
			normalAddressInfo: {
				Taccount: {
					risk: false,
				},
			},
			total: 1,
			rangeTotal: 1,
			wholeChainTxCount: 2,
			contractMap: {},
			data: [{
				hash: 'transaction-hash',
				block: 77,
				timestamp: 1_720_000_000_000,
				ownerAddress: 'Taccount',
				contractType: 1,
				contractRet: 'SUCCESS',
				riskTransaction: false,
			}],
		})

		await expect(getAccountTransactions('Taccount', 1)).resolves.toMatchObject({
			total: 1,
			data: [{
				hash: 'transaction-hash',
			}],
		})
	})

	it('fail-closes malformed token / contract / trc20 transfer envelopes', async () => {
		sourceGetJson
			.mockResolvedValueOnce({
				tokens: [{
					decimals: -1,
				}],
			})
			.mockResolvedValueOnce({
				data: 'not-an-array',
			})
			.mockResolvedValueOnce({
				token_transfers: [{
					block_ts: -1,
				}],
			})

		await expect(getTokenOverview('Ttoken')).rejects.toThrow('invalid token overview response envelope')
		await expect(getContract('Tcontract')).rejects.toThrow('invalid contract response envelope')
		await expect(getTrc20Transfers('tx-hash', 1)).rejects.toThrow('invalid trc20 transfers response envelope')
	})
})
