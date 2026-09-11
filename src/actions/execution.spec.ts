import {
	describe,
	expect,
	it,
} from 'vitest'

import {
	actionAuthorityRequestEnvelopeHash,
	authorityRequestEnvelope,
	dispatchAddress,
	dispatchEvidence,
} from '$/actions/execution.ts'

const message = {
	address: 'EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c',
	amount: '1000',
	payload: 'te6ccgEBAQEA',
	extra_currency: {
		'1': '3',
		'2': '7',
	},
}

const envelope = {
	adapterKey: 'ton.internal-message-sign',
	adapterVersion: '1',
	value: {
		namespace: 'ton',
		reference: '-239',
		accountAddress: '0:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
		method: 'signMessage',
		network: '-239',
		from: '0:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
		valid_until: 4_000_000_000,
		messages: [
			message,
		],
	},
} as const

describe('TON internal-message execution authority schema', () => {
	it('accepts the protocol envelope and binds its exact hash', () => {
		const parsed = authorityRequestEnvelope.assert(envelope)
		expect(parsed).toEqual(envelope)
		const originalHash = actionAuthorityRequestEnvelopeHash(parsed)
		expect(originalHash).toMatch(/^0x[0-9a-f]{64}$/)
		const changedHash = actionAuthorityRequestEnvelopeHash({
			...parsed,
			value: {
				...parsed.value,
				messages: [{ ...parsed.value.messages[0], amount: '1001' }],
			},
		})
		expect(changedHash).not.toBe(originalHash)
		expect(dispatchAddress.assert({
			kind: 'wallet-connection',
			connectionKey: 'ton-session',
			method: 'signMessage',
		})).toEqual({
			kind: 'wallet-connection',
			connectionKey: 'ton-session',
			method: 'signMessage',
		})
		expect(dispatchEvidence.assert({
			kind: 'returned',
			response: {
				adapterKey: 'ton.internal-message-sign',
				adapterVersion: '1',
				value: {
					internalBocHash: `0x${'11'.repeat(32)}`,
				},
			},
		})).toMatchObject({ kind: 'returned' })
	})

	it('rejects a generic transaction envelope and generic signature evidence', () => {
		expect(() => authorityRequestEnvelope.assert({
			adapterKey: 'ton.internal-message-sign',
			adapterVersion: '1',
			value: {
				...envelope.value,
				method: 'sendTransaction',
			},
		})).toThrow()
		expect(() => dispatchEvidence.assert({
			kind: 'returned',
			response: {
				adapterKey: 'wallet.signature',
				adapterVersion: '1',
				value: {
					namespace: 'ton',
					signatureHash: `0x${'11'.repeat(32)}`,
				},
			},
		})).toThrow()
	})

	it('preserves a returned EVM dispatch with zero native transaction references', () => {
		expect(dispatchEvidence.assert({
			kind: 'returned',
			response: {
				adapterKey: 'evm.transaction',
				adapterVersion: '1',
				value: { transactionIds: [] },
			},
		})).toEqual({
			kind: 'returned',
			response: {
				adapterKey: 'evm.transaction',
				adapterVersion: '1',
				value: { transactionIds: [] },
			},
		})
	})
})
