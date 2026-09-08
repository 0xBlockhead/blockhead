import assert from 'node:assert/strict'
import { test } from 'node:test'
import { secp256k1 } from '@noble/curves/secp256k1.js'

import {
	auditKeycardAppletResponse,
	constructKeycardOpenSecureChannelRequest,
	constructKeycardSelectRequest,
	constructKeycardSignCurrentKeyRequest,
	KeycardAppletResponseError,
	verifyKeycardFixtureEcdsaSignature,
} from './keycardAppletApdu.ts'


// Tests

test('constructs the documented SELECT request without claiming applet execution', () => {
	// Fault: a host could select an obsolete applet AID while reporting Keycard capability.
	// Owner: Keycard APDU construction. Observable: exact current instance AID and construction-only evidence.
	const request = constructKeycardSelectRequest()

	assert.deepEqual(
		request.apdu,
		Uint8Array.from([
			0x00, 0xa4, 0x04, 0x00, 0x09,
			0xa0, 0x00, 0x00, 0x08, 0x04, 0x00, 0x01, 0x01, 0x01,
		])
	)
	assert.deepEqual({
		cryptographicSignatureVerified: request.cryptographicSignatureVerified,
		jCardSimExecutionEstablished: request.jCardSimExecutionEstablished,
		nativeSettlementEvidence: request.nativeSettlementEvidence,
		physicalCardEvidence: request.physicalCardEvidence,
		returnedSignatureAudited: request.returnedSignatureAudited,
		walletCapabilityEstablished: request.walletCapabilityEstablished,
	}, {
		cryptographicSignatureVerified: false,
		jCardSimExecutionEstablished: false,
		nativeSettlementEvidence: false,
		physicalCardEvidence: false,
		returnedSignatureAudited: false,
		walletCapabilityEstablished: false,
	})
})

test('constructs OPEN SECURE CHANNEL for one pairing slot and uncompressed public key', () => {
	// Fault: a host could put the pairing index or key length in the wrong APDU field.
	// Owner: Keycard secure-channel request construction. Observable: CLA/INS/P1/P2/Lc and the unchanged SEC1 key.
	const publicKey = secp256k1.getPublicKey(
		Uint8Array.from({ length: 32 }, (_, index) => index + 1),
		false
	)
	const request = constructKeycardOpenSecureChannelRequest({
		pairingIndex: 7,
		publicKey,
	})

	assert.deepEqual(request.apdu.slice(0, 5), Uint8Array.from([0x80, 0x10, 0x07, 0x00, 0x41]))
	assert.deepEqual(request.apdu.slice(5), publicKey)
})

test('refuses malformed secure-channel coordinates before transport', () => {
	// Fault: a malformed key, invalid curve point, or pairing index could reach a
	// card and be misreported as a simulator failure. Owner: Keycard secure-channel
	// request construction. Observable: synchronous pre-transport refusal.
	assert.throws(
		() => constructKeycardOpenSecureChannelRequest({
			pairingIndex: 256,
			publicKey: Uint8Array.from([0x04, ...Array<number>(64).fill(0)]),
		}),
		/must be one byte/
	)
	assert.throws(
		() => constructKeycardOpenSecureChannelRequest({
			pairingIndex: 0,
			publicKey: Uint8Array.from(Array<number>(65).fill(0x03)),
		}),
		/must be an uncompressed 65-byte SEC1 point/
	)
	assert.throws(
		() => constructKeycardOpenSecureChannelRequest({
			pairingIndex: 0,
			publicKey: Uint8Array.from([0x04, ...Array<number>(64).fill(0)]),
		}),
		/must contain valid secp256k1 coordinates/
	)
})

test('audits APDU transport success without promoting it to signature evidence', () => {
	// Fault: status-word success could be mistaken for an audited signature or physical-card result.
	// Owner: Keycard APDU response boundary. Observable: response data is retained while higher evidence remains false.
	const audit = auditKeycardAppletResponse(Uint8Array.from([0xa4, 0x00, 0x90, 0x00]))

	assert.deepEqual(audit.data, Uint8Array.from([0xa4, 0x00]))
	assert.equal(audit.statusWord, 0x9000)
	assert.equal(audit.returnedSignatureAudited, false)
	assert.equal(audit.cryptographicSignatureVerified, false)
	assert.equal(audit.physicalCardEvidence, false)
	assert.equal(audit.walletCapabilityEstablished, false)
})

test('preserves Keycard refusal status words distinctly from malformed responses', () => {
	// Fault: a card refusal or truncated response could collapse into empty success.
	// Owner: Keycard APDU response boundary. Observable: typed status-word refusal versus framing diagnostic.
	assert.throws(
		() => auditKeycardAppletResponse(Uint8Array.from([0x69, 0x82])),
		(error: Error) => {
			assert(error instanceof KeycardAppletResponseError)
			assert.equal(error.statusWord, 0x6982)
			return true
		}
	)
	assert.throws(
		() => auditKeycardAppletResponse(Uint8Array.from([0x90])),
		/must include a two-byte status word/
	)
})

test('verifies a protocol-shaped Keycard ECDSA fixture without claiming card execution', () => {
	// Fault: request construction or a 0x9000 fixture could be promoted into
	// jCardSim/physical-card capability without binding the returned signature.
	// Owner: Keycard SIGN request and response audit.
	// Observable: exact CLA/INS/hash and TLV r|s|recId cryptographically verify,
	// while every device and settlement claim remains false.
	const privateKey = Uint8Array.from({ length: 32 }, (_, index) => index + 1)
	const digest = Uint8Array.from({ length: 32 }, (_, index) => 255 - index)
	const recoveredSignature = secp256k1.sign(digest, privateKey, {
		format: 'recovered',
		prehash: false,
	})
	const request = constructKeycardSignCurrentKeyRequest(digest)
	const response = Uint8Array.from([
		0x80,
		0x41,
		...recoveredSignature.slice(1),
		recoveredSignature[0],
		0x90,
		0x00,
	])

	assert.deepEqual(request.apdu, Uint8Array.from([0x80, 0xc0, 0x00, 0x00, 0x20, ...digest]))
	assert.deepEqual(verifyKeycardFixtureEcdsaSignature({
		digest,
		expectedPublicKey: secp256k1.getPublicKey(privateKey, true),
		response,
	}), {
		cryptographicSignatureVerified: true,
		evidenceClass: 'fixture-signature-verification',
		fixtureSignatureVerified: true,
		jCardSimExecutionEstablished: false,
		nativeSettlementEvidence: false,
		physicalCardEvidence: false,
		walletCapabilityEstablished: false,
	})

	assert.throws(() => verifyKeycardFixtureEcdsaSignature({
		digest: Uint8Array.from(digest, (byte, index) => index === 0 ? byte ^ 1 : byte),
		expectedPublicKey: secp256k1.getPublicKey(privateKey, true),
		response,
	}), /does not verify/)
	assert.throws(() => verifyKeycardFixtureEcdsaSignature({
		digest,
		expectedPublicKey: secp256k1.getPublicKey(
			Uint8Array.from({ length: 32 }, (_, index) => index + 33),
			true
		),
		response,
	}), /does not verify/)
})
