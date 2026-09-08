import assert from 'node:assert/strict'
import { test } from 'node:test'
import { secp256k1 } from '@noble/curves/secp256k1.js'
import * as Hex from 'ox/Hex'
import * as TxEnvelopeEip1559 from 'ox/TxEnvelopeEip1559'

import {
	createTrezorUserEnvPlan,
	startTrezorUserEnv,
	TrezorUserEnvUnavailableError,
	verifyTrezorFixtureTransactionSignature,
} from './trezorUserEnv.ts'


// Constants

const profile = {
	controllerPort: 46_100,
	dashboardPort: 46_101,
	dockerExecutable: '/opt/homebrew/bin/docker',
	identity: 'worker-1-repeat-0-trezor-user-env',
	image: `ghcr.io/trezor/trezor-user-env@sha256:${'a'.repeat(64)}`,
	vncPort: 46_102,
	workingDirectory: '/opt/trezor-user-env',
}

const transaction = {
	chainId: 1,
	data: '0xa9059cbb000000000000000000000000111111111111111111111111111111111111111100000000000000000000000000000000000000000000000000000000000f4240' as const,
	gasLimit: '0x15f90' as const,
	maxFeePerGas: '0x6fc23ac00' as const,
	maxPriorityFeePerGas: '0x59682f00' as const,
	nonce: '0x7' as const,
	to: '0x2222222222222222222222222222222222222222' as const,
	value: '0x0' as const,
}


// Tests

test('plans a pinned isolated Trezor User Env without claiming capability or physical evidence', () => {
	// Fault: a Docker configuration could be advertised as a working or physical Trezor.
	// Owner: Trezor User Env plan. Observable: configuration-only flags and loopback-only surfaces.
	const plan = createTrezorUserEnvPlan({
		controllerRequestId: 17,
		model: 'T3T1',
		profile,
		transaction,
	})

	assert.equal(plan.evidenceClass, 'configuration-only')
	assert.equal(plan.capabilityEstablished, false)
	assert.equal(plan.emulatorProtocolExecuted, false)
	assert.equal(plan.responseAuditAvailable, false)
	assert.equal(plan.cryptographicSignatureVerified, false)
	assert.equal(plan.productionModelExecutionEstablished, false)
	assert.equal(plan.physicalHardwareEvidence, false)
	assert.equal(plan.nativeSettlementEvidence, false)
	assert.equal(plan.controllerEndpoint.href, 'ws://127.0.0.1:46100/')
	assert.deepEqual(plan.profile.command.args, [
		'run',
		'--rm',
		'--name',
		'blockhead-worker-1-repeat-0-trezor-user-env',
		'--publish',
		'127.0.0.1:46100:9001',
		'--publish',
		'127.0.0.1:46101:9002',
		'--publish',
		'127.0.0.1:46102:15900',
		profile.image,
	])
})

test('constructs official controller and EIP-1559 signing requests with approval still external', () => {
	// Fault: the harness could send stale controller keys or omit consent-relevant EIP-1559 fields.
	// Owner: Trezor controller and Connect request construction. Observable: closed source-shaped requests.
	const plan = createTrezorUserEnvPlan({
		controllerRequestId: 17,
		model: 'T3T1',
		profile,
		transaction,
	})

	assert.deepEqual(plan.controllerRequest, {
		id: 17,
		model: 'T3T1',
		output_to_logfile: true,
		save_screenshots: false,
		type: 'emulator-start',
		version: '-latest',
		wipe: true,
	})
	assert.deepEqual(plan.signingRequest, {
		method: 'ethereumSignTransaction',
		params: {
			path: "m/44'/60'/0'/0/0",
			transaction,
		},
	})
	assert.equal('signature' in plan, false)
})

test('does not promote controller or request construction into a returned Trezor response', () => {
	// Fault: selecting an emulator model and constructing a Connect-shaped request is counted as executed or cryptographically verified model evidence.
	// Owner: Trezor User Env evidence boundary. Observable: response audit and every later execution/evidence tier remain explicitly false.
	const plan = createTrezorUserEnvPlan({
		controllerRequestId: 18,
		model: 'T3T1',
		profile,
		transaction,
	})

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

test('refuses noncanonical transaction fields before any authority request', () => {
	// Fault: malformed fee or calldata encodings could reach a device as a different consent envelope.
	// Owner: Trezor signing-request planner. Observable: synchronous refusal before capability or dispatch.
	assert.throws(
		() => createTrezorUserEnvPlan({
			controllerRequestId: 17,
			model: 'T3T1',
			profile,
			transaction: { ...transaction, maxFeePerGas: '0x00' },
		}),
		/canonical hexadecimal quantity/
	)
	assert.throws(
		() => createTrezorUserEnvPlan({
			controllerRequestId: 17,
			model: 'T3T1',
			profile,
			transaction: { ...transaction, data: '0xabc' },
		}),
		/byte-aligned hexadecimal data/
	)
})

test('refuses an impossible EIP-1559 fee relation before Trezor execution', () => {
	// Fault: a source-shaped transaction can offer a priority fee above its total
	// maximum fee and defer a deterministic host error to the emulator. Owner:
	// Trezor signing-request planner. Smallest observable: synchronous refusal
	// occurs before controller, signing, emulator, or settlement evidence exists.
	assert.throws(
		() => createTrezorUserEnvPlan({
			controllerRequestId: 17,
			model: 'T3T1',
			profile,
			transaction: {
				...transaction,
				maxFeePerGas: '0x1',
				maxPriorityFeePerGas: '0x2',
			},
		}),
		/maximum priority fee must not exceed its maximum fee/
	)
})

test('refuses an unavailable emulator launcher before process ownership begins', async () => {
	// Fault: a missing runtime could silently become a readiness timeout or install fallback.
	// Owner: Trezor launch boundary. Observable: configuration-phase refusal with no capability.
	const plan = createTrezorUserEnvPlan({
		controllerRequestId: 17,
		model: 'T3T1',
		profile: {
			...profile,
			dockerExecutable: '/blockhead-absent/docker',
		},
		transaction,
	})

	await assert.rejects(
		startTrezorUserEnv(plan),
		(error: Error) => {
			assert(error instanceof TrezorUserEnvUnavailableError)
			assert.equal(error.phase, 'configuration')
			assert.equal(error.capabilityEstablished, false)
			assert.match(error.message, /Docker executable is unavailable/)
			return true
		}
	)
	assert.equal(plan.capabilityEstablished, false)
})

test('cryptographically audits a Trezor-shaped transaction fixture without emulator credit', () => {
	// Fault: a successful Connect-shaped response could be counted as Trezor
	// execution without binding r/s/v to the exact EIP-1559 request and key.
	// Owner: Trezor fixture response audit. Observable: the exact signature
	// verifies while every emulator, model, hardware, and settlement tier is false.
	const plan = createTrezorUserEnvPlan({
		controllerRequestId: 19,
		model: 'T3T1',
		profile,
		transaction,
	})
	const privateKey = Uint8Array.from({ length: 32 }, (_, index) => index + 1)
	const envelope = TxEnvelopeEip1559.from({
		chainId: transaction.chainId,
		data: transaction.data,
		gas: BigInt(transaction.gasLimit),
		maxFeePerGas: BigInt(transaction.maxFeePerGas),
		maxPriorityFeePerGas: BigInt(transaction.maxPriorityFeePerGas),
		nonce: BigInt(transaction.nonce),
		to: transaction.to,
		value: BigInt(transaction.value),
	})
	const signature = secp256k1.sign(
		Hex.toBytes(TxEnvelopeEip1559.getSignPayload(envelope)),
		privateKey,
		{ format: 'recovered', prehash: false }
	)
	const response = {
		success: true,
		payload: {
			v: `0x${signature[0].toString(16)}`,
			r: Hex.fromBytes(signature.slice(1, 33)),
			s: Hex.fromBytes(signature.slice(33)),
		},
	} as const

	assert.deepEqual(verifyTrezorFixtureTransactionSignature({
		expectedPublicKey: secp256k1.getPublicKey(privateKey, true),
		request: plan.signingRequest,
		response,
	}), {
		cryptographicSignatureVerified: true,
		emulatorProtocolExecuted: false,
		evidenceClass: 'fixture-signature-verification',
		nativeSettlementEvidence: false,
		physicalHardwareEvidence: false,
		productionModelExecutionEstablished: false,
		walletCapabilityEstablished: false,
	})

	assert.throws(() => verifyTrezorFixtureTransactionSignature({
		expectedPublicKey: secp256k1.getPublicKey(privateKey, true),
		request: {
			...plan.signingRequest,
			params: {
				...plan.signingRequest.params,
				transaction: { ...transaction, nonce: '0x8' },
			},
		},
		response,
	}), /does not verify/)
	assert.throws(() => verifyTrezorFixtureTransactionSignature({
		expectedPublicKey: secp256k1.getPublicKey(
			Uint8Array.from({ length: 32 }, (_, index) => index + 33),
			true
		),
		request: plan.signingRequest,
		response,
	}), /does not verify/)
})
