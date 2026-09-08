import assert from 'node:assert/strict'
import { test } from 'node:test'
import { secp256k1 } from '@noble/curves/secp256k1.js'
import * as Hash from 'ox/Hash'

import {
	BitBox02SimulatorUnavailableError,
	createBitBox02SimulatorPlan,
	planBitBox02Eip1559Transaction,
	planBitBox02LegacyTransaction,
	planBitBox02Message,
	startBitBox02Simulator,
	verifyBitBox02FixtureMessageSignature,
} from './bitBox02Simulator.ts'


// Constants

const profileInput = {
	executable: '/opt/bitbox02/build-build-noasan/bin/simulator',
	fakeMemoryFilePath: '/opt/bitbox02/state/worker-2-repeat-1.bin',
	identity: 'worker-2-repeat-1-bitbox02-simulator',
	port: 48_300,
	workingDirectory: '/opt/bitbox02',
}

const transaction = {
	data: Uint8Array.from([0xa9, 0x05, 0x9c, 0xbb]),
	gasLimit: Uint8Array.from([0x01, 0x86, 0xa0]),
	nonce: Uint8Array.from([0x07]),
	recipient: Uint8Array.from({ length: 20 }, (_, index) => index + 1),
	value: Uint8Array.from([0x0d, 0xe0, 0xb6, 0xb3, 0xa7, 0x64, 0x00, 0x00]),
}


// Tests

test('plans the official isolated simulator state and TCP surface without claiming capability', () => {
	// Fault: two workers could share the simulator's fake flash or configuration could be counted as hardware execution.
	// Owner: BitBox02 simulator plan. Observable: unique state path plus configuration-only and non-physical evidence.
	const plan = createBitBox02SimulatorPlan(profileInput)

	assert.deepEqual(plan.profile.command.args, ['--port', '48300'])
	assert.deepEqual(plan.profile.command.environment, {
		FAKE_MEMORY_FILEPATH: '/opt/bitbox02/state/worker-2-repeat-1.bin',
	})
	assert.equal(plan.evidenceClass, 'configuration-only')
	assert.equal(plan.signingRequestEvidence, 'request-construction-only')
	assert.equal(plan.capabilityEstablished, false)
	assert.equal(plan.emulatorProtocolExecuted, false)
	assert.equal(plan.responseAuditAvailable, false)
	assert.equal(plan.cryptographicSignatureVerified, false)
	assert.equal(plan.productionModelExecutionEstablished, false)
	assert.equal(plan.physicalHardwareEvidence, false)
	assert.equal(plan.nativeSettlementEvidence, false)
	assert.equal(Object.isFrozen(plan), true)
})

test('constructs distinct source-shaped legacy, EIP-1559 and personal-message calls', () => {
	// Fault: transaction families could collapse into one generic payload and send the wrong fee or chain-id location.
	// Owner: BitBox02 API request planner. Observable: each official method retains its distinct positional arguments.
	const legacy = planBitBox02LegacyTransaction({
		chainId: 1n,
		keypath: "m/44'/60'/0'/0/0",
		transaction: {
			...transaction,
			gasPrice: Uint8Array.from([0x3b, 0x9a, 0xca, 0x00]),
		},
	})
	const eip1559 = planBitBox02Eip1559Transaction({
		keypath: "m/44'/60'/0'/0/0",
		transaction: {
			...transaction,
			chainId: 1n,
			maxFeePerGas: Uint8Array.from([0x04, 0xa8, 0x17, 0xc8, 0x00]),
			maxPriorityFeePerGas: Uint8Array.from([0x3b, 0x9a, 0xca, 0x00]),
		},
	})
	const message = planBitBox02Message({
		chainId: 1n,
		keypath: "m/44'/60'/0'/0/0",
		message: new TextEncoder().encode('Confirm Blockhead session 2026-09-04T14:00:00Z'),
	})

	assert.equal(legacy.method, 'ethSignTransaction')
	assert.equal(legacy.arguments[0], 1n)
	assert.equal(legacy.arguments[1], "m/44'/60'/0'/0/0")
	assert.equal(eip1559.method, 'ethSign1559Transaction')
	assert.equal(eip1559.arguments[1].chainId, 1n)
	assert.equal(message.method, 'ethSignMessage')
	assert.equal(new TextDecoder().decode(message.arguments[2]), 'Confirm Blockhead session 2026-09-04T14:00:00Z')
})

test('does not promote request construction into a returned or verified BitBox02 response', () => {
	// Fault: production-shaped signing arguments are counted as simulator execution or a cryptographically bound device response.
	// Owner: BitBox02 simulator evidence boundary. Observable: response audit and every later execution/evidence tier remain explicitly false.
	const plan = createBitBox02SimulatorPlan(profileInput)

	assert.deepEqual({
		cryptographicSignatureVerified: plan.cryptographicSignatureVerified,
		emulatorProtocolExecuted: plan.emulatorProtocolExecuted,
		nativeSettlementEvidence: plan.nativeSettlementEvidence,
		physicalHardwareEvidence: plan.physicalHardwareEvidence,
		productionModelExecutionEstablished: plan.productionModelExecutionEstablished,
		responseAuditAvailable: plan.responseAuditAvailable,
	}, {
		cryptographicSignatureVerified: false,
		emulatorProtocolExecuted: false,
		nativeSettlementEvidence: false,
		physicalHardwareEvidence: false,
		productionModelExecutionEstablished: false,
		responseAuditAvailable: false,
	})
})

test('copies byte fields so later caller mutation cannot alter the planned consent request', () => {
	// Fault: UI-owned buffers could mutate after review and change bytes sent to the simulator.
	// Owner: BitBox02 request planner. Observable: planned recipient and calldata retain their original bytes.
	const source = {
		...transaction,
		data: Uint8Array.from(transaction.data),
		gasPrice: Uint8Array.from([0x01]),
		recipient: Uint8Array.from(transaction.recipient),
	}
	const request = planBitBox02LegacyTransaction({
		chainId: 1n,
		keypath: "m/44'/60'/0'/0/0",
		transaction: source,
	})
	if (request.method !== 'ethSignTransaction')
		assert.fail('Expected a legacy BitBox02 transaction request')

	source.recipient[0] = 0xff
	source.data[0] = 0xff

	assert.equal(request.arguments[2].recipient[0], 1)
	assert.equal(request.arguments[2].data[0], 0xa9)
})

test('refuses malformed account and transaction coordinates before any simulator call', () => {
	// Fault: a malformed path or recipient could target a different account while still producing a signature.
	// Owner: BitBox02 request planner. Observable: construction fails before transport capability is requested.
	assert.throws(
		() => planBitBox02Message({
			chainId: 1n,
			keypath: "m/44'/60'/0'",
			message: Uint8Array.from([1]),
		}),
		/complete BIP-44 account path/
	)
	assert.throws(
		() => planBitBox02LegacyTransaction({
			chainId: 0n,
			keypath: "m/44'/60'/0'/0/0",
			transaction: {
				...transaction,
				gasPrice: Uint8Array.from([1]),
				recipient: Uint8Array.from([1, 2, 3]),
			},
		}),
		/chain ID must be positive/
	)
	assert.throws(
		() => planBitBox02LegacyTransaction({
			chainId: 1n,
			keypath: "m/44'/60'/0'/0/0",
			transaction: {
				...transaction,
				gasPrice: Uint8Array.from([1]),
				recipient: Uint8Array.from([1, 2, 3]),
			},
		}),
		/recipient must be empty or exactly 20 bytes/
	)
})

test('refuses missing firmware simulator assets before capability and settlement evidence', async () => {
	// Fault: missing firmware could fall through to a sibling TCP service and be credited as BitBox capability.
	// Owner: BitBox02 launch boundary. Observable: typed configuration refusal before shared readiness starts.
	const plan = createBitBox02SimulatorPlan({
		...profileInput,
		executable: '/blockhead-absent/bitbox02-simulator',
		fakeMemoryFilePath: '/blockhead-absent/state/bitbox02.bin',
	})

	await assert.rejects(
		startBitBox02Simulator(plan),
		(error: Error) => {
			assert(error instanceof BitBox02SimulatorUnavailableError)
			assert.equal(error.phase, 'configuration')
			assert.equal(error.capabilityEstablished, false)
			assert(error.message.includes('simulator executable is unavailable'))
			return true
		}
	)
	assert.equal(plan.capabilityEstablished, false)
	assert.equal(plan.physicalHardwareEvidence, false)
	assert.equal(plan.nativeSettlementEvidence, false)
})

test('refuses relative persistent-state paths before producing a launch configuration', () => {
	// Fault: a shared working-directory-relative state file could alias across workers or retries.
	// Owner: BitBox02 simulator plan. Observable: synchronous configuration refusal names the state boundary.
	assert.throws(
		() => createBitBox02SimulatorPlan({
			...profileInput,
			fakeMemoryFilePath: 'state/bitbox02.bin',
		}),
		(error: Error) => {
			assert(error instanceof BitBox02SimulatorUnavailableError)
			assert.equal(error.capabilityEstablished, false)
			assert(error.message.includes('fake-memory file must be an absolute path'))
			return true
		}
	)
})

test('cryptographically audits a BitBox02-shaped message fixture without emulator credit', () => {
	// Fault: source-shaped r/s/v bytes could be credited as BitBox02 capability
	// without binding them to the exact requested message and account key.
	// Owner: BitBox02 fixture response audit. Observable: exact EIP-191
	// verification succeeds while emulator, model, hardware, and settlement stay false.
	const privateKey = Uint8Array.from({ length: 32 }, (_, index) => index + 1)
	const message = new TextEncoder().encode('Confirm Blockhead BitBox02 session 2026-09-04T14:00:00Z')
	const prefix = new TextEncoder().encode(`\u0019Ethereum Signed Message:\n${message.byteLength}`)
	const signature = secp256k1.sign(
		Hash.keccak256(Uint8Array.from([...prefix, ...message]), { as: 'Bytes' }),
		privateKey,
		{ format: 'recovered', prehash: false }
	)
	const response = {
		r: signature.slice(1, 33),
		s: signature.slice(33),
		v: Uint8Array.from([signature[0]]),
	}
	const request = planBitBox02Message({
		chainId: 1n,
		keypath: "m/44'/60'/0'/0/0",
		message,
	})

	assert.deepEqual(verifyBitBox02FixtureMessageSignature({
		expectedPublicKey: secp256k1.getPublicKey(privateKey, true),
		request,
		response,
	}), {
		cryptographicSignatureVerified: true,
		emulatorProtocolExecuted: false,
		evidenceClass: 'fixture-signature-verification',
		nativeSettlementEvidence: false,
		physicalHardwareEvidence: false,
		productionModelExecutionEstablished: false,
	})
	assert.throws(() => verifyBitBox02FixtureMessageSignature({
		expectedPublicKey: secp256k1.getPublicKey(privateKey, true),
		request: planBitBox02Message({
			chainId: 1n,
			keypath: "m/44'/60'/0'/0/0",
			message: new TextEncoder().encode('substituted BitBox02 request'),
		}),
		response,
	}), /does not verify/)
	assert.throws(() => verifyBitBox02FixtureMessageSignature({
		expectedPublicKey: secp256k1.getPublicKey(
			Uint8Array.from({ length: 32 }, (_, index) => index + 33),
			true
		),
		request,
		response,
	}), /does not verify/)
})

test('refuses to audit a transaction-family response as a BitBox02 message signature', () => {
	// Fault: detached message bytes let a response from another BitBox02 method
	// inherit message-signing evidence. Owner: BitBox02 fixture response audit.
	// Smallest observable: a closed transaction request is refused before r/s/v
	// shape or cryptographic evidence can be considered.
	const transactionRequest = planBitBox02LegacyTransaction({
		chainId: 1n,
		keypath: "m/44'/60'/0'/0/0",
		transaction: {
			...transaction,
			gasPrice: Uint8Array.from([1]),
		},
	})

	assert.throws(
		() => verifyBitBox02FixtureMessageSignature({
			expectedPublicKey: secp256k1.getPublicKey(
				Uint8Array.from({ length: 32 }, (_, index) => index + 1),
				true
			),
			request: transactionRequest,
			response: {
				r: new Uint8Array(32),
				s: new Uint8Array(32),
				v: new Uint8Array([0]),
			},
		}),
		/requires the exact ethSignMessage request/
	)
})
