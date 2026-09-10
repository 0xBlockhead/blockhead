import assert from 'node:assert/strict'
import { test } from 'node:test'

import { secp256k1 } from '@noble/curves/secp256k1.js'
import { keccak256 } from '@tevm/voltaire/Hash'
import {
	createLedgerSpeculosPlan,
	encodeEthereumGetAddressApdu,
	exchangeLedgerSpeculosApdu,
	hardenedLedgerPath,
	LedgerSpeculosApduError,
	LedgerSpeculosUnavailableError,
	startLedgerSpeculos,
	verifyLedgerEthereumAddressFixture,
	verifyLedgerEthereumPersonalMessageSignature,
} from './ledgerSpeculos.ts'


// Constants

const profileInput = {
	apiPort: 45_100,
	apduPort: 45_101,
	applicationPath: '/opt/ledger/apps/ethereum.elf',
	executable: '/opt/speculos/speculos.py',
	identity: 'worker-2-repeat-3-ledger-ethereum',
	model: 'nanosp' as const,
	workingDirectory: '/opt/speculos',
}


// Tests

for (const model of ['stax', 'nanos', 'nanosp', 'nanox', 'flex'] as const) {
	test(`plans isolated ${model} REST and APDU surfaces without establishing wallet capability`, () => {
		// Configuration is not executable or physical Ledger evidence.
		const plan = createLedgerSpeculosPlan({ ...profileInput, model })

		assert.equal(plan.profile.command.args.includes(model), true)
		assert.equal(plan.evidenceClass, 'configuration-only')
		assert.equal(plan.capabilityEstablished, false)
		assert.equal(plan.emulatorProtocolExecuted, false)
		assert.equal(plan.physicalHardwareEvidence, false)
		assert.equal(plan.productionModelExecutionEstablished, false)
		assert.equal(plan.nativeSettlementEvidence, false)
		assert.equal(plan.apduEndpoint.href, 'http://127.0.0.1:45100/apdu')
		assert.equal(plan.automationEndpoint.href, 'http://127.0.0.1:45100/button')
		if (!('endpoint' in plan.profile.readiness))
			assert.fail('Speculos must use HTTP readiness')
		assert.equal(plan.profile.readiness.endpoint.href, 'http://127.0.0.1:45100/events')
	})
}

test('encodes the production Ethereum address APDU with an exact hardened derivation path', () => {
	// Fault: endianness or display consent could diverge while a synthetic address fixture still passes.
	// Owner: Ledger Ethereum APDU request construction. Observable: exact CLA/INS/P1/Lc and BIP-44 bytes.
	const command = encodeEthereumGetAddressApdu({
		display: true,
		path: hardenedLedgerPath(44, 60, 0, 0, 0),
	})

	assert.equal(
		Buffer.from(command).toString('hex'),
		'e002010015058000002c8000003c800000008000000080000000'
	)
})

test('binds a Ledger-shaped address fixture to its returned public key without emulator credit', () => {
	// Fault: a shaped GET ADDRESS response could pair a valid public key with a
	// sibling address and be counted as device identity.
	// Owner: Ledger Ethereum address response audit. Observable: the documented
	// length framing and Keccak-derived address agree while all execution tiers stay false.
	const publicKey = secp256k1.getPublicKey(
		Uint8Array.from({ length: 32 }, (_, index) => index + 1),
		false
	)
	const address = Buffer.from(keccak256(publicKey.slice(1)).slice(-20)).toString('hex')
	const response = Uint8Array.from([
		publicKey.byteLength,
		...publicKey,
		address.length,
		...new TextEncoder().encode(address),
	])

	assert.deepEqual(verifyLedgerEthereumAddressFixture(response), {
		address: `0x${address}`,
		emulatorExecutionEstablished: false,
		evidenceClass: 'fixture-address-verification',
		nativeSettlementEvidence: false,
		physicalHardwareEvidence: false,
		productionModelExecutionEstablished: false,
		publicKey,
	})
	const substituted = Uint8Array.from(response)
	substituted[substituted.length - 1] = substituted[substituted.length - 1] === 0x30 ? 0x31 : 0x30
	assert.throws(
		() => verifyLedgerEthereumAddressFixture(substituted),
		/does not match its public key/
	)
})

test('rejects an internally consistent address response with an impossible SEC1 key', () => {
	// Fault: an arbitrary 65-byte blob and its matching Keccak suffix can pass as a
	// Ledger account. Owner: Ledger Ethereum GET ADDRESS response audit. Smallest
	// observable: invalid secp256k1 coordinates are refused before address matching.
	const impossiblePublicKey = Uint8Array.from([0x04, ...Array<number>(64).fill(0)])
	const derivedAddress = Buffer.from(
		keccak256(impossiblePublicKey.slice(1)).slice(-20)
	).toString('hex')
	const response = Uint8Array.from([
		impossiblePublicKey.byteLength,
		...impossiblePublicKey,
		derivedAddress.length,
		...new TextEncoder().encode(derivedAddress),
	])

	assert.throws(
		() => verifyLedgerEthereumAddressFixture(response),
		(error: Error) => {
			assert(error instanceof LedgerSpeculosApduError)
			assert.equal(error.phase, 'apdu')
			assert(/invalid secp256k1 coordinates/.test(error.message))
			return true
		}
	)
})

test('parses a production-shaped Speculos APDU response without claiming emulator capability', async () => {
	// Fault: the harness could accept a malformed envelope or expose the trailing status word as signed payload.
	// Owner: Speculos APDU transport. Observable: exact POST body and response bytes excluding 0x9000.
	const requests: Array<{ body: string | null, method: string | undefined }> = []
	const result = await exchangeLedgerSpeculosApdu({
		command: Uint8Array.from([0xe0, 0x02, 0x00, 0x00, 0x00]),
		endpoint: new URL('http://127.0.0.1:45100/apdu'),
		fetchImplementation: async (_input, init) => {
			requests.push({
				body: await new Response(init?.body).text(),
				method: init?.method,
			})
			return new Response(JSON.stringify({ data: '04aabb9000' }), { status: 200 })
		},
	})

	assert.deepEqual(requests, [{
		body: '{"data":"e002000000"}',
		method: 'POST',
	}])
	assert.deepEqual(result, {
		data: Uint8Array.from([0x04, 0xaa, 0xbb]),
		emulatorProtocolExecuted: false,
		evidenceClass: 'apdu-response-audit',
		nativeSettlementEvidence: false,
		physicalHardwareEvidence: false,
		productionModelExecutionEstablished: false,
		returnedSignatureVerified: false,
		statusWord: 0x9000,
	})
})

test('refuses incomplete or extended APDU commands before transport', async () => {
	// Fault: a process-ready Speculos endpoint could turn malformed input into apparent
	// protocol evidence. Owner: Ledger APDU transport boundary. Observable: malformed
	// commands fail locally and never invoke fetch.
	let fetchCalls = 0
	const fetchImplementation: typeof fetch = async () => {
		fetchCalls += 1
		throw new Error('unexpected transport')
	}

	for (const command of [new Uint8Array(0), new Uint8Array(4), new Uint8Array(261)])
		await assert.rejects(
			exchangeLedgerSpeculosApdu({
				command,
				endpoint: new URL('http://127.0.0.1:8100/apdu'),
				fetchImplementation,
			}),
			/complete short APDU/
		)

	assert.equal(fetchCalls, 0)
})

test('promotes only a cryptographically verified Ledger response beyond APDU audit', () => {
	// Fault: a successful APDU status word could be counted as a valid signature
	// without binding the returned bytes to the requested message and account.
	// Owner: Ledger Ethereum returned-signature audit.
	// Observable: real secp256k1 verification and public-key recovery succeed for
	// the exact EIP-191 digest while emulator and physical-device evidence stay false.
	const privateKey = Uint8Array.from([
		17, 29, 43, 59, 71, 83, 97, 109,
		127, 139, 151, 163, 179, 191, 211, 223,
		229, 233, 239, 241, 251, 3, 13, 23,
		37, 47, 61, 73, 89, 101, 113, 131,
	])
	const message = new TextEncoder().encode('Blockhead Ledger emulator challenge: session 42')
	const prefix = new TextEncoder().encode(`\u0019Ethereum Signed Message:\n${message.byteLength}`)
	const digest = keccak256(Uint8Array.from([...prefix, ...message]))
	const recoveredSignature = secp256k1.sign(digest, privateKey, {
		format: 'recovered',
		prehash: false,
	})
	const verification = verifyLedgerEthereumPersonalMessageSignature({
		expectedPublicKey: secp256k1.getPublicKey(privateKey, true),
		message,
		responseData: Uint8Array.from([
			27 + recoveredSignature[0],
			...recoveredSignature.slice(1),
		]),
	})

	assert.deepEqual(verification, {
		evidenceClass: 'cryptographic-signature-verification',
		emulatorExecutionEstablished: false,
		nativeSettlementEvidence: false,
		physicalHardwareEvidence: false,
		productionModelExecutionEstablished: false,
		returnedSignatureVerified: true,
	})
})

test('rejects a signature copied from a different Ledger request', () => {
	// Fault: signature verification could validate only shape or signer while
	// accepting a signature from a neighboring request.
	// Owner: Ledger Ethereum returned-signature audit.
	// Observable: changing only the requested message produces an APDU-phase refusal.
	const privateKey = Uint8Array.from(Array.from({ length: 32 }, (_, index) => index + 1))
	const signedMessage = new TextEncoder().encode('approved Ledger request')
	const prefix = new TextEncoder().encode(`\u0019Ethereum Signed Message:\n${signedMessage.byteLength}`)
	const signature = secp256k1.sign(
		keccak256(Uint8Array.from([...prefix, ...signedMessage])),
		privateKey,
		{ format: 'recovered', prehash: false }
	)

	assert.throws(
		() => verifyLedgerEthereumPersonalMessageSignature({
			expectedPublicKey: secp256k1.getPublicKey(privateKey, true),
			message: new TextEncoder().encode('substituted Ledger request'),
			responseData: Uint8Array.from([27 + signature[0], ...signature.slice(1)]),
		}),
		(error: Error) => {
			assert(error instanceof LedgerSpeculosApduError)
			assert.equal(error.phase, 'apdu')
			assert(/does not verify/.test(error.message))
			return true
		}
	)
})

test('keeps a modeled APDU refusal distinct from transport and emulator capability', async () => {
	// Fault: a modeled rejection status word could be treated as successful emulator execution.
	// Owner: Ledger APDU response classification. Observable: typed APDU failure retains the status word and no capability claim.
	await assert.rejects(
		exchangeLedgerSpeculosApdu({
			command: Uint8Array.from([0xe0, 0x02, 0x01, 0x00, 0x00]),
			endpoint: new URL('http://127.0.0.1:45100/apdu'),
			fetchImplementation: async () => new Response(
				JSON.stringify({ data: '6985' }),
				{ status: 200 }
			),
		}),
		(error: Error) => {
			assert(error instanceof LedgerSpeculosApduError)
			assert.equal(error.phase, 'apdu')
			assert.equal(error.statusWord, 0x6985)
			assert.equal(error.capabilityEstablished, false)
			return true
		}
	)
})

test('refuses missing Speculos assets before launch and never promotes the plan to capability', async () => {
	// Fault: a declared profile could silently install a fallback or defer a missing ELF to an ambiguous readiness timeout.
	// Owner: Speculos launch boundary. Observable: configuration refusal before process capability is established.
	const plan = createLedgerSpeculosPlan({
		...profileInput,
		applicationPath: '/blockhead-absent/ethereum.elf',
		executable: '/blockhead-absent/speculos.py',
	})

	await assert.rejects(
		startLedgerSpeculos(plan),
		(error: Error) => {
			assert(error instanceof LedgerSpeculosUnavailableError)
			assert.equal(error.phase, 'configuration')
			assert.equal(error.capabilityEstablished, false)
			assert(error.message.includes('Speculos executable is unavailable'))
			return true
		}
	)
	assert.equal(plan.capabilityEstablished, false)
})

test('rejects invalid derivation coordinates before constructing an APDU', () => {
	// Fault: negative or non-integer path components could wrap into another Ledger account.
	// Owner: Ledger derivation-path constructor. Observable: request construction refuses before transport.
	assert.throws(() => hardenedLedgerPath(44, 60, -1), /unsigned 31-bit integers/)
	assert.throws(() => hardenedLedgerPath(44, 60, 1.5), /unsigned 31-bit integers/)
	assert.throws(() => hardenedLedgerPath(), /between 1 and 10/)
	assert.throws(
		() => encodeEthereumGetAddressApdu({ display: false, path: [] }),
		/between 1 and 10/
	)
	assert.throws(
		() => encodeEthereumGetAddressApdu({ display: false, path: [0x1_0000_0000] }),
		/unsigned 32-bit integers/
	)
})
