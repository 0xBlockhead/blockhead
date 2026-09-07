import { type as arktype } from 'arktype'
import { ed25519 } from '@noble/curves/ed25519.js'
import { hex } from '@scure/base'
import { Blake2 } from '@tevm/voltaire/Blake2'
import {
	decode,
	encode,
} from 'cborg'

import { WalletAdapterResponseAuditFailure } from './types.ts'

const bytesWire = arktype.instanceOf(Uint8Array)
const mapWire = arktype.instanceOf(Map)
const dataSignatureWire = arktype({
	key: 'string',
	signature: 'string',
}).onUndeclaredKey('reject')
const coseSign1Wire = arktype([
	bytesWire,
	mapWire,
	bytesWire,
	bytesWire,
])
const protectedHeadersWire = arktype({
	algorithm: 'number',
	address: bytesWire,
	'keyId?': bytesWire,
})
const coseKeyHeadersWire = arktype({
	algorithm: 'number',
	curve: 'number',
	keyType: 'number',
	publicKey: bytesWire,
	'keyId?': bytesWire,
})

const cip30HexPattern = /^(?:[0-9a-f]{2})+$/i

const bytesEqual = (
	left: Uint8Array,
	right: Uint8Array
) => (
	left.byteLength === right.byteLength
	&& left.every((byte, index) => byte === right[index])
)

const responseFailure = (message: string) => new WalletAdapterResponseAuditFailure(
	message,
	'cardano-cip30'
)

const decodeCbor = (
	encoded: Uint8Array,
	name: string
) => {
	try {
		return decode(encoded, {
			rejectDuplicateMapKeys: true,
			useMaps: true,
		})
	}
	catch {
		throw responseFailure(`Cardano CIP-30 wallet returned malformed CBOR ${name}`)
	}
}

const decodeHexCbor = (
	encoded: string,
	name: string
) => {
	if (!cip30HexPattern.test(encoded))
		throw responseFailure(`Cardano CIP-30 wallet returned a non-hexadecimal ${name}`)

	return decodeCbor(hex.decode(encoded), name)
}

const decodeCardanoPointerNatural = (
	bytes: Uint8Array,
	offset: number,
	maximum: bigint
) => {
	let value = 0n
	let index = offset

	while (index < bytes.length) {
		const byte = bytes[index]
		if (index === offset && (byte & 0x7f) === 0 && (byte & 0x80) !== 0)
			return undefined

		value = (value << 7n) | BigInt(byte & 0x7f)
		if (value > maximum)
			return undefined

		index++
		if ((byte & 0x80) === 0)
			return index
	}

	return undefined
}

const cardanoSigningCredential = (address: Uint8Array) => {
	const addressType = address[0] >> 4
	if (
		(addressType === 0 || addressType === 2)
		&& address.byteLength === 57
	)
		return address.slice(1, 29)
	if (addressType === 4) {
		const transactionIndexOffset = decodeCardanoPointerNatural(
			address,
			29,
			0xffff_ffff_ffff_ffffn
		)
		if (transactionIndexOffset == null)
			return undefined
		const certificateIndexOffset = decodeCardanoPointerNatural(
			address,
			transactionIndexOffset,
			0xffffn
		)
		if (certificateIndexOffset == null)
			return undefined
		const pointerEnd = decodeCardanoPointerNatural(
			address,
			certificateIndexOffset,
			0xffffn
		)
		if (pointerEnd !== address.byteLength)
			return undefined

		return address.slice(1, 29)
	}
	if (
		(addressType === 6 || addressType === 14)
		&& address.byteLength === 29
	)
		return address.slice(1, 29)

	return undefined
}

const checkedDataSignature = (
	// oxlint-disable-next-line typescript/no-restricted-types -- CIP-30 DataSignature is untrusted injected-wallet input and is parsed at this wire boundary.
	response: unknown
) => {
	const dataSignature = dataSignatureWire(response)
	if (dataSignature instanceof arktype.errors)
		throw responseFailure('Cardano CIP-30 wallet returned a malformed DataSignature')

	return dataSignature
}

/**
 * Verifies the exact CIP-30 signData request against its returned CIP-8
 * COSE_Sign1 and COSE_Key evidence.
 */
export const verifyCardanoCip30SignData = ({
	address,
	payload,
	response,
}: {
	address: string
	payload: string
	// oxlint-disable-next-line typescript/no-restricted-types -- CIP-30 DataSignature is untrusted injected-wallet input and is parsed at this wire boundary.
	response: unknown
}) => {
	if (!cip30HexPattern.test(address) || !cip30HexPattern.test(payload))
		throw new Error('Cardano CIP-30 signData request must use hexadecimal address and payload bytes')

	const addressBytes = hex.decode(address)
	const payloadBytes = hex.decode(payload)
	const credential = cardanoSigningCredential(addressBytes)
	if (credential == null)
		throw new Error('Cardano CIP-30 signData request does not use a payment- or stake-key address')

	const dataSignature = checkedDataSignature(response)
	const coseSign1 = coseSign1Wire(decodeHexCbor(
		dataSignature.signature,
		'COSE_Sign1'
	))
	const coseKey = mapWire(decodeHexCbor(
		dataSignature.key,
		'COSE_Key'
	))
	if (
		coseSign1 instanceof arktype.errors
		|| coseKey instanceof arktype.errors
	)
		throw responseFailure('Cardano CIP-30 wallet returned malformed COSE_Sign1 or COSE_Key evidence')

	const [
		protectedBytes,
		unprotectedHeaders,
		signedPayload,
		signature,
	] = coseSign1
	const protectedHeaders = mapWire(decodeCbor(
		protectedBytes,
		'COSE_Sign1 protected headers'
	))
	if (protectedHeaders instanceof arktype.errors)
		throw responseFailure('Cardano CIP-30 wallet returned malformed COSE_Sign1 protected headers')
	if ([...protectedHeaders.keys()].some((header) => unprotectedHeaders.has(header)))
		throw responseFailure('Cardano CIP-30 wallet duplicated a COSE header across protected and unprotected maps')
	if (
		protectedHeaders.has(2)
		|| unprotectedHeaders.has(2)
		|| protectedHeaders.has('hashed')
		|| !unprotectedHeaders.has('hashed')
		|| unprotectedHeaders.get('hashed') !== false
	)
		throw responseFailure('Cardano CIP-30 wallet returned unsupported COSE headers')

	const protectedHeader = (
		protectedHeaders.has(4) ?
			protectedHeadersWire({
				address: protectedHeaders.get('address'),
				algorithm: protectedHeaders.get(1),
				keyId: protectedHeaders.get(4),
			})
		:
			protectedHeadersWire({
				address: protectedHeaders.get('address'),
				algorithm: protectedHeaders.get(1),
			})
	)
	const key = (
		coseKey.has(2) ?
			coseKeyHeadersWire({
				algorithm: coseKey.get(3),
				curve: coseKey.get(-1),
				keyId: coseKey.get(2),
				keyType: coseKey.get(1),
				publicKey: coseKey.get(-2),
			})
		:
			coseKeyHeadersWire({
				algorithm: coseKey.get(3),
				curve: coseKey.get(-1),
				keyType: coseKey.get(1),
				publicKey: coseKey.get(-2),
			})
	)
	if (
		protectedHeader instanceof arktype.errors
		|| key instanceof arktype.errors
		|| protectedHeader.algorithm !== -8
		|| key.algorithm !== -8
		|| key.curve !== 6
		|| key.keyType !== 1
		|| key.publicKey.byteLength !== 32
		|| signature.byteLength !== 64
		|| coseKey.has(-4)
	)
		throw responseFailure('Cardano CIP-30 wallet returned unsupported COSE key or signature semantics')
	if (
		(protectedHeader.keyId == null) !== (key.keyId == null)
		|| (
			protectedHeader.keyId != null
			&& key.keyId != null
			&& !bytesEqual(protectedHeader.keyId, key.keyId)
		)
	)
		throw responseFailure('Cardano CIP-30 wallet returned mismatched COSE key identifiers')
	if (!bytesEqual(protectedHeader.address, addressBytes))
		throw responseFailure('Cardano CIP-30 COSE address differs from the exact signData request')
	if (!bytesEqual(signedPayload, payloadBytes))
		throw responseFailure('Cardano CIP-30 COSE payload differs from the exact signData request')
	if (!bytesEqual(credential, Blake2.hash(key.publicKey, 28)))
		throw responseFailure('Cardano CIP-30 COSE public key does not own the requested address')

	let verified = false
	try {
		verified = ed25519.verify(
			signature,
			encode([
				'Signature1',
				protectedBytes,
				new Uint8Array(),
				payloadBytes,
			]),
			key.publicKey
		)
	}
	catch {
		verified = false
	}
	if (!verified)
		throw responseFailure('Cardano CIP-30 COSE signature does not verify for the exact signData request')

	return dataSignature.signature
}
