import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import * as Address from 'ox/Address'

import { Source } from '$/sources/Source.ts'
import {
	safeTransactionServiceChainIds,
} from '$/sources/SafeTransactionService/Rest/queries.ts'

const { sourceGetJson } = vi.hoisted(() => ({
	sourceGetJson: vi.fn(),
}))

vi.mock('$/sources/_runtime/http.ts', async (importOriginal) => ({
	...await importOriginal<typeof import('$/sources/_runtime/http.ts')>(),
	sourceGetJson,
}))

const {
	getSafeMultisigTransaction,
	getSafeMultisigTransactions,
	getSafeStatus,
	getSafeTransactionConfirmations,
	isSafeNonceRejectionTransaction,
	requireSafeTransactionServiceBinding,
} = await import('$/sources/SafeTransactionService/Rest/queries.ts')

const chainId = 8453
const safeAddress = `0x${'a'.repeat(40)}`
const checksummedSafeAddress = Address.checksum(safeAddress)
const ownerAddress = `0x${'b'.repeat(40)}`
const recipientAddress = `0x${'c'.repeat(40)}`
const safeTxHash = `0x${'d'.repeat(64)}`
const executionHash = `0x${'e'.repeat(64)}`
const masterCopy = `0x${'1'.repeat(40)}`
const zeroAddress = `0x${'0'.repeat(40)}`

const transaction = {
	safe: safeAddress,
	to: recipientAddress,
	value: '900719925474099300000',
	data: '0x',
	operation: 0,
	safeTxGas: '0',
	baseGas: '0',
	gasPrice: '0',
	gasToken: zeroAddress,
	refundReceiver: zeroAddress,
	nonce: '9007199254740993',
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
}

const safeStatus = {
	address: safeAddress,
	nonce: '9007199254740993',
	threshold: 1,
	owners: [
		ownerAddress,
	],
	masterCopy,
	modules: [],
	fallbackHandler: recipientAddress,
	guard: zeroAddress,
	version: '1.4.1',
}

describe('Safe Transaction Service public multisig queries', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('indexes bound EIP-155 chains and hard-fails unknown ones', () => {
		expect(safeTransactionServiceChainIds).toEqual([
			1,
			100,
			8453,
		])
		expect(requireSafeTransactionServiceBinding(8453).source).toBe(Source.SafeTransactionService_Rest)
		expect(() => requireSafeTransactionServiceBinding(999)).toThrow('no binding for chain 999')
	})

	it('preserves exact Safe identity, owners, threshold, and lossless nonce', async () => {
		sourceGetJson.mockResolvedValue({
			...safeStatus,
			address: safeAddress.toUpperCase().replace('0X', '0x'),
		})

		await expect(getSafeStatus({
			chainId,
			safeAddress,
		})).resolves.toMatchObject({
			nonce: '9007199254740993',
			threshold: 1,
			masterCopy,
		})
		expect(sourceGetJson).toHaveBeenCalledWith(
			requireSafeTransactionServiceBinding(chainId),
			`https://api.safe.global/tx-service/base/api/v1/safes/${checksummedSafeAddress}/`
		)
	})

	it('checksums lowercase Safe addresses before HTTP (EIP-55 required by tx-service)', async () => {
		sourceGetJson.mockResolvedValue(safeStatus)
		await getSafeStatus({
			chainId,
			safeAddress: safeAddress.toLowerCase(),
		})
		expect(sourceGetJson.mock.calls[0]?.[1]).toBe(
			`https://api.safe.global/tx-service/base/api/v1/safes/${checksummedSafeAddress}/`
		)
		expect(checksummedSafeAddress).not.toBe(safeAddress.toLowerCase())
	})

	it('returns bounded queued transactions and rejects foreign-subject rows', async () => {
		sourceGetJson.mockResolvedValueOnce({
			count: 1,
			next: null,
			previous: null,
			results: [
				transaction,
			],
		})

		await expect(getSafeMultisigTransactions({
			chainId,
			safeAddress,
			limit: 20,
			offset: 0,
			executed: false,
		})).resolves.toMatchObject({
			results: [
				{
					nonce: '9007199254740993',
					value: '900719925474099300000',
				},
			],
		})

		sourceGetJson.mockResolvedValueOnce({
			count: 1,
			next: null,
			previous: null,
			results: [
				{
					...transaction,
					safe: ownerAddress,
				},
			],
		})
		await expect(getSafeMultisigTransactions({
			chainId,
			safeAddress,
			limit: 20,
			offset: 0,
		})).rejects.toThrow('different Safe')
	})

	it('rejects continuations that escape the exact chain and Safe path', async () => {
		sourceGetJson.mockResolvedValue({
			count: 1,
			next: `https://api.safe.global/tx-service/eth/api/v2/safes/${safeAddress}/multisig-transactions/?offset=20`,
			previous: null,
			results: [
				transaction,
			],
		})

		await expect(getSafeMultisigTransactions({
			chainId,
			safeAddress,
			limit: 20,
			offset: 0,
		})).rejects.toThrow('continuation escaped its subject')
	})

	it('hard-fails executed pages that omit the on-chain execution hash', async () => {
		sourceGetJson.mockResolvedValue({
			count: 1,
			next: null,
			previous: null,
			results: [
				{
					...transaction,
					isExecuted: true,
					isSuccessful: true,
					transactionHash: null,
				},
			],
		})

		await expect(getSafeMultisigTransactions({
			chainId,
			safeAddress,
			limit: 20,
			offset: 0,
			executed: true,
		})).rejects.toThrow('missing execution hash')
	})

	it('binds a single multisig transaction to the requested Safe and hash', async () => {
		sourceGetJson.mockResolvedValue({
			...transaction,
			isExecuted: true,
			isSuccessful: true,
			transactionHash: executionHash,
		})

		await expect(getSafeMultisigTransaction({
			chainId,
			safeAddress,
			safeTxHash,
		})).resolves.toMatchObject({
			safeTxHash,
			transactionHash: executionHash,
		})
	})

	it('binds confirmations to the exact transaction and current Safe owners', async () => {
		sourceGetJson
			.mockResolvedValueOnce(safeStatus)
			.mockResolvedValueOnce({
				...transaction,
				isExecuted: true,
				isSuccessful: true,
				transactionHash: executionHash,
			})
			.mockResolvedValueOnce({
				count: 1,
				next: null,
				previous: null,
				results: [
					{
						owner: ownerAddress,
						submissionDate: '2026-07-22T00:00:00Z',
						transactionHash: executionHash,
						signature: `0x${'f'.repeat(130)}`,
						signatureType: 'ETH_SIGN',
					},
				],
			})

		await expect(getSafeTransactionConfirmations({
			chainId,
			safeAddress,
			safeTxHash,
			limit: 20,
			offset: 0,
		})).resolves.toMatchObject({
			results: [
				{
					owner: ownerAddress,
				},
			],
		})
	})

	it('rejects invalid thresholds', async () => {
		sourceGetJson.mockResolvedValue({
			...safeStatus,
			threshold: 2,
		})
		await expect(getSafeStatus({
			chainId,
			safeAddress,
		})).rejects.toThrow('threshold exceeds its owner set')
	})

	it('recognizes only the canonical empty self-call as a nonce rejection', () => {
		expect(isSafeNonceRejectionTransaction({
			...transaction,
			to: safeAddress,
			value: '0',
			data: '0x',
		})).toBe(true)
		expect(isSafeNonceRejectionTransaction({
			...transaction,
			to: safeAddress,
			value: '1',
			data: '0x',
		})).toBe(false)
	})
})
