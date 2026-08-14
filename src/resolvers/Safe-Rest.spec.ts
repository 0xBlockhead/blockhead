import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import * as Address from 'ox/Address'

import {
	EvmTransactionEnvelopeType,
	EvmTransactionExecutionStatus,
	EvmTransactionKind,
} from '$/constants/Evm.ts'
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
			EntityType.EvmTransaction,
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
			&& '$$transactions' in resolver.projections
		))
		const listResolver = accountResolvers.find((resolver) => (
			typeof resolver.projections.$$transactions === 'object'
			&& resolver.projections.$$transactions != null
			&& 'select' in resolver.projections.$$transactions
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
		expect(listResolver.projections.$$transactions.select(listSnapshot)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$network: network,
					txHash: executionHash,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.EvmTransaction, [], 'envelopeType')]: EvmTransactionEnvelopeType.Unknown,
					[entityFieldAddressKey(EntityType.EvmTransaction, [], 'kind')]: EvmTransactionKind.ContractCall,
					[entityFieldAddressKey(EntityType.EvmTransaction, [], '$from')]: {
						[EntityMetaKey.Selector]: {
							address: safeAddress,
						},
					},
					[entityFieldAddressKey(EntityType.EvmTransaction, [], '$to')]: {
						[EntityMetaKey.Selector]: {
							address: recipientAddress,
						},
					},
					[entityFieldAddressKey(EntityType.EvmTransaction, [], 'value')]: 0n,
					[entityFieldAddressKey(EntityType.EvmTransaction, [], 'executionStatus')]: EvmTransactionExecutionStatus.Success,
					[entityFieldAddressKey(EntityType.EvmTransaction, [], '$block')]: {
						[EntityMetaKey.Selector]: {
							$network: network,
							blockNumber: 1n,
						},
					},
				},
			},
		])
		expect(listResolver.projections.$$transactions.continuation(listSnapshot)).toEqual({
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
		expect(countResolver.projections.$$transactions.resolveCount(countSnapshot)).toBe(1)
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
			&& '$$transactions' in resolver.projections
			&& typeof resolver.projections.$$transactions === 'object'
			&& resolver.projections.$$transactions != null
			&& 'select' in resolver.projections.$$transactions
		))
		if (listResolver == null)
			throw new Error('missing EvmNetworkAccount transactions list resolver')

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
					txHash: safeTxHash,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.EvmTransaction, [], 'envelopeType')]: EvmTransactionEnvelopeType.Unknown,
					[entityFieldAddressKey(EntityType.EvmTransaction, [], 'kind')]: EvmTransactionKind.ContractCall,
					[entityFieldAddressKey(EntityType.EvmTransaction, [], '$from')]: {
						[EntityMetaKey.Selector]: {
							address: safeAddress,
						},
					},
					[entityFieldAddressKey(EntityType.EvmTransaction, [], '$to')]: {
						[EntityMetaKey.Selector]: {
							address: recipientAddress,
						},
					},
					[entityFieldAddressKey(EntityType.EvmTransaction, [], 'value')]: 0n,
					[entityFieldAddressKey(EntityType.EvmTransaction, [], 'executionStatus')]: EvmTransactionExecutionStatus.Pending,
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

	it('projects queued SafeTxHash onto singular EvmTransaction enrolled fields', async () => {
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
			resolver.entityType === EntityType.EvmTransaction
			&& 'value' in resolver.projections
		))
		if (transactionResolver == null)
			throw new Error('missing EvmTransaction SafeTxHash resolver')

		const {
			EvmTransactionEnvelopeType,
			EvmTransactionExecutionStatus,
			EvmTransactionKind,
		} = await import('$/constants/Evm.ts')
		const snapshot = await transactionResolver.resolve.EvmNetworkTxHash.resolve({
			$network: network,
			txHash: safeTxHash,
		}, context)
		expect(transactionResolver.projections.envelopeType(snapshot)).toBe(EvmTransactionEnvelopeType.Unknown)
		expect(transactionResolver.projections.kind(snapshot)).toBe(EvmTransactionKind.NativeTransferAndCall)
		expect(transactionResolver.projections.$from(snapshot)).toEqual({
			[EntityMetaKey.Selector]: {
				address: safeAddress,
			},
		})
		expect(transactionResolver.projections.$to(snapshot)).toEqual({
			[EntityMetaKey.Selector]: {
				address: recipientAddress,
			},
		})
		expect(transactionResolver.projections.value(snapshot)).toBe(1000n)
		expect(transactionResolver.projections.input(snapshot)).toBe('0xa9059cbb')
		expect(transactionResolver.projections.executionStatus(snapshot)).toBe(EvmTransactionExecutionStatus.Pending)
		expect(transactionResolver.projections.$block(snapshot)).toBeUndefined()
		expect(snapshot).not.toHaveProperty('origin')
		expect(snapshot).not.toHaveProperty('ethGasPrice')
		expect(snapshot).not.toHaveProperty('proposedByDelegate')
		expect(snapshot).not.toHaveProperty('confirmations')
		expect(sourceGetJson.mock.calls[0]?.[1]).toContain(`/api/v2/multisig-transactions/${safeTxHash}/`)
	})

	it('projects executed SafeTxHash with block + success status', async () => {
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
			resolver.entityType === EntityType.EvmTransaction
			&& 'executionStatus' in resolver.projections
		))
		if (transactionResolver == null)
			throw new Error('missing EvmTransaction SafeTxHash resolver')

		const {
			EvmTransactionExecutionStatus,
			EvmTransactionKind,
		} = await import('$/constants/Evm.ts')
		const snapshot = await transactionResolver.resolve.EvmNetworkTxHash.resolve({
			$network: network,
			txHash: safeTxHash,
		}, context)
		expect(transactionResolver.projections.kind(snapshot)).toBe(EvmTransactionKind.ContractCall)
		expect(transactionResolver.projections.executionStatus(snapshot)).toBe(EvmTransactionExecutionStatus.Success)
		expect(transactionResolver.projections.$block(snapshot)).toEqual({
			[EntityMetaKey.Selector]: {
				$network: network,
				blockNumber: 12n,
			},
		})
		expect(transactionResolver.projections.input(snapshot)).toBeUndefined()
	})
})
