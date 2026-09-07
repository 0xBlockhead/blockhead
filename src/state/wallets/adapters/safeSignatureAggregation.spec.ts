import { Address, Secp256k1, Signature } from 'ox'
import { describe, expect, it } from 'vitest'
import { aggregateSafeLocalSignatures } from './safeSignatureAggregation.ts'

const payload = `0x${'11'.repeat(32)}` as const
const keyA = `0x${'00'.repeat(31)}01` as const
const keyB = `0x${'00'.repeat(31)}02` as const
const keyOther = `0x${'00'.repeat(31)}03` as const
const ownerA = Address.fromPublicKey(Secp256k1.getPublicKey({ privateKey: keyA }))
const ownerB = Address.fromPublicKey(Secp256k1.getPublicKey({ privateKey: keyB }))
const signature = (key: `0x${string}`) => Signature.toHex(Secp256k1.sign({ payload, privateKey: key }))

describe('pure Safe local signature aggregation', () => {
	it('recovers and sorts distinct owner signatures canonically', () => {
		const first = signature(keyA)
		const second = signature(keyB)
		expect(aggregateSafeLocalSignatures({
			payload,
			owners: [ownerB, ownerA],
			threshold: 2,
			signatures: [first, second],
		})).toBe(ownerA.toLowerCase() < ownerB.toLowerCase() ? `0x${first.slice(2)}${second.slice(2)}` : `0x${second.slice(2)}${first.slice(2)}`)
	})

	it('rejects non-safe-integer thresholds and wrong signer sets', () => {
		const first = signature(keyA)
		expect(() => aggregateSafeLocalSignatures({ payload, owners: [ownerA, ownerB], threshold: Number.NaN, signatures: [first] })).toThrow('safe integer')
		expect(() => aggregateSafeLocalSignatures({ payload, owners: [ownerA, ownerB], threshold: 1.5, signatures: [first] })).toThrow('safe integer')
		expect(() => aggregateSafeLocalSignatures({ payload, owners: [ownerA, ownerB], threshold: 2, signatures: [first, signature(keyOther)] })).toThrow('not produced by an owner')
	})

	it('rejects duplicates, malformed signatures, and threshold mismatch', () => {
		const first = signature(keyA)
		expect(() => aggregateSafeLocalSignatures({ payload, owners: [ownerA, ownerB], threshold: 2, signatures: [first, first] })).toThrow('distinct owners')
		expect(() => aggregateSafeLocalSignatures({ payload, owners: [ownerA, ownerB], threshold: 1, signatures: ['0x1234'] })).toThrow('65-byte')
		expect(() => aggregateSafeLocalSignatures({ payload, owners: [ownerA, ownerB], threshold: 2, signatures: [first] })).toThrow('signature count')
	})

	it('keeps the exact payload binding for a prepared signature', () => {
		const first = signature(keyA)
		expect(aggregateSafeLocalSignatures({ payload, owners: [ownerA], threshold: 1, signatures: [first] })).toBe(first)
		expect(() => aggregateSafeLocalSignatures({ payload: `0x${'22'.repeat(32)}`, owners: [ownerA], threshold: 1, signatures: [first] })).toThrow('not produced by an owner')
	})
})
