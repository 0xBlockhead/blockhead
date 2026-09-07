import { ed25519 } from '@noble/curves/ed25519.js'
import { base58 } from '@scure/base'
import { describe, expect, it } from 'vitest'
import {
	WalletAdapterPreDispatchFailure,
	WalletAdapterResponseAuditFailure,
} from './types.ts'
import { createSolanaSignMessageResponseAudit } from './solanaSignMessageResponse.ts'

const privateKey = new Uint8Array([
	7, 19, 31, 43, 59, 71, 83, 97,
	109, 127, 139, 151, 163, 179, 191, 211,
	223, 229, 233, 239, 241, 251, 3, 13,
	23, 37, 47, 61, 73, 89, 101, 113,
])
const siblingPrivateKey = new Uint8Array([
	3, 5, 7, 11, 13, 17, 19, 23,
	29, 31, 37, 41, 43, 47, 53, 59,
	61, 67, 71, 73, 79, 83, 89, 97,
	101, 103, 107, 109, 113, 127, 131, 137,
])
const publicKey = ed25519.getPublicKey(privateKey)
const accountAddress = base58.encode(publicKey)
const message = 'Blockhead controlled signing challenge: session 42, revision 3'

const audit = () => createSolanaSignMessageResponseAudit({
	accountAddress,
	publicKey,
	message,
})

describe('Solana Wallet Standard signMessage response audit', () => {
	it('accepts exactly one 64-byte Ed25519 signature over the retained message and key', () => {
		const responseAudit = audit()
		const providerMessage = responseAudit.messageForProvider()
		const signature = ed25519.sign(providerMessage, privateKey)

		providerMessage.fill(0)

		expect(responseAudit.audit([{ signature }])).toBe(base58.encode(signature))
		expect(responseAudit.messageForProvider()).toEqual(new TextEncoder().encode(message))
	})

	it('rejects a sibling message or sibling key after a provider return', () => {
		const responseAudit = audit()
		const exactMessage = responseAudit.messageForProvider()
		const siblingMessage = new TextEncoder().encode(`${message}!`)

		expect(() => responseAudit.audit([{
			signature: ed25519.sign(siblingMessage, privateKey),
		}])).toThrow(WalletAdapterResponseAuditFailure)
		expect(() => responseAudit.audit([{
			signature: ed25519.sign(exactMessage, siblingPrivateKey),
		}])).toThrow(WalletAdapterResponseAuditFailure)
	})

	it('rejects zero, multiple, non-array, missing, and malformed signature outputs', () => {
		const responseAudit = audit()
		const validSignature = ed25519.sign(responseAudit.messageForProvider(), privateKey)

		for (const response of [
			[],
			[{ signature: validSignature }, { signature: validSignature }],
			{ signature: validSignature },
			[{}],
			[{ signature: new Uint8Array(63) }],
			[{ signature: base58.encode(validSignature) }],
		])
			expect(() => responseAudit.audit(response)).toThrow(WalletAdapterResponseAuditFailure)
	})

	it('rejects malformed or address/public-key-mismatched authority before dispatch', () => {
		expect(() => createSolanaSignMessageResponseAudit({
			accountAddress: 'not base58!',
			publicKey,
			message,
		})).toThrow(WalletAdapterPreDispatchFailure)

		expect(() => createSolanaSignMessageResponseAudit({
			accountAddress,
			publicKey: ed25519.getPublicKey(siblingPrivateKey),
			message,
		})).toThrow(WalletAdapterPreDispatchFailure)
	})
})
