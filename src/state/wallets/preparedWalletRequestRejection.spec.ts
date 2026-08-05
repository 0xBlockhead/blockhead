import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

import { Source } from '$/sources/Source.ts'
import {
	isPreparedWalletRequestWithoutSend,
	preparedWalletRequestObservation,
} from './walletRequestPreparation.ts'
import { preparedWalletRequestRejection } from './preparedWalletRequestRejection.ts'


const request = {
	id: 'wallet-request-prepared',
	requestKind: 'transaction',
	requestMethod: 'eth_sendTransaction',
	requestedAt: 10,
} as const

const preparedObservation = {
	...preparedWalletRequestObservation(),
	timestampMs: 20,
} as const

const source = readFileSync(
	new URL('./preparedWalletRequestRejection.ts', import.meta.url),
	'utf8'
)


describe('prepared wallet request rejection', () => {
	it('creates only a later failed signing observation for an existing prepared transaction request', () => {
		expect(isPreparedWalletRequestWithoutSend(preparedObservation)).toBe(true)
		expect(preparedWalletRequestRejection({
			request,
			preparedObservation,
			rejectedAt: 21,
		})).toEqual({
			walletRequestSelector: {
				id: request.id,
			},
			observation: {
				timestampMs: 21,
				source: Source.Local_Internal,
				status: 'failed',
				error: 'Wallet signing request rejected',
			},
		})
	})

	it('does not expose request rewrites, submission, or transaction persistence', () => {
		const rejection = preparedWalletRequestRejection({
			request,
			preparedObservation,
			rejectedAt: 30,
		})

		expect(rejection).not.toHaveProperty('request')
		expect(rejection).not.toHaveProperty('submittedAt')
		expect(rejection).not.toHaveProperty('transactionHash')
		expect(rejection).not.toHaveProperty('evmTransaction')
		expect(rejection).not.toHaveProperty('evmTransactions')
		expect(rejection).not.toHaveProperty('evmTransactionIds')
		expect(rejection.observation).not.toHaveProperty('submittedAt')
		expect(rejection.observation).not.toHaveProperty('transactionId')
		expect(rejection.observation).not.toHaveProperty('transactionHash')
		expect(rejection.observation).not.toHaveProperty('evmTransactions')
		expect(rejection.observation).not.toHaveProperty('evmTransactionIds')
		expect(Object.keys(rejection)).toEqual([
			'walletRequestSelector',
			'observation',
		])
		expect(Object.keys(rejection.observation).sort()).toEqual([
			'error',
			'source',
			'status',
			'timestampMs',
		])
		expect(isPreparedWalletRequestWithoutSend(rejection.observation)).toBe(false)
		expect(source).not.toMatch(/writeLocalBlockheadWalletRequest(?:SubmittedAt)?/)
		expect(source).not.toMatch(/EntityType\.EvmTransaction/)
		expect(source).not.toMatch(/EvmTransaction/)
		expect(source).not.toMatch(/submittedAt\s*:/)
		expect(source).not.toMatch(/submitSessionLifecycle/)
		expect(source).not.toMatch(/finalizeSessionLifecycle/)
	})

	it('leaves the prepared request row identity unchanged and never invents a public tx', () => {
		const rejection = preparedWalletRequestRejection({
			request: {
				...request,
				id: 'wallet-request-reject-only',
			},
			preparedObservation,
			rejectedAt: 40,
		})

		expect(rejection.walletRequestSelector).toEqual({
			id: 'wallet-request-reject-only',
		})
		expect(rejection.observation.status).toBe('failed')
		expect(JSON.stringify(rejection)).not.toMatch(/0x[0-9a-fA-F]{64}/)
		expect(JSON.stringify(rejection)).not.toMatch(/submittedAt/)
		expect(JSON.stringify(rejection)).not.toMatch(/EvmTransaction/)
	})

	it('rejects non-prepared, submitted, non-transaction, and non-later inputs', () => {
		expect(() => preparedWalletRequestRejection({
			request,
			// @ts-expect-error — runtime guard under test
			preparedObservation: {
				timestampMs: 20,
				status: 'requested',
			},
			rejectedAt: 21,
		})).toThrow('requires a prepared request')
		expect(() => preparedWalletRequestRejection({
			request: {
				...request,
				submittedAt: 21,
			},
			preparedObservation,
			rejectedAt: 22,
		})).toThrow('Submitted wallet requests')
		expect(() => preparedWalletRequestRejection({
			request: {
				...request,
				requestKind: 'message-signature',
			},
			preparedObservation,
			rejectedAt: 21,
		})).toThrow('requires a transaction request')
		expect(() => preparedWalletRequestRejection({
			request,
			preparedObservation,
			rejectedAt: 20,
		})).toThrow('must be later than preparation')
	})
})
