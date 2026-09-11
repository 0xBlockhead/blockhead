import { Buffer } from 'node:buffer'
import { secp256k1 } from '@noble/curves/secp256k1.js'

// The current Keycard instance AID documented by Keycard's applet installation guide.
const keycardInstanceAid = Uint8Array.from([
	0xa0, 0x00, 0x00, 0x08, 0x04, 0x00, 0x01, 0x01, 0x01,
])


// Types

export type KeycardAppletRequestConstruction = {
	readonly apdu: Uint8Array
	readonly cryptographicSignatureVerified: false
	readonly evidenceClass: 'request-construction'
	readonly jCardSimExecutionEstablished: false
	readonly nativeSettlementEvidence: false
	readonly physicalCardEvidence: false
	readonly returnedSignatureAudited: false
	readonly walletCapabilityEstablished: false
}

export type KeycardAppletResponseAudit = {
	readonly cryptographicSignatureVerified: false
	readonly data: Uint8Array
	readonly evidenceClass: 'apdu-response-audit'
	readonly jCardSimExecutionEstablished: false
	readonly nativeSettlementEvidence: false
	readonly physicalCardEvidence: false
	readonly returnedSignatureAudited: false
	readonly statusWord: number
	readonly walletCapabilityEstablished: false
}

export type KeycardFixtureSignatureVerification = {
	readonly cryptographicSignatureVerified: true
	readonly evidenceClass: 'fixture-signature-verification'
	readonly fixtureSignatureVerified: true
	readonly jCardSimExecutionEstablished: false
	readonly nativeSettlementEvidence: false
	readonly physicalCardEvidence: false
	readonly walletCapabilityEstablished: false
}

export class KeycardAppletResponseError extends Error {
	readonly statusWord: number

	constructor(statusWord: number) {
		super(`Keycard applet refused the APDU with status word 0x${statusWord.toString(16).padStart(4, '0')}`)
		this.name = 'KeycardAppletResponseError'
		this.statusWord = statusWord
	}
}


// Functions

const constructRequest = (
	cla: number,
	ins: number,
	p1: number,
	p2: number,
	data: Uint8Array
): KeycardAppletRequestConstruction => ({
	apdu: Uint8Array.from([cla, ins, p1, p2, data.byteLength, ...data]),
	cryptographicSignatureVerified: false,
	evidenceClass: 'request-construction',
	jCardSimExecutionEstablished: false,
	nativeSettlementEvidence: false,
	physicalCardEvidence: false,
	returnedSignatureAudited: false,
	walletCapabilityEstablished: false,
})

export const constructKeycardSelectRequest = () => constructRequest(
	0x00,
	0xa4,
	0x04,
	0x00,
	keycardInstanceAid
)

export const constructKeycardOpenSecureChannelRequest = ({
	pairingIndex,
	publicKey,
}: {
	pairingIndex: number
	publicKey: Uint8Array
}) => {
	if (!Number.isInteger(pairingIndex) || pairingIndex < 0 || pairingIndex > 255)
		throw new Error('Keycard pairing index must be one byte')

	if (publicKey.byteLength !== 65 || publicKey[0] !== 0x04)
		throw new Error('Keycard secure-channel public key must be an uncompressed 65-byte SEC1 point')
	try {
		secp256k1.Point.fromBytes(publicKey)
	} catch {
		throw new Error('Keycard secure-channel public key must contain valid secp256k1 coordinates')
	}

	return constructRequest(0x80, 0x10, pairingIndex, 0x00, publicKey)
}

export const constructKeycardSignCurrentKeyRequest = (
	digest: Uint8Array
) => {
	if (digest.byteLength !== 32)
		throw new Error('Keycard ECDSA SIGN requires one 32-byte digest')

	return constructRequest(0x80, 0xc0, 0x00, 0x00, digest)
}

export const auditKeycardAppletResponse = (response: Uint8Array): KeycardAppletResponseAudit => {
	if (response.byteLength < 2)
		throw new Error('Keycard APDU response must include a two-byte status word')

	const statusWord = response[response.byteLength - 2] * 0x100 + response[response.byteLength - 1]

	if (statusWord !== 0x9000)
		throw new KeycardAppletResponseError(statusWord)

	return {
		cryptographicSignatureVerified: false,
		data: response.slice(0, -2),
		evidenceClass: 'apdu-response-audit',
		jCardSimExecutionEstablished: false,
		nativeSettlementEvidence: false,
		physicalCardEvidence: false,
		returnedSignatureAudited: false,
		statusWord,
		walletCapabilityEstablished: false,
	}
}

/**
 * Verifies a protocol-shaped fixture response without claiming that jCardSim or
 * a physical Keycard produced it. Keycard encodes ECDSA SIGN as TLV tag 0x80
 * containing r || s || recoveryId, followed by the APDU status word.
 */
export const verifyKeycardFixtureEcdsaSignature = ({
	digest,
	expectedPublicKey,
	response,
}: {
	digest: Uint8Array
	expectedPublicKey: Uint8Array
	response: Uint8Array
}): KeycardFixtureSignatureVerification => {
	if (digest.byteLength !== 32)
		throw new Error('Keycard ECDSA signature audit requires one 32-byte digest')

	const { data } = auditKeycardAppletResponse(response)
	if (data.byteLength !== 67 || data[0] !== 0x80 || data[1] !== 65)
		throw new Error('Keycard ECDSA SIGN response must contain tag 0x80 with a 65-byte raw signature')

	const rawSignature = data.slice(2)
	const recovery = rawSignature[64]
	if (recovery !== 0 && recovery !== 1)
		throw new Error('Keycard ECDSA SIGN response has an invalid recovery identifier')

	const compactSignature = rawSignature.slice(0, 64)
	if (!secp256k1.verify(compactSignature, digest, expectedPublicKey, { prehash: false }))
		throw new Error('Keycard fixture signature does not verify for the requested digest and public key')

	const recoveredPublicKey = secp256k1.recoverPublicKey(
		Uint8Array.from([recovery, ...compactSignature]),
		digest,
		{ prehash: false }
	)
	const expectedCompressedPublicKey = secp256k1.Point.fromBytes(expectedPublicKey).toBytes(true)
	if (!Buffer.from(recoveredPublicKey).equals(Buffer.from(expectedCompressedPublicKey)))
		throw new Error('Keycard fixture signature recovered a different public key')

	return {
		cryptographicSignatureVerified: true,
		evidenceClass: 'fixture-signature-verification',
		fixtureSignatureVerified: true,
		jCardSimExecutionEstablished: false,
		nativeSettlementEvidence: false,
		physicalCardEvidence: false,
		walletCapabilityEstablished: false,
	}
}
