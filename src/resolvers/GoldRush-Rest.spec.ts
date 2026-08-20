import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import {
	EvmInternalCallType,
	EvmTransactionExecutionStatus,
} from '$/constants/Evm.ts'
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

const { default: covalentResolvers } = await import('$/resolvers/Covalent-Rest.ts')

const transactionResolver = covalentResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.EvmTransaction
	&& '$$logs' in resolver.projections
))
const logResolver = covalentResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.EvmLog
))
const internalTransferResolver = covalentResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.EvmInternalTransfer
))

if (transactionResolver == null || logResolver == null || internalTransferResolver == null)
	throw new Error('GoldRushFoundational_Rest missing transaction/log/internal transfer resolvers')

const goldRushBinding = bindings[Source.GoldRushFoundational_Rest][0]
const transactionResponse = transactionFixture satisfies GoldRushTransactionResponse
const transactionEmptyResponse = transactionEmptyFixture satisfies GoldRushTransactionResponse
const transactionErrorResponse = transactionErrorFixture satisfies GoldRushTransactionResponse
const emptyContext = {
	filters: [],
	sorts: [],
	pagination: {},
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [],
	publicEnv: {},
}

describe('GoldRush Foundational transaction source', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('executes transaction_v2 and preserves freshness metadata', async () => {
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
			items: [{
				tx_hash: transactionResponse.data.items[0].tx_hash,
				internal_transfers: transactionResponse.data.items[0].internal_transfers,
			}],
		})
	})

	it('keeps empty and API-error envelopes distinct', async () => {
		expect(transactionEmptyResponse).toBe(transactionEmptyFixture)
		expect(transactionErrorResponse).toBe(transactionErrorFixture)
		sourceGetJson.mockResolvedValueOnce(transactionEmptyResponse)
		await expect(getTransaction({
			chainId: 1,
			chainName: 'eth-mainnet',
			txHash: '0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
		})).rejects.toThrow('transaction not found')

		sourceGetJson.mockResolvedValueOnce(transactionErrorResponse)
		await expect(getTransaction({
			chainId: 1,
			chainName: 'eth-mainnet',
			txHash: '0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
		})).rejects.toThrow('Invalid API key')
	})

	it('rejects response identity mismatches', async () => {
		sourceGetJson.mockResolvedValueOnce({
			...transactionResponse,
			data: {
				...transactionResponse.data,
				chain_id: 999,
			},
		})
		await expect(getTransaction({
			chainId: 1,
			chainName: 'eth-mainnet',
			txHash: transactionResponse.data.items[0].tx_hash,
		})).rejects.toThrow('response chain does not match request')
	})

	it('maps enrolled transaction fields plus log and internal-transfer leftovers', async () => {
		sourceGetJson.mockResolvedValueOnce(transactionResponse)
		const txHash = transactionResponse.data.items[0].tx_hash
		const resolved = await transactionResolver.resolve.EvmNetworkTxHash.resolve(
			{
				$network: {
					caip2: {
						namespace: 'eip155',
						reference: '1',
					},
				},
				txHash,
			},
			emptyContext
		)

		expect(resolved).toMatchObject({
			nonce: 6,
			executionStatus: EvmTransactionExecutionStatus.Success,
			$$internalTransfers: [
				{
					[EntityMetaKey.Selector]: {
						indexInTransaction: 0,
					},
					value: 500_000_000_000_000_000n,
					callType: EvmInternalCallType.Unknown,
				},
			],
		})
		expect(sourceGetJson).toHaveBeenCalledWith(
			goldRushBinding,
			`https://api.covalenthq.com/v1/eth-mainnet/transaction_v2/${txHash}/?with-internal=true&with-state=true`
		)
	})

	it('projects singular EvmLog and EvmInternalTransfer leftovers from transaction_v2', async () => {
		sourceGetJson
			.mockResolvedValueOnce(transactionResponse)
			.mockResolvedValueOnce(transactionResponse)

		const log = await logResolver.resolve.TransactionIndexInTransaction.resolve(
			{
				$transaction: {
					$network: {
						caip2: {
							namespace: 'eip155',
							reference: '1',
						},
					},
					txHash: transactionResponse.data.items[0].tx_hash,
				},
				indexInTransaction: 3,
			},
			emptyContext
		)
		expect(logResolver.projections.topic0(log)).toBe(
			'0xdddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd'
		)
		expect(logResolver.projections.data(log)).toBe('0x')

		const transfer = await internalTransferResolver.resolve.TransactionIndexInTransaction.resolve(
			{
				$transaction: {
					$network: {
						caip2: {
							namespace: 'eip155',
							reference: '1',
						},
					},
					txHash: transactionResponse.data.items[0].tx_hash,
				},
				indexInTransaction: 0,
			},
			emptyContext
		)
		expect(internalTransferResolver.projections.value(transfer)).toBe(500_000_000_000_000_000n)
		expect(internalTransferResolver.projections.callType(transfer)).toBe(EvmInternalCallType.Unknown)
	})

	it('rejects unsupported EIP-155 networks before transport', async () => {
		await expect(transactionResolver.resolve.EvmNetworkTxHash.resolve(
			{
				$network: {
					caip2: {
						namespace: 'eip155',
						reference: '999',
					},
				},
				txHash: transactionResponse.data.items[0].tx_hash,
			},
			emptyContext
		)).rejects.toThrow('unsupported chain 999')
		expect(sourceGetJson).not.toHaveBeenCalled()
	})
})
