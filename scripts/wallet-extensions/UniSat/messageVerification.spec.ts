import { strict as assert } from 'node:assert'
import { createHash } from 'node:crypto'
import { test } from 'node:test'

import { bitcoinSignedMessagePayload, verifyBitcoinSignedMessage } from './messageVerification.ts'
import {
	unisatOfficialAddress as address,
	unisatOfficialMessage as message,
	unisatOfficialPublicKey as publicKey,
	unisatOfficialSignature as signature,
} from './messageVerification.fixtures.ts'


test('verifies the official UniSat compressed ECDSA message vector', () => {
	assert.equal(verifyBitcoinSignedMessage({ address, message, publicKey, signature }), true)
})

test('rejects mutated message and key', () => {
	assert.throws(() => verifyBitcoinSignedMessage({ address, message: `${message}!`, publicKey, signature }), /public key mismatch/)
	assert.throws(() => verifyBitcoinSignedMessage({ address, message, publicKey: `03${publicKey.slice(2)}`, signature }), /public key mismatch/)
})

test('rejects wrong selected address, recovery header, and non-canonical base64', () => {
	assert.throws(() => verifyBitcoinSignedMessage({ address: '1BoatSLRHtKNngkdXEeobR76b53LETtpyT', message, publicKey, signature }), /address mismatch/)
	assert.throws(() => verifyBitcoinSignedMessage({ address, message, publicKey, signature: Buffer.from([26, ...Buffer.from(signature, 'base64').subarray(1)]).toString('base64') }), /recovery header/)
	assert.throws(() => verifyBitcoinSignedMessage({ address, message, publicKey, signature: `${signature}=` }), /canonical base64/)
})

test('encodes UTF-8 byte length across the CompactSize 253-byte boundary', () => {
	// 64 four-byte code points: CompactSize must encode 256, not 128 UTF-16 units.
	const boundaryMessage = '💡'.repeat(64)
	const encoded = Buffer.concat([
		Buffer.from('18426974636f696e205369676e6564204d6573736167653a0afd0001', 'hex'),
		Buffer.from(boundaryMessage, 'utf8'),
	])
	const expected = createHash('sha256').update(createHash('sha256').update(encoded).digest()).digest()
	assert.deepEqual(bitcoinSignedMessagePayload(boundaryMessage), expected)
})
