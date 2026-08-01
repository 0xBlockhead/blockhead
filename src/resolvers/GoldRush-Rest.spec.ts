import { beforeEach, describe, expect, it, vi } from 'vitest'

import { EvmTransactionExecutionStatus } from '$/constants/Evm.ts'
import { EntityMetaKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import bindings from '$/sources/Covalent/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { getTransaction } from '$/sources/Covalent/GoldRush/Rest/queries.ts'
import type { GoldRushTransactionResponse } from '$/sources/Covalent/GoldRush/Rest/types.ts'
import transactionFixture from '$/sources/Covalent/GoldRush/Rest/fixtures/transaction.json'
import transactionEmptyFixture from '$/sources/Covalent/GoldRush/Rest/fixtures/transaction-empty.json'
import transactionErrorFixture from '$/sources/Covalent/GoldRush/Rest/fixtures/transaction-error.json'

const { sourceGetJson } = vi.hoisted(() => ({
	sourceGetJson: vi.fn(),
}))

vi.mock('$/sources/_runtime/http.ts', async (importOriginal) => ({
	...await importOriginal(),
	sourceGetJson,
}))

const { default: goldRushResolvers } = await import('$/resolvers/GoldRush-Rest.ts')

const transactionResolver = goldRushResolvers.resolvers[0]
const goldRushBinding = bindings[Source.GoldRushFoundational_Rest]
const transactionResponse = transactionFixture satisfies GoldRushTransactionResponse
const transactionEmptyResponse = transactionEmptyFixture satisfies GoldRushTransactionResponse
const transactionErrorResponse = transactionErrorFixture satisfies GoldRushTransactionResponse

describe('GoldRush Foundational transaction source', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('executes transaction_v2 and preserves freshness metadata', async () => {
		expect(transactionResponse).toBe(transactionFixture)
		sourceGetJson.mockResolvedValueOnce(transactionResponse)

		await expect(getTransaction({
			chainId: 1,
			chainName: 'eth-mainnet',
			txHash: transactionResponse.data.items[0].tx_hash,
			expansions: {
				withInternal: true,
				withState: true,
				withInputData: true,
			},
		})).resolves.toMatchObject({
			updated_at: transactionResponse.data.updated_at,
			chain_id: 1,
			chain_name: 'eth-mainnet',
			items: [{
				tx_hash: transactionResponse.data.items[0].tx_hash,
				internal_transfers: transactionResponse.data.items[0].internal_transfers,
				state_changes: transactionResponse.data.items[0].state_changes,
				input_data: transactionResponse.data.items[0].input_data,
			}],
		})
		expect(sourceGetJson).toHaveBeenCalledWith(
			goldRushBinding,
			`https://api.covalenthq.com/v1/eth-mainnet/transaction_v2/${transactionResponse.data.items[0].tx_hash}/?with-internal=true&with-state=true&with-input-data=true`
		)
	})

	it('keeps empty and API-error envelopes distinct', async () => {
		expect(transactionEmptyResponse).toBe(transactionEmptyFixture)
		expect(transactionErrorResponse).toBe(transactionErrorFixture)
		sourceGetJson.mockResolvedValueOnce(transactionEmptyResponse)
		await expect(getTransaction({
			chainId: 1,
			chainName: 'eth-mainnet',
			txHash: '0xmissing',
		})).rejects.toThrow('transaction not found')

		sourceGetJson.mockResolvedValueOnce(transactionErrorResponse)
		await expect(getTransaction({
			chainId: 1,
			chainName: 'eth-mainnet',
			txHash: '0xunauthorized',
		})).rejects.toThrow('Invalid API key')
	})

	it('rejects response identity mismatches', async () => {
		sourceGetJson.mockResolvedValueOnce({
			...transactionResponse,
			data: {
				...transactionResponse.data,
				chain_id: 137,
			},
		})
		await expect(getTransaction({
			chainId: 1,
			chainName: 'eth-mainnet',
			txHash: transactionResponse.data.items[0].tx_hash,
		})).rejects.toThrow('response chain does not match request')

		sourceGetJson.mockResolvedValueOnce({
			...transactionResponse,
			data: {
				...transactionResponse.data,
				items: [{
					...transactionResponse.data.items[0],
					tx_hash: '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
				}],
			},
		})
		await expect(getTransaction({
			chainId: 1,
			chainName: 'eth-mainnet',
			txHash: transactionResponse.data.items[0].tx_hash,
		})).rejects.toThrow('response transaction does not match request')
	})

	it('maps exactly the approved EVM transaction fields and log selectors', async () => {
		sourceGetJson.mockResolvedValueOnce(transactionResponse)
		const txHash = transactionResponse.data.items[0].tx_hash
		const resolved = await transactionResolver.resolve[
			'EvmNetworkTxHash'
		].resolve(
			{
				$network: {
					caip2: {
						namespace: 'eip155',
						reference: '1',
					},
				},
				txHash,
			},
			{
				filters: [],
				sorts: [],
				pagination: {},
				selectorKeys: [],
				parentSelectorKeys: [],
				sources: [],
				publicEnv: {},
			}
		)

		expect(Object.keys(transactionResolver.projections).sort()).toEqual([
			'$$logs',
			'$block',
			'$from',
			'$to',
			'executionStatus',
			'gas',
			'gasPrice',
			'gasUsed',
			'indexInBlock',
			'value',
		].sort())
		expect(resolved).toMatchObject({
			$block: {
				[EntityMetaKey.Selector]: {
					blockNumber: 22_900_000n,
				},
			},
			indexInBlock: 7,
			$from: {
				[EntityMetaKey.Selector]: {
					address: '0x1111111111111111111111111111111111111111',
				},
			},
			$to: {
				[EntityMetaKey.Selector]: {
					address: '0x2222222222222222222222222222222222222222',
				},
			},
			value: 1_000_000_000_000_000_000n,
			gas: 21_000n,
			gasPrice: 25_000_000_000n,
			gasUsed: 21_000n,
			executionStatus: EvmTransactionExecutionStatus.Success,
			$$logs: [
				{
					[EntityMetaKey.Selector]: {
						indexInTransaction: 3,
					},
				},
			],
		})
	})

	it('rejects unsafe integer transaction quantities before bigint conversion', async () => {
		sourceGetJson.mockResolvedValueOnce({
			...transactionResponse,
			data: {
				...transactionResponse.data,
				items: [{
					...transactionResponse.data.items[0],
					gas_price: Number.MAX_SAFE_INTEGER + 1,
				}],
			},
		})

		await expect(transactionResolver.resolve[
			'EvmNetworkTxHash'
		].resolve(
			{
				$network: {
					caip2: {
						namespace: 'eip155',
						reference: '1',
					},
				},
				txHash: transactionResponse.data.items[0].tx_hash,
			},
			{
				filters: [],
				sorts: [],
				pagination: {},
				selectorKeys: [],
				parentSelectorKeys: [],
				sources: [],
				publicEnv: {},
			}
		)).rejects.toThrow('expected nonnegative safe integer')
	})

	it('rejects unsupported EIP-155 networks before transport', async () => {
		await expect(transactionResolver.resolve[
			'EvmNetworkTxHash'
		].resolve(
			{
				$network: {
					caip2: {
						namespace: 'eip155',
						reference: '137',
					},
				},
				txHash: transactionResponse.data.items[0].tx_hash,
			},
			{
				filters: [],
				sorts: [],
				pagination: {},
				selectorKeys: [],
				parentSelectorKeys: [],
				sources: [],
				publicEnv: {},
			}
		)).rejects.toThrow('unsupported chain 137')
		expect(sourceGetJson).not.toHaveBeenCalled()
	})
})
