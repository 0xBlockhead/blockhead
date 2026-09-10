import assert from 'node:assert/strict'
import { test } from 'node:test'
import { decode, encode, Tagged } from 'cborg'
import { secp256k1 } from '@noble/curves/secp256k1.js'
import { keccak256 } from '@tevm/voltaire/Hash'

import {
	inspectKeystoneEthSignature,
	KeystoneQrCapabilityError,
	KeystoneQrResponseError,
	prepareKeystoneEthSignRequest,
	requireKeystoneQrCapability,
	verifyKeystoneEip191FixtureSignature,
} from './keystoneQrEnvelope.ts'


// Fixtures

const address = Uint8Array.from({ length: 20 }, (_, index) => index + 1)
const requestId = Uint8Array.from({ length: 16 }, (_, index) => 0xa0 + index)
const signData = new TextEncoder().encode(JSON.stringify({
	domain: {
		chainId: 1,
		name: 'Permit2',
		verifyingContract: '0x000000000022d473030f116ddee9f6b43ac78ba3',
	},
	message: {
		amount: '25000000',
		spender: '0x111111125421ca6dc452d289314280a0f8842a65',
	},
	primaryType: 'PermitSingle',
}))


// Tests

test('prepares the source-defined ERC-4527 request while withholding QR/device capability', () => {
	// Fault: the host could omit the address/path correlation fields and present typed data to the wrong account.
	// Owner: Keystone QR envelope preparation. Observable: tagged request UUID, EIP-712 type, path, and address in CBOR.
	const envelope = prepareKeystoneEthSignRequest({
		address,
		chainId: 1,
		derivationPath: [
			{ hardened: true, index: 44 },
			{ hardened: true, index: 60 },
			{ hardened: true, index: 0 },
			{ hardened: false, index: 0 },
			{ hardened: false, index: 7 },
		],
		origin: 'Blockhead local deterministic fixture',
		requestId,
		signData,
		signDataType: 'eip-712-typed-data',
	})
	const request = decode(envelope.cbor, {
		tags: Tagged.preserve(37, 304, 401),
		useMaps: true,
	})

	assert.equal(envelope.urType, 'eth-sign-request')
	assert.equal(envelope.capabilityEstablished, false)
	assert(request instanceof Map)
	assert.deepEqual(request.get(1), new Tagged(37, requestId))
	assert.deepEqual(request.get(2), signData)
	assert.deepEqual(request.get(3), new Tagged(401, new Map([[1, 2]])))
	assert.deepEqual(request.get(5), new Tagged(304, new Map<number, (number | boolean)[][] | number>([
		[1, [[44, true], [60, true], [0, true], [0, false], [7, false]]],
		[3, 5],
	])))
	assert.deepEqual(request.get(6), address)
})

test('refuses chain zero before constructing a Keystone QR envelope', () => {
	// Fault: a syntactically unsigned integer with no EVM chain identity reaches
	// offline consent as an Ethereum request. Owner: ERC-4527 request construction.
	// Smallest observable: chain zero is refused before CBOR, QR transport,
	// signature, physical-device, or settlement evidence can exist.
	assert.throws(
		() => prepareKeystoneEthSignRequest({
			address,
			chainId: 0,
			derivationPath: [{ hardened: true, index: 44 }],
			origin: 'Blockhead invalid-chain fixture',
			requestId,
			signData,
			signDataType: 'eip-712-typed-data',
		}),
		/ERC-4527 Ethereum chain ID must be positive/
	)
})

test('rejects a response correlated to a different signing request', () => {
	// Fault: a stale or substituted animated-QR response could be attached to the current authority request.
	// Owner: ERC-4527 response inspection. Observable: UUID mismatch refusal before signature use.
	const staleRequestId = Uint8Array.from(requestId, (byte) => byte ^ 0xff)
	const response = encode(new Map<number, Tagged | Uint8Array>([
		[1, new Tagged(37, staleRequestId)],
		[2, new Uint8Array(65).fill(0x5a)],
		[3, 'Keystone 3 Pro fixture'],
	]))

	assert.throws(
		() => inspectKeystoneEthSignature(response, requestId),
		(error: Error) => {
			assert(error instanceof KeystoneQrResponseError)
			assert(/does not match/.test(error.message))
			return true
		}
	)
})

test('rejects short and empty response UUIDs before signature use', () => {
	// Fault: prefix equality lets a truncated or empty response UUID inherit the
	// current request. Owner: ERC-4527 response correlation. Observable: exact
	// 16-byte UUID refusal occurs before signature bytes are considered.
	for (const malformedRequestId of [requestId.slice(0, 8), new Uint8Array()]) {
		const response = encode(new Map<number, Tagged | Uint8Array>([
			[1, new Tagged(37, malformedRequestId)],
			[2, new Uint8Array(65).fill(0x5a)],
		]))
		assert.throws(
			() => inspectKeystoneEthSignature(response, requestId),
			(error: Error) => {
				assert(error instanceof KeystoneQrResponseError)
				assert(/must contain 16 bytes/.test(error.message))
				return true
			}
		)
	}
})

test('inspects a correlated response without claiming signer verification or device execution', () => {
	// Fault: parsing a well-shaped fixture could be reported as a verified Keystone signature.
	// Owner: ERC-4527 response inspection. Observable: correlation succeeds but verification remains explicitly false.
	const signature = new Uint8Array(65).fill(0x2c)
	const inspected = inspectKeystoneEthSignature(encode(new Map<number, Tagged | Uint8Array | string>([
		[1, new Tagged(37, requestId)],
		[2, signature],
		[3, 'Keystone 3 Pro fixture'],
	])), requestId)

	assert.deepEqual(inspected.signature, signature)
	assert.equal(inspected.deviceOrigin, 'Keystone 3 Pro fixture')
	assert.equal(inspected.verified, false)
	assert.throws(
		requireKeystoneQrCapability,
		(error: Error) => {
			assert(error instanceof KeystoneQrCapabilityError)
			assert.equal(error.capabilityEstablished, false)
			return true
		}
	)
})

test('binds a fixture signature to request, message, and key without claiming hardware execution', () => {
	const privateKey = Uint8Array.from(Array.from({ length: 32 }, (_, index) => index + 1))
	const publicKey = secp256k1.getPublicKey(privateKey, true)
	const message = new TextEncoder().encode('Blockhead Keystone fixture challenge')
	const requestedAddress = keccak256(
		secp256k1.Point.fromBytes(publicKey).toBytes(false).slice(1)
	).slice(-20)
	const request = prepareKeystoneEthSignRequest({
		address: requestedAddress,
		chainId: 1,
		derivationPath: [
			{ hardened: true, index: 44 },
			{ hardened: true, index: 60 },
			{ hardened: true, index: 0 },
			{ hardened: false, index: 0 },
			{ hardened: false, index: 0 },
		],
		origin: 'Blockhead fixture, not QR transport',
		requestId,
		signData: message,
		signDataType: 'eip-191-message',
	})
	const prefix = new TextEncoder().encode(`\u0019Ethereum Signed Message:\n${message.byteLength}`)
	const recoveredSignature = secp256k1.sign(
		keccak256(Uint8Array.from([...prefix, ...message])),
		privateKey,
		{ format: 'recovered', prehash: false }
	)
	let response = encode(new Map<number, Tagged | Uint8Array>([
		[1, new Tagged(37, requestId)],
		[2, Uint8Array.from([...recoveredSignature.slice(1), 27 + recoveredSignature[0]])],
		[3, 'Keystone fixture, not a device observation'],
	]))
	const verification = verifyKeystoneEip191FixtureSignature({
		cbor: response,
		expectedPublicKey: publicKey,
		expectedRequestId: requestId,
		message,
		requestCbor: request.cbor,
	})

	// Fault: a correlated, well-shaped fixture response receives device/emulator or
	// settlement credit without cryptographic request binding. Owner: Keystone
	// fixture response audit. Smallest observable: exact signature verifies while
	// every execution/transport/settlement claim remains false.
	assert.deepEqual(verification, {
		cryptographicSignatureVerified: true,
		emulatorExecutionEstablished: false,
		evidenceClass: 'fixture-signature-verification',
		nativeSettlementObserved: false,
		physicalHardwareEvidence: false,
		qrTransportExecuted: false,
	})
	const truncatedRequest = decode(request.cbor, {
		tags: Tagged.preserve(37, 304, 401),
		useMaps: true,
	})
	assert(truncatedRequest instanceof Map)
	truncatedRequest.set(1, new Tagged(37, requestId.slice(0, 8)))
	assert.throws(
		() => verifyKeystoneEip191FixtureSignature({
			cbor: response,
			expectedPublicKey: publicKey,
			expectedRequestId: requestId,
			message,
			requestCbor: encode(truncatedRequest),
		}),
		(error: Error) => {
			assert(error instanceof KeystoneQrResponseError)
			assert(/ID does not match/.test(error.message))
			return true
		}
	)
	assert.throws(
		() => verifyKeystoneEip191FixtureSignature({
			cbor: response,
			expectedPublicKey: publicKey,
			expectedRequestId: requestId,
			message: new TextEncoder().encode('substituted Keystone challenge'),
			requestCbor: request.cbor,
		}),
		(error: Error) => {
			assert(error instanceof KeystoneQrResponseError)
			assert(/data does not match/.test(error.message))
			return true
		}
	)
	const siblingRequest = prepareKeystoneEthSignRequest({
		address: Uint8Array.from(requestedAddress, (byte, index) => index === 0 ? byte ^ 1 : byte),
		chainId: 1,
		derivationPath: [{ hardened: true, index: 44 }],
		origin: 'Blockhead sibling-address fault',
		requestId,
		signData: message,
		signDataType: 'eip-191-message',
	})
	assert.throws(
		() => verifyKeystoneEip191FixtureSignature({
			cbor: response,
			expectedPublicKey: publicKey,
			expectedRequestId: requestId,
			message,
			requestCbor: siblingRequest.cbor,
		}),
		/address does not match/
	)
	const tamperedResponse = decode(response, { tags: Tagged.preserve(37), useMaps: true })
	assert(tamperedResponse instanceof Map)
	const tamperedSignature = tamperedResponse.get(2)
	assert(tamperedSignature instanceof Uint8Array)
	tamperedSignature[0] ^= 1
	response = encode(tamperedResponse)
	assert.throws(
		() => verifyKeystoneEip191FixtureSignature({
			cbor: response,
			expectedPublicKey: publicKey,
			expectedRequestId: requestId,
			message,
			requestCbor: request.cbor,
		}),
		(error: Error) => {
			assert(error instanceof KeystoneQrResponseError)
			assert(/does not verify/.test(error.message))
			return true
		}
	)
})
