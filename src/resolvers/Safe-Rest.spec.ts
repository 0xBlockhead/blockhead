import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'
import { createResolverContext } from '../../tests/resolverContext.ts'

import * as Address from 'ox/Address'

import { SafeMultisigOperation } from '$/constants/Safe.ts'
import {
	entityFieldAddressKey,
	EntityMetaKey,
} from '$/schema/$schema.ts'
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

const submittedAtMs = Date.parse('2026-07-22T00:00:00Z')
const laterExecutedAtMs = Date.parse('2026-07-22T01:00:00Z')

const safeField = (
	name: Parameters<typeof entityFieldAddressKey>[2]
) => entityFieldAddressKey(EntityType.SafeMultisigTransaction, [], name)

const context = {
	...createResolverContext(),
	pagination: {
		limit: 16,
	},
}

describe('Safe Transaction Service resolver module', () => {
	beforeEach(() => {
		sourceGetJson.mockReset()
	})

	it('registers under SafeTransactionService_Rest for EvmContract, EvmNetworkAccount, and SafeMultisigTransaction', async () => {
		expect(safeRest.source).toBe(Source.SafeTransactionService_Rest)
		expect(safeRest.resolvers.map((resolver) => resolver.entityType)).toEqual([
			EntityType.EvmContract,
			EntityType.EvmContract,
			EntityType.EvmNetworkAccount,
			EntityType.EvmNetworkAccount,
			EntityType.EvmNetworkAccount,
			EntityType.EvmNetworkAccount,
			EntityType.SafeMultisigTransaction,
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

	it('maps executed Safe multisig transactions onto EvmNetworkAccount $$safeMultisigTransactions', async () => {
		sourceGetJson.mockResolvedValue({
			count: 1,
			next: `https://api.safe.global/tx-service/base/api/v2/safes/${Address.checksum(safeAddress)}/multisig-transactions/?limit=16&offset=16&executed=true`,
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
			&& '$$safeMultisigTransactions' in resolver.projections
		))
		const listResolver = accountResolvers.find((resolver) => (
			typeof resolver.projections.$$safeMultisigTransactions === 'object'
			&& resolver.projections.$$safeMultisigTransactions != null
			&& 'select' in resolver.projections.$$safeMultisigTransactions
		))
		const countResolver = accountResolvers.find((resolver) => (
			typeof resolver.projections.$$safeMultisigTransactions === 'object'
			&& resolver.projections.$$safeMultisigTransactions != null
			&& 'resolveCount' in resolver.projections.$$safeMultisigTransactions
		))
		if (listResolver == null || countResolver == null)
			throw new Error('missing EvmNetworkAccount $$safeMultisigTransactions resolvers')

		const listSnapshot = await listResolver.resolve.EvmNetworkEvmAccount.resolve({
			$network: network,
			$actor: {
				address: safeAddress,
			},
		}, context)
		expect(listResolver.projections.$$safeMultisigTransactions.select(listSnapshot)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$network: network,
					safeTxHash,
				},
				[EntityMetaKey.Fields]: {
					[safeField('$safe')]: {
						[EntityMetaKey.Selector]: {
							$network: network,
							address: safeAddress,
						},
					},
					[safeField('$to')]: {
						[EntityMetaKey.Selector]: {
							address: recipientAddress,
						},
					},
					[safeField('value')]: 0n,
					[safeField('operation')]: SafeMultisigOperation.Call,
					[safeField('nonce')]: 1n,
					[safeField('safeTxGas')]: 0n,
					[safeField('baseGas')]: 0n,
					[safeField('gasPrice')]: 0n,
					[safeField('gasToken')]: zeroAddress,
					[safeField('$refundReceiver')]: {
						[EntityMetaKey.Selector]: {
							address: zeroAddress,
						},
					},
					[safeField('$proposer')]: {
						[EntityMetaKey.Selector]: {
							address: ownerAddress,
						},
					},
					[safeField('$executor')]: {
						[EntityMetaKey.Selector]: {
							address: ownerAddress,
						},
					},
					[safeField('isExecuted')]: true,
					[safeField('isSuccessful')]: true,
					[safeField('confirmationsRequired')]: 1,
					[safeField('submittedAtMs')]: submittedAtMs,
					[safeField('executedAtMs')]: submittedAtMs,
					[safeField('modifiedAtMs')]: submittedAtMs,
					[safeField('$executionTransaction')]: {
						[EntityMetaKey.Selector]: {
							$network: network,
							txHash: executionHash,
						},
					},
				},
			},
		])
		expect(listResolver.projections.$$safeMultisigTransactions.continuation(listSnapshot)).toEqual({
			operation: 'safe-executed-transactions',
			target: 'safe-transaction-service',
			terminal: false,
			token: '16',
		})

		const countSnapshot = await countResolver.resolve.EvmNetworkEvmAccount.resolve({
			$network: network,
			$actor: {
				address: safeAddress,
			},
		}, context)
		expect(countResolver.projections.$$safeMultisigTransactions.resolveCount(countSnapshot)).toBe(1)
	})

	it('uses the Safe continuation offset for later executed transaction pages', async () => {
		sourceGetJson.mockResolvedValue({
			count: 24,
			next: null,
			previous: null,
			results: [],
		})

		const listResolver = safeRest.resolvers.find((resolver) => (
			resolver.entityType === EntityType.EvmNetworkAccount
			&& '$$safeMultisigTransactions' in resolver.projections
			&& typeof resolver.projections.$$safeMultisigTransactions === 'object'
			&& resolver.projections.$$safeMultisigTransactions != null
			&& 'select' in resolver.projections.$$safeMultisigTransactions
		))
		if (listResolver == null)
			throw new Error('missing EvmNetworkAccount Safe transactions list resolver')

		await listResolver.resolve.EvmNetworkEvmAccount.resolve({
			$network: network,
			$actor: {
				address: safeAddress,
			},
		}, {
			...context,
			providerContinuationToken: '16',
		})

		expect(sourceGetJson.mock.calls[0]?.[1]).toContain('offset=16')
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
			typeof resolver.projections.$$queuedTransactions === 'object'
			&& resolver.projections.$$queuedTransactions != null
			&& 'select' in resolver.projections.$$queuedTransactions
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
		expect(listResolver.projections.$$queuedTransactions.select(listSnapshot)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$network: network,
					safeTxHash,
				},
				[EntityMetaKey.Fields]: {
					[safeField('$safe')]: {
						[EntityMetaKey.Selector]: {
							$network: network,
							address: safeAddress,
						},
					},
					[safeField('$to')]: {
						[EntityMetaKey.Selector]: {
							address: recipientAddress,
						},
					},
					[safeField('value')]: 0n,
					[safeField('operation')]: SafeMultisigOperation.Call,
					[safeField('nonce')]: 2n,
					[safeField('safeTxGas')]: 0n,
					[safeField('baseGas')]: 0n,
					[safeField('gasPrice')]: 0n,
					[safeField('gasToken')]: zeroAddress,
					[safeField('$refundReceiver')]: {
						[EntityMetaKey.Selector]: {
							address: zeroAddress,
						},
					},
					[safeField('$proposer')]: {
						[EntityMetaKey.Selector]: {
							address: ownerAddress,
						},
					},
					[safeField('isExecuted')]: false,
					[safeField('confirmationsRequired')]: 1,
					[safeField('submittedAtMs')]: submittedAtMs,
					[safeField('modifiedAtMs')]: submittedAtMs,
				},
			},
		])
		expect(listResolver.projections.$$queuedTransactions.continuation(listSnapshot)).toEqual({
			operation: 'safe-queued-transactions',
			target: 'safe-transaction-service',
			terminal: true,
		})
		expect(sourceGetJson.mock.calls[0]?.[1]).toContain('executed=false')

		const countSnapshot = await countResolver.resolve.EvmNetworkEvmAccount.resolve({
			$network: network,
			$actor: {
				address: safeAddress,
			},
		}, context)
		expect(countResolver.projections.$$queuedTransactions.resolveCount(countSnapshot)).toBe(1)
	})

	it('projects queued SafeTxHash onto singular SafeMultisigTransaction enrolled fields', async () => {
		sourceGetJson.mockResolvedValue({
			safe: safeAddress,
			to: recipientAddress,
			value: '1000',
			data: '0xa9059cbb',
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
			origin: 'https://app.safe.global',
			ethGasPrice: null,
			proposedByDelegate: null,
		})

		const transactionResolver = safeRest.resolvers.find((resolver) => (
			resolver.entityType === EntityType.SafeMultisigTransaction
			&& 'value' in resolver.projections
		))
		if (transactionResolver == null)
			throw new Error('missing SafeMultisigTransaction resolver')

		const snapshot = await transactionResolver.resolve.EvmNetworkSafeTxHash.resolve({
			$network: network,
			safeTxHash,
		}, context)
		expect(transactionResolver.projections.operation(snapshot)).toBe(SafeMultisigOperation.Call)
		expect(transactionResolver.projections.$safe(snapshot)).toEqual({
			[EntityMetaKey.Selector]: {
				$network: network,
				address: safeAddress,
			},
		})
		expect(transactionResolver.projections.$to(snapshot)).toEqual({
			[EntityMetaKey.Selector]: {
				address: recipientAddress,
			},
		})
		expect(transactionResolver.projections.value(snapshot)).toBe(1000n)
		expect(transactionResolver.projections.data(snapshot)).toBe('0xa9059cbb')
		expect(transactionResolver.projections.isExecuted(snapshot)).toBe(false)
		expect(transactionResolver.projections.$executionTransaction(snapshot)).toBeUndefined()
		expect(snapshot).not.toHaveProperty('origin')
		expect(snapshot).not.toHaveProperty('ethGasPrice')
		expect(snapshot).not.toHaveProperty('proposedByDelegate')
		expect(snapshot).not.toHaveProperty('confirmations')
		expect(sourceGetJson.mock.calls[0]?.[1]).toContain(`/api/v2/multisig-transactions/${safeTxHash}/`)
	})

	it('links executed Safe transactions to the outer execution hash without treating safeTxHash as an EVM tx', async () => {
		sourceGetJson.mockResolvedValue({
			safe: safeAddress,
			to: recipientAddress,
			value: '0',
			data: null,
			operation: 0,
			safeTxGas: '0',
			baseGas: '0',
			gasPrice: '0',
			gasToken: zeroAddress,
			refundReceiver: zeroAddress,
			nonce: '3',
			executionDate: '2026-07-22T01:00:00Z',
			submissionDate: '2026-07-22T00:00:00Z',
			modified: '2026-07-22T01:00:00Z',
			blockNumber: 12,
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
		})

		const transactionResolver = safeRest.resolvers.find((resolver) => (
			resolver.entityType === EntityType.SafeMultisigTransaction
			&& 'isExecuted' in resolver.projections
		))
		if (transactionResolver == null)
			throw new Error('missing SafeMultisigTransaction resolver')

		const snapshot = await transactionResolver.resolve.EvmNetworkSafeTxHash.resolve({
			$network: network,
			safeTxHash,
		}, context)
		expect(snapshot[EntityMetaKey.Selector]).toEqual({
			$network: network,
			safeTxHash,
		})
		expect(transactionResolver.projections.isExecuted(snapshot)).toBe(true)
		expect(transactionResolver.projections.isSuccessful(snapshot)).toBe(true)
		expect(transactionResolver.projections.executedAtMs(snapshot)).toBe(laterExecutedAtMs)
		expect(transactionResolver.projections.$executionTransaction(snapshot)).toEqual({
			[EntityMetaKey.Selector]: {
				$network: network,
				txHash: executionHash,
			},
		})
		expect(transactionResolver.projections.data(snapshot)).toBeUndefined()
		expect(snapshot[EntityMetaKey.Selector]).not.toHaveProperty('txHash')
	})
})
