import { describe, expect, it } from 'vitest'

import {
	authorityRequestEnvelope,
	dispatchAddress,
	dispatchEvidence,
} from './execution.ts'

const envelope = {
	adapterKey: 'wallet.message-sign',
	adapterVersion: '1',
	value: {
		namespace: 'sui',
		method: 'sui:signPersonalMessage',
		accountAddress: '0x1234',
		message: 'Sign this exact message',
	},
} as const

describe('Sui message-sign authority bindings', () => {
	it('accepts only the truthful Sui namespace and Wallet Standard method pair', () => {
		expect(authorityRequestEnvelope.assert(envelope)).toEqual(envelope)
		expect(() => authorityRequestEnvelope.assert({
			...envelope,
			value: { ...envelope.value, method: 'solana:signMessage' },
		})).toThrow()
		expect(() => authorityRequestEnvelope.assert({
			...envelope,
			value: { ...envelope.value, namespace: 'solana' },
		})).toThrow()
	})

	it('binds the occurrence method and returned signature namespace to Sui', () => {
		expect(dispatchAddress.assert({
			kind: 'wallet-connection',
			connectionKey: 'connection-sui',
			method: envelope.value.method,
		})).toEqual({
			kind: 'wallet-connection',
			connectionKey: 'connection-sui',
			method: 'sui:signPersonalMessage',
		})

		const evidence = {
			kind: 'returned',
			response: {
				adapterKey: 'wallet.signature',
				adapterVersion: '1',
				value: {
					namespace: 'sui',
					signatureHash: `0x${'12'.repeat(32)}`,
				},
			},
		} as const
		expect(dispatchEvidence.assert(evidence)).toEqual(evidence)
		expect(() => dispatchEvidence.assert({
			...evidence,
			response: {
				...evidence.response,
				value: { ...evidence.response.value, namespace: 'sui:mainnet' },
			},
		})).toThrow()
	})
})
