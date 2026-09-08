import { decode, encode, Tagged } from 'cborg'
import { type } from 'arktype'
import { secp256k1 } from '@noble/curves/secp256k1.js'
import { keccak256 } from '@tevm/voltaire/Hash'


// Types

export type KeystoneEvmSignDataType =
	| 'eip-191-message'
	| 'eip-712-typed-data'
	| 'eip-2718-transaction'
	| 'legacy-transaction'

export type KeystoneEthSignRequestInput = {
	address: Uint8Array
	chainId: number
	derivationPath: readonly {
		hardened: boolean
		index: number
	}[]
	origin: string
	requestId: Uint8Array
	signData: Uint8Array
	signDataType: KeystoneEvmSignDataType
}

export type KeystonePreparedQrEnvelope = {
	capabilityEstablished: false
	cbor: Uint8Array
	urType: 'eth-sign-request'
}

export type KeystoneInspectedSignatureEnvelope = {
	deviceOrigin: string | undefined
	requestId: Uint8Array
	signature: Uint8Array
	verified: false
}

export type KeystoneFixtureSignatureVerification = {
	cryptographicSignatureVerified: true
	emulatorExecutionEstablished: false
	evidenceClass: 'fixture-signature-verification'
	nativeSettlementObserved: false
	physicalHardwareEvidence: false
	qrTransportExecuted: false
}


// Constants

const signDataTypes = {
	'eip-191-message': 3,
	'eip-712-typed-data': 2,
	'eip-2718-transaction': 4,
	'legacy-transaction': 1,
} as const satisfies Record<KeystoneEvmSignDataType, number>


// Errors

export class KeystoneQrCapabilityError extends Error {
	readonly capabilityEstablished = false

	constructor() {
		super('Keystone QR transport capability requires BC-UR fragmentation and assembly, camera/display transport, and a physical device; CBOR envelope encoding alone is insufficient')
		this.name = 'KeystoneQrCapabilityError'
	}
}

export class KeystoneQrResponseError extends Error {
	constructor(message: string) {
		super(message)
		this.name = 'KeystoneQrResponseError'
	}
}


// Functions

const requireByteLength = (label: string, value: Uint8Array, expectedLength: number) => {
	if (value.byteLength !== expectedLength)
		throw new RangeError(`${label} must contain ${expectedLength} bytes`)
}

const bytesEqual = (left: Uint8Array, right: Uint8Array) => (
	left.byteLength === right.byteLength
	&& left.every((byte, index) => byte === right[index])
)

const requireUnsignedInteger = (label: string, value: number) => {
	if (!Number.isSafeInteger(value) || value < 0)
		throw new RangeError(`${label} must be a non-negative safe integer`)
}

export const prepareKeystoneEthSignRequest = ({
	address,
	chainId,
	derivationPath,
	origin,
	requestId,
	signData,
	signDataType,
}: KeystoneEthSignRequestInput): KeystonePreparedQrEnvelope => {
	requireByteLength('Ethereum address', address, 20)
	requireByteLength('ERC-4527 request ID', requestId, 16)
	requireUnsignedInteger('Chain ID', chainId)
	if (chainId === 0)
		throw new RangeError('ERC-4527 Ethereum chain ID must be positive')
	if (derivationPath.length === 0)
		throw new RangeError('Derivation path must contain at least one component')
	if (origin.length === 0)
		throw new RangeError('Origin must not be empty')
	if (signData.byteLength === 0)
		throw new RangeError('Sign data must not be empty')

	const components = derivationPath.map(({ hardened, index }) => {
		requireUnsignedInteger('Derivation path index', index)
		if (index >= 2_147_483_648)
			throw new RangeError('Derivation path index must fit ERC-4527 uint31')
		return [index, hardened] as const
	})
	const keypath = new Map<number, typeof components | number>([
		[1, components],
		[3, components.length],
	])
	const request = new Map<number, Tagged | Uint8Array | number | string>([
		[1, new Tagged(37, requestId)],
		[2, signData],
		[3, new Tagged(401, new Map([[1, signDataTypes[signDataType]]]))],
		[4, chainId],
		[5, new Tagged(304, keypath)],
		[6, address],
		[7, origin],
	])

	return {
		capabilityEstablished: false,
		cbor: encode(request),
		urType: 'eth-sign-request',
	}
}

export const inspectKeystoneEthSignature = (
	cbor: Uint8Array,
	expectedRequestId: Uint8Array
): KeystoneInspectedSignatureEnvelope => {
	requireByteLength('Expected ERC-4527 request ID', expectedRequestId, 16)
	const decoded = decode(cbor, {
		tags: Tagged.preserve(37),
		useMaps: true,
	})
	if (!(decoded instanceof Map))
		throw new KeystoneQrResponseError('ERC-4527 eth-signature must be a CBOR map')
	const taggedRequestId = decoded.get(1)
	const signature = decoded.get(2)
	const deviceOrigin = decoded.get(3)
	if (!(taggedRequestId instanceof Tagged) || !(taggedRequestId.value instanceof Uint8Array))
		throw new KeystoneQrResponseError('ERC-4527 eth-signature request ID is missing its UUID tag')
	if (taggedRequestId.value.byteLength !== 16)
		throw new KeystoneQrResponseError('ERC-4527 eth-signature request ID must contain 16 bytes')
	if (!bytesEqual(taggedRequestId.value, expectedRequestId))
		throw new KeystoneQrResponseError('ERC-4527 eth-signature request ID does not match the request')
	if (!(signature instanceof Uint8Array))
		throw new KeystoneQrResponseError('ERC-4527 eth-signature bytes are missing')
	requireByteLength('ERC-4527 signature', signature, 65)
	if (!type('string | undefined').allows(deviceOrigin))
		throw new KeystoneQrResponseError('ERC-4527 eth-signature origin must be text')

	return {
		deviceOrigin,
		requestId: taggedRequestId.value,
		signature,
		verified: false,
	}
}

export const verifyKeystoneEip191FixtureSignature = ({
	cbor,
	expectedPublicKey,
	expectedRequestId,
	message,
	requestCbor,
}: {
	cbor: Uint8Array
	expectedPublicKey: Uint8Array
	expectedRequestId: Uint8Array
	message: Uint8Array
	requestCbor: Uint8Array
}): KeystoneFixtureSignatureVerification => {
	const request = decode(requestCbor, {
		tags: Tagged.preserve(37, 304, 401),
		useMaps: true,
	})
	if (!(request instanceof Map))
		throw new KeystoneQrResponseError('ERC-4527 eth-sign-request must be a CBOR map')
	const requestId = request.get(1)
	const signData = request.get(2)
	const dataType = request.get(3)
	const requestedAddress = request.get(6)
	if (
		!(requestId instanceof Tagged)
		|| !(requestId.value instanceof Uint8Array)
		|| requestId.value.byteLength !== 16
		|| !bytesEqual(requestId.value, expectedRequestId)
	)
		throw new KeystoneQrResponseError('ERC-4527 eth-sign-request ID does not match the response request')
	if (!(signData instanceof Uint8Array) || !signData.every((byte, index) => byte === message[index]) || signData.length !== message.length)
		throw new KeystoneQrResponseError('ERC-4527 eth-sign-request data does not match the audited message')
	if (!(dataType instanceof Tagged) || !(dataType.value instanceof Map) || dataType.value.get(1) !== 3)
		throw new KeystoneQrResponseError('ERC-4527 eth-sign-request is not an EIP-191 message')
	if (!(requestedAddress instanceof Uint8Array) || requestedAddress.byteLength !== 20)
		throw new KeystoneQrResponseError('ERC-4527 eth-sign-request omitted its Ethereum address')
	const derivedAddress = keccak256(
		secp256k1.Point.fromBytes(expectedPublicKey).toBytes(false).slice(1)
	).slice(-20)
	if (!requestedAddress.every((byte, index) => byte === derivedAddress[index]))
		throw new KeystoneQrResponseError('ERC-4527 eth-sign-request address does not match the expected public key')

	const { signature } = inspectKeystoneEthSignature(cbor, expectedRequestId)
	const rawRecovery = signature[64]
	const recovery = rawRecovery >= 27 ? rawRecovery - 27 : rawRecovery
	if (recovery !== 0 && recovery !== 1)
		throw new KeystoneQrResponseError('ERC-4527 eth-signature has an invalid recovery identifier')

	const prefix = new TextEncoder().encode(`\u0019Ethereum Signed Message:\n${message.byteLength}`)
	const digest = keccak256(Uint8Array.from([...prefix, ...message]))
	const compactSignature = signature.slice(0, 64)
	if (!secp256k1.verify(compactSignature, digest, expectedPublicKey, { prehash: false }))
		throw new KeystoneQrResponseError('ERC-4527 eth-signature does not verify for the requested message and public key')

	const recoveredPublicKey = secp256k1.recoverPublicKey(
		Uint8Array.from([recovery, ...compactSignature]),
		digest,
		{ prehash: false }
	)
	const expectedCompressedPublicKey = secp256k1.Point.fromBytes(expectedPublicKey).toBytes(true)
	if (!recoveredPublicKey.every((byte, index) => byte === expectedCompressedPublicKey[index]))
		throw new KeystoneQrResponseError('ERC-4527 eth-signature recovered a different public key')

	return {
		cryptographicSignatureVerified: true,
		emulatorExecutionEstablished: false,
		evidenceClass: 'fixture-signature-verification',
		nativeSettlementObserved: false,
		physicalHardwareEvidence: false,
		qrTransportExecuted: false,
	}
}

export const requireKeystoneQrCapability = (): never => {
	throw new KeystoneQrCapabilityError()
}
