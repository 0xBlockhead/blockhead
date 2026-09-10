import { ed25519 } from '@noble/curves/ed25519.js'
import { base58 } from '@scure/base'
import { describe, expect, it } from 'vitest'
import {
	WalletAdapterPreDispatchFailure,
	WalletAdapterResponseAuditFailure,
} from './types.ts'
import { createSolanaSignMessageResponseAudit } from './solanaSignMessageResponse.ts'
import {
	ed25519SiblingPrivateKey as siblingPrivateKey,
	solanaSigningAccountAddress as accountAddress,
	solanaSigningMessage as message,
	ed25519SigningPrivateKey as privateKey,
	solanaSigningPublicKey as publicKey,
} from './ed25519Signing.fixtures.ts'

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
			null,
			undefined,
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
