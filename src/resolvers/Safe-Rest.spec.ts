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
const moduleAddress = `0x${'2'.repeat(40)}`
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
			EntityType.EvmContract,
			EntityType.EvmNetworkAccount,
			EntityType.EvmNetworkAccount,
			EntityType.EvmNetworkAccount,
			EntityType.EvmNetworkAccount,
		])
	})

	it('rejects unsupported EIP-155 chains before HTTP', async () => {
		const contractResolver = safeRest.resolvers.find((resolver) => (
			resolver.entityType === EntityType.EvmContract
			&& 'threshold' in resolver.projections
		))
		if (contractResolver == null)
			throw new Error('missing EvmContract resolver')

		await expect(
			contractResolver.resolve.EvmNetworkAddress.resolve({
				$network: {
					caip2: {
						namespace: 'eip155',
						reference: '31337',
					},
				},
				address: safeAddress,
			}, context)
		).rejects.toThrow('no binding for chain 31337')
		expect(sourceGetJson).not.toHaveBeenCalled()
	})

	it('maps Safe status onto EvmContract Safe Directory fields', async () => {
		sourceGetJson.mockResolvedValue({
			address: safeAddress,
			nonce: '2',
			threshold: 1,
			owners: [
				ownerAddress,
			],
			masterCopy,
			modules: [
				moduleAddress,
			],
			fallbackHandler: recipientAddress,
			guard: zeroAddress,
			version: '1.4.1',
		})

		const contractResolver = safeRest.resolvers.find((resolver) => (
			resolver.entityType === EntityType.EvmContract
			&& 'threshold' in resolver.projections
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
		expect(contractResolver.projections.threshold(snapshot)).toBe(1)
		expect(contractResolver.projections.nonce(snapshot)).toBe('2')
		expect(contractResolver.projections.version(snapshot)).toBe('1.4.1')
		expect(contractResolver.projections.$$owners(snapshot)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					address: ownerAddress,
				},
			},
		])
		expect(contractResolver.projections.$$modules(snapshot)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$network: network,
					address: moduleAddress,
				},
			},
		])
		expect(contractResolver.projections.$fallbackHandler(snapshot)).toEqual({
			[EntityMetaKey.Selector]: {
				$network: network,
				address: recipientAddress,
			},
		})
		expect(contractResolver.projections.$guard(snapshot)).toBeUndefined()
	})

	it('maps Safe creation onto EvmContract $creationTransaction and $deployer', async () => {
		const creationHash = `0x${'3'.repeat(64)}`
		sourceGetJson.mockResolvedValue({
			created: '2024-01-01T00:00:00Z',
			creator: ownerAddress,
			transactionHash: creationHash,
			factoryAddress: masterCopy,
			masterCopy: `0x${'5'.repeat(40)}`,
		})

		const creationResolver = safeRest.resolvers.find((resolver) => (
			resolver.entityType === EntityType.EvmContract
			&& '$creationTransaction' in resolver.projections
			&& '$deployer' in resolver.projections
		))
		if (creationResolver == null)
			throw new Error('missing EvmContract creation resolver')

		const snapshot = await creationResolver.resolve.EvmNetworkAddress.resolve({
			$network: network,
			address: safeAddress,
		}, context)
		expect(creationResolver.projections.$creationTransaction(snapshot)).toEqual({
			[EntityMetaKey.Selector]: {
				$network: network,
				txHash: creationHash,
			},
		})
		expect(creationResolver.projections.$deployer(snapshot)).toEqual({
			[EntityMetaKey.Selector]: {
				address: ownerAddress,
			},
		})
	})

	it('keeps creation factory/setupData leftovers unprojected', async () => {
		const creationHash = `0x${'3'.repeat(64)}`
		const factoryAddress = `0x${'4'.repeat(40)}`
		sourceGetJson.mockResolvedValue({
			created: '2024-01-01T00:00:00Z',
			creator: ownerAddress,
			transactionHash: creationHash,
			factoryAddress,
			masterCopy,
			setupData: '0xabcd',
			dataDecoded: {
				method: 'setup',
				parameters: [],
			},
		})

		const creationResolver = safeRest.resolvers.find((resolver) => (
			resolver.entityType === EntityType.EvmContract
			&& '$creationTransaction' in resolver.projections
			&& '$deployer' in resolver.projections
		))
		if (creationResolver == null)
			throw new Error('missing EvmContract creation resolver')

		const snapshot = await creationResolver.resolve.EvmNetworkAddress.resolve({
			$network: network,
			address: safeAddress,
		}, context)
		expect(snapshot).toEqual({
			$creationTransaction: {
				[EntityMetaKey.Selector]: {
					$network: network,
					txHash: creationHash,
				},
			},
			$deployer: {
				[EntityMetaKey.Selector]: {
					address: ownerAddress,
				},
			},
		})
		expect(snapshot).not.toHaveProperty('factoryAddress')
		expect(snapshot).not.toHaveProperty('setupData')
		expect(snapshot).not.toHaveProperty('dataDecoded')
		expect(snapshot).not.toHaveProperty('$factory')
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
			&& '$$transactions' in resolver.projections
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

	it('maps queued Safe multisig transactions onto EvmNetworkAccount $$queuedTransactions', async () => {
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
					nonce: '2',
					executionDate: null,
					submissionDate: '2026-07-22T00:00:00Z',
					modified: '2026-07-22T00:00:00Z',
					blockNumber: null,
					transactionHash: null,
					safeTxHash,
					proposer: ownerAddress,
					executor: null,
					isExecuted: false,
					isSuccessful: null,
					confirmationsRequired: 1,
					confirmations: [],
					trusted: true,
					signatures: null,
				},
			],
		})

		const accountResolvers = safeRest.resolvers.filter((resolver) => (
			resolver.entityType === EntityType.EvmNetworkAccount
			&& '$$queuedTransactions' in resolver.projections
		))
		const listResolver = accountResolvers.find((resolver) => (
			typeof resolver.projections.$$queuedTransactions === 'function'
		))
		const countResolver = accountResolvers.find((resolver) => (
			typeof resolver.projections.$$queuedTransactions === 'object'
			&& resolver.projections.$$queuedTransactions != null
			&& 'resolveCount' in resolver.projections.$$queuedTransactions
		))
		if (listResolver == null || countResolver == null)
			throw new Error('missing EvmNetworkAccount $$queuedTransactions resolvers')

		const listSnapshot = await listResolver.resolve.EvmNetworkEvmAccount.resolve({
			$network: network,
			$actor: {
				address: safeAddress,
			},
		}, context)
		expect(listResolver.projections.$$queuedTransactions(listSnapshot)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$network: network,
					txHash: safeTxHash,
				},
			},
		])
		expect(sourceGetJson.mock.calls[0]?.[1]).toContain('executed=false')

		const countSnapshot = await countResolver.resolve.EvmNetworkEvmAccount.resolve({
			$network: network,
			$actor: {
				address: safeAddress,
			},
		}, context)
		expect(countResolver.projections.$$queuedTransactions.resolveCount(countSnapshot)).toBe(1)
	})
})
