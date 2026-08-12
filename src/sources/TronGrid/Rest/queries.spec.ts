import { beforeEach, describe, expect, it, vi } from 'vitest'

import { Source } from '$/sources/Source.ts'
import bindings from '$/sources/TronGrid/bindings.ts'
import { SourceDelivery } from '$/sources/SourceBinding.ts'

const {
	sourceFetch,
	sourceGetJson,
} = vi.hoisted(() => ({
	sourceFetch: vi.fn(),
	sourceGetJson: vi.fn(),
}))

vi.mock('$/sources/_runtime/http.ts', async (importOriginal) => ({
	...await importOriginal<typeof import('$/sources/_runtime/http.ts')>(),
	sourceFetch,
	sourceGetJson,
}))

const {
	getAccountResource,
	getAccountTransactions,
	getBlockByNumber,
	getNowBlock,
	getTransactionInfoById,
	listWitnesses,
} = await import('$/sources/TronGrid/Rest/queries.ts')

const binding = bindings[Source.TronGrid_Rest][0]

it('routes POST and GET reads through the declared HTTP proxy binding', async () => {
	sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify({
		blockID: 'block-id',
		block_header: {
			raw_data: {
				number: 7,
				timestamp: 1_720_000_000_000,
			},
		},
	})))
	sourceGetJson.mockResolvedValueOnce({
		data: [{
			txID: 'tx-id',
		}],
	})
	expect(binding.delivery).toBe(SourceDelivery.HttpProxy)

	await getBlockByNumber({
		height: 7n,
	})
	await getAccountTransactions({
		address: 'Taccount',
		limit: 25,
	})

	expect(sourceFetch).toHaveBeenCalledWith(
		binding,
		'https://api.trongrid.io/wallet/getblockbynum',
		expect.objectContaining({
			method: 'POST',
		})
	)
	expect(sourceGetJson).toHaveBeenCalledWith(
		binding,
		'https://api.trongrid.io/v1/accounts/Taccount/transactions?limit=25'
	)
})

describe('TronGrid / TronNodeRest arktype envelopes', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('accepts block and account-transaction envelopes', async () => {
		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			blockID: 'block-id',
			block_header: {
				raw_data: {
					number: 7,
					timestamp: 1_720_000_000_000,
				},
			},
			transactions: [{
				txID: 'tx-id',
				raw_data: {
					timestamp: 1_720_000_000_000,
				},
			}],
		})))
		sourceGetJson.mockResolvedValueOnce({
			success: true,
			meta: {
				at: 1_720_000_000_000,
				page_size: 1,
			},
			data: [{
				txID: 'tx-id',
				blockNumber: 7,
				block_timestamp: 1_720_000_000_000,
				energy_usage: 100,
				energy_usage_total: 100,
				energy_fee: 0,
				net_usage: 200,
				net_fee: 0,
				internal_transactions: [],
				ret: [{
					contractRet: 'SUCCESS',
				}],
			}],
		})

		await expect(getBlockByNumber({
			height: 7n,
		})).resolves.toMatchObject({
			blockID: 'block-id',
		})
		await expect(getAccountTransactions({
			address: 'Taccount',
			limit: 1,
		})).resolves.toMatchObject({
			data: [{
				txID: 'tx-id',
				blockNumber: 7,
				energy_usage_total: 100,
			}],
		})
	})

	it('accepts now-block, account-resource, witnesses, and transaction-info leftovers', async () => {
		sourceFetch
			.mockResolvedValueOnce(new Response(JSON.stringify({
				blockID: 'now-block',
				block_header: {
					raw_data: {
						number: 9,
						timestamp: 1_720_000_000_100,
						version: 29,
					},
				},
			})))
			.mockResolvedValueOnce(new Response(JSON.stringify({
				freeNetUsed: 1,
				freeNetLimit: 600,
				NetUsed: 2,
				NetLimit: 3,
				EnergyUsed: 4,
				EnergyLimit: 5,
				TotalNetLimit: 43_200_000_000,
				TotalEnergyLimit: 90_000_000_000,
			})))
			.mockResolvedValueOnce(new Response(JSON.stringify({
				witnesses: [{
					address: 'Twitness',
					url: 'https://witness.example',
					voteCount: 42,
					isJobs: true,
				}],
			})))
			.mockResolvedValueOnce(new Response(JSON.stringify({
				id: 'tx-id',
				blockNumber: 9,
				blockTimeStamp: 1_720_000_000_100,
				contract_address: 'Tcontract',
				resMessage: 'DEADBEEF',
				contractResult: ['00'],
				log: [{
					address: 'Tcontract',
				}],
				internal_transactions: [],
				receipt: {
					result: 'SUCCESS',
					energy_usage: 10,
					origin_energy_usage: 2,
					energy_usage_total: 12,
					energy_fee: 3,
					energy_penalty_total: 1,
					net_usage: 200,
					net_fee: 4,
				},
			})))

		await expect(getNowBlock()).resolves.toMatchObject({
			blockID: 'now-block',
		})
		await expect(getAccountResource({
			address: 'Taccount',
		})).resolves.toMatchObject({
			freeNetLimit: 600,
			EnergyLimit: 5,
		})
		await expect(listWitnesses()).resolves.toMatchObject({
			witnesses: [{
				address: 'Twitness',
			}],
		})
		await expect(getTransactionInfoById({
			transactionId: 'tx-id',
		})).resolves.toMatchObject({
			contract_address: 'Tcontract',
			receipt: {
				energy_usage_total: 12,
				net_fee: 4,
			},
			log: [{
				address: 'Tcontract',
			}],
		})
	})

	it('rejects ambiguous witness identities', async () => {
		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			witnesses: [
				{
					address: 'Twitness',
				},
				{
					address: 'Twitness',
				},
			],
		})))
		await expect(listWitnesses()).rejects.toThrow('witness response contains invalid identity')

		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			witnesses: [{
				address: '',
			}],
		})))
		await expect(listWitnesses()).rejects.toThrow('witness response contains invalid identity')
	})

	it('fail-closes malformed block and account-transaction envelopes', async () => {
		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			block_header: {
				raw_data: {
					number: -1,
				},
			},
		})))
		sourceGetJson.mockResolvedValueOnce({
			data: [{
				ret: [{
					fee: -1,
				}],
			}],
		})

		await expect(getBlockByNumber({
			height: 7n,
		})).rejects.toThrow('invalid block response envelope')
		await expect(getAccountTransactions({
			address: 'Taccount',
			limit: 1,
		})).rejects.toThrow('invalid account transactions response envelope')
	})

	it('fail-closes malformed account-resource and transaction-info leftovers', async () => {
		sourceFetch
			.mockResolvedValueOnce(new Response(JSON.stringify({
				EnergyLimit: -1,
			})))
			.mockResolvedValueOnce(new Response(JSON.stringify({
				receipt: {
					energy_usage_total: -1,
				},
			})))

		await expect(getAccountResource({
			address: 'Taccount',
		})).rejects.toThrow('invalid account resource response envelope')
		await expect(getTransactionInfoById({
			transactionId: 'tx-id',
		})).rejects.toThrow('invalid transaction info response envelope')
	})
})
