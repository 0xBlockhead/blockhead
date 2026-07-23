import { describe, expect, it, vi } from 'vitest'

import * as http from '$/lib/http.ts'
import {
	getSafeMultisigTransactions,
	getSafeStatus,
	getSafeTransactionConfirmations,
	isSafeNonceRejectionTransaction,
} from '$/sources/SafeTransactionService/Rest/queries.ts'

const network = {
	chainId: '8453',
	chainPrefix: 'base',
} as const
const apiKey = 'safe-api-key'
const safeAddress = `0x${'a'.repeat(40)}`
const ownerAddress = `0x${'b'.repeat(40)}`
const recipientAddress = `0x${'c'.repeat(40)}`
const safeTxHash = `0x${'d'.repeat(64)}`
const executionHash = `0x${'e'.repeat(64)}`

const transaction = {
	safe: safeAddress,
	to: recipientAddress,
	value: '900719925474099300000',
	data: '0x',
	operation: 0,
	safeTxGas: '0',
	baseGas: '0',
	gasPrice: '0',
	gasToken: `0x${'0'.repeat(40)}`,
	refundReceiver: `0x${'0'.repeat(40)}`,
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

describe('Safe Transaction Service public multisig queries', () => {
	it('preserves exact Safe identity, owners, threshold, and lossless nonce', async () => {
		vi.spyOn(http, 'getJson').mockResolvedValue({
			address: safeAddress.toUpperCase().replace('0X', '0x'),
			nonce: '9007199254740993',
			threshold: 1,
			owners: [
				ownerAddress,
			],
			masterCopy: recipientAddress,
			modules: [],
			fallbackHandler: recipientAddress,
			guard: `0x${'0'.repeat(40)}`,
			version: '1.4.1',
		})

		await expect(getSafeStatus({
			network,
			apiKey,
			safeAddress,
		})).resolves.toMatchObject({
			nonce: '9007199254740993',
			threshold: 1,
		})
	})

	it('returns bounded queued transactions and rejects foreign-subject rows', async () => {
		const getJson = vi.spyOn(http, 'getJson')
		getJson.mockResolvedValueOnce({
			count: 1,
			next: null,
			previous: null,
			results: [
				transaction,
			],
		})

		await expect(getSafeMultisigTransactions({
			network,
			apiKey,
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

		getJson.mockResolvedValueOnce({
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
			network,
			apiKey,
			safeAddress,
			limit: 20,
			offset: 0,
		})).rejects.toThrow('different Safe')
	})

	it('rejects continuations that escape the exact chain and Safe path', async () => {
		vi.spyOn(http, 'getJson').mockResolvedValue({
			count: 1,
			next: `https://api.safe.global/tx-service/eth/api/v2/safes/${safeAddress}/multisig-transactions/?offset=20`,
			previous: null,
			results: [
				transaction,
			],
		})

		await expect(getSafeMultisigTransactions({
			network,
			apiKey,
			safeAddress,
			limit: 20,
			offset: 0,
		})).rejects.toThrow('continuation escaped its subject')
	})

	it('binds confirmations to the exact transaction and current Safe owners', async () => {
		vi.spyOn(http, 'getJson')
			.mockResolvedValueOnce({
				address: safeAddress,
				nonce: '2',
				threshold: 1,
				owners: [
					ownerAddress,
				],
				masterCopy: recipientAddress,
				modules: [],
				fallbackHandler: recipientAddress,
				guard: `0x${'0'.repeat(40)}`,
				version: '1.4.1',
			})
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
			network,
			apiKey,
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

	it('rejects chain-prefix substitution and invalid thresholds', async () => {
		await expect(getSafeStatus({
			network: {
				chainId: '1',
				chainPrefix: 'base',
			},
			apiKey,
			safeAddress,
		})).rejects.toThrow('chain ID and service prefix disagree')

		vi.spyOn(http, 'getJson').mockResolvedValue({
			address: safeAddress,
			nonce: '0',
			threshold: 2,
			owners: [
				ownerAddress,
			],
			masterCopy: recipientAddress,
			modules: [],
			fallbackHandler: recipientAddress,
			guard: `0x${'0'.repeat(40)}`,
			version: '1.4.1',
		})
		await expect(getSafeStatus({
			network,
			apiKey,
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
