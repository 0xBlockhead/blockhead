import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import { EntityMetaKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

const sourceGetJson = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_runtime/http.ts', async (importOriginal) => ({
	...await importOriginal<typeof import('$/sources/_runtime/http.ts')>(),
	sourceGetJson,
}))

const { default: safeRest } = await import('$/resolvers/Safe-Rest.ts')

const chainId = 8453
const safeAddress = `0x${'a'.repeat(40)}`
const ownerAddress = `0x${'b'.repeat(40)}`
const recipientAddress = `0x${'c'.repeat(40)}`
const masterCopy = `0x${'1'.repeat(40)}`
const zeroAddress = `0x${'0'.repeat(40)}`
const safeTxHash = `0x${'d'.repeat(64)}`
const executionHash = `0x${'e'.repeat(64)}`

const network = {
	caip2: {
		namespace: 'eip155',
		reference: String(chainId),
	},
}

const context = {
	filters: [],
	sorts: [],
	pagination: {
		limit: 16,
	},
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [],
	publicEnv: {},
}

describe('Safe Transaction Service resolver module', () => {
	beforeEach(() => {
		sourceGetJson.mockReset()
	})

	it('registers under SafeTransactionService_Rest for EvmContract and EvmNetworkAccount', () => {
		expect(safeRest.source).toBe(Source.SafeTransactionService_Rest)
		expect(safeRest.resolvers.map((resolver) => resolver.entityType)).toEqual([
			EntityType.EvmContract,
			EntityType.EvmNetworkAccount,
			EntityType.EvmNetworkAccount,
		])
	})

	it('rejects unsupported EIP-155 chains before HTTP', async () => {
		const contractResolver = safeRest.resolvers.find((resolver) => (
			resolver.entityType === EntityType.EvmContract
		))
		if (contractResolver == null)
			throw new Error('missing EvmContract resolver')

		await expect(
			contractResolver.resolve.EvmNetworkAddress.resolve({
				$network: {
					caip2: {
						namespace: 'eip155',
						reference: '999',
					},
				},
				address: safeAddress,
			}, context)
		).rejects.toThrow('no binding for chain 999')
		expect(sourceGetJson).not.toHaveBeenCalled()
	})

	it('maps Safe masterCopy onto EvmContract $implementation', async () => {
		sourceGetJson.mockResolvedValue({
			address: safeAddress,
			nonce: '2',
			threshold: 1,
			owners: [
				ownerAddress,
			],
			masterCopy,
			modules: [],
			fallbackHandler: recipientAddress,
			guard: zeroAddress,
			version: '1.4.1',
		})

		const contractResolver = safeRest.resolvers.find((resolver) => (
			resolver.entityType === EntityType.EvmContract
		))
		if (contractResolver == null)
			throw new Error('missing EvmContract resolver')

		const snapshot = await contractResolver.resolve.EvmNetworkAddress.resolve({
			$network: network,
			address: safeAddress,
		}, context)
		expect(contractResolver.projections.$implementation(snapshot)).toEqual({
			[EntityMetaKey.Selector]: {
				$network: network,
				address: masterCopy,
			},
		})
	})

	it('maps executed Safe multisig transactions onto EvmNetworkAccount $$transactions', async () => {
		sourceGetJson.mockResolvedValue({
			count: 1,
			next: null,
			previous: null,
			results: [
				{
					safe: safeAddress,
					to: recipientAddress,
					value: '0',
					data: '0x',
					operation: 0,
					safeTxGas: '0',
					baseGas: '0',
					gasPrice: '0',
					gasToken: zeroAddress,
					refundReceiver: zeroAddress,
					nonce: '1',
					executionDate: '2026-07-22T00:00:00Z',
					submissionDate: '2026-07-22T00:00:00Z',
					modified: '2026-07-22T00:00:00Z',
					blockNumber: 1,
					transactionHash: executionHash,
					safeTxHash,
					proposer: ownerAddress,
					executor: ownerAddress,
					isExecuted: true,
					isSuccessful: true,
					confirmationsRequired: 1,
					confirmations: [],
					trusted: true,
					signatures: null,
				},
			],
		})

		const accountResolvers = safeRest.resolvers.filter((resolver) => (
			resolver.entityType === EntityType.EvmNetworkAccount
		))
		const listResolver = accountResolvers.find((resolver) => (
			typeof resolver.projections.$$transactions === 'function'
		))
		const countResolver = accountResolvers.find((resolver) => (
			typeof resolver.projections.$$transactions === 'object'
			&& resolver.projections.$$transactions != null
			&& 'resolveCount' in resolver.projections.$$transactions
		))
		if (listResolver == null || countResolver == null)
			throw new Error('missing EvmNetworkAccount $$transactions resolvers')

		const listSnapshot = await listResolver.resolve.EvmNetworkEvmAccount.resolve({
			$network: network,
			$actor: {
				address: safeAddress,
			},
		}, context)
		expect(listResolver.projections.$$transactions(listSnapshot)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$network: network,
					txHash: executionHash,
				},
			},
		])

		const countSnapshot = await countResolver.resolve.EvmNetworkEvmAccount.resolve({
			$network: network,
			$actor: {
				address: safeAddress,
			},
		}, context)
		expect(countResolver.projections.$$transactions.resolveCount(countSnapshot)).toBe(1)
	})
})
