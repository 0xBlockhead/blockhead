import assert from 'node:assert/strict'
import { test } from 'node:test'

import { diagnoseHardwareHarnessPhases } from './harnessPhaseDiagnostic.ts'

test('identifies the first unfinished harness phase without granting capability', () => {
	// Fault: a protocol or cryptographic fixture result can skip an unavailable
	// artifact/process/transport and inflate the hardware acceptance denominator.
	// Owner: hardware harness phase diagnostic. Smallest observable: out-of-order
	// evidence is refused, while a partial real trace names only its next boundary.
	assert.throws(() => diagnoseHardwareHarnessPhases({
		'cryptographic-verification': {
			detail: 'A local fixture signature verified.',
			outcome: 'passed',
		},
	}), /precedes its required phase/)

	const diagnostic = diagnoseHardwareHarnessPhases({
		artifact: {
			detail: 'Pinned emulator artifact exists at the configured path.',
			outcome: 'passed',
		},
		process: {
			detail: 'Owned process reached its exact readiness marker.',
			outcome: 'passed',
		},
	})

	assert.equal(diagnostic.nextPhase, 'transport')
	assert.deepEqual(diagnostic.phases.map(({ phase, state }) => ({ phase, state })), [
		{ phase: 'artifact', state: 'passed' },
		{ phase: 'process', state: 'passed' },
		{ phase: 'transport', state: 'pending' },
		{ phase: 'protocol', state: 'blocked' },
		{ phase: 'cryptographic-verification', state: 'blocked' },
	])
	assert.deepEqual({
		capabilityEstablished: diagnostic.capabilityEstablished,
		cryptographicSignatureVerified: diagnostic.cryptographicSignatureVerified,
		emulatorProtocolExecuted: diagnostic.emulatorProtocolExecuted,
		nativeSettlementEvidence: diagnostic.nativeSettlementEvidence,
		physicalHardwareEvidence: diagnostic.physicalHardwareEvidence,
		productionModelExecutionEstablished: diagnostic.productionModelExecutionEstablished,
		walletCapabilityEstablished: diagnostic.walletCapabilityEstablished,
	}, {
		capabilityEstablished: false,
		cryptographicSignatureVerified: false,
		emulatorProtocolExecuted: false,
		nativeSettlementEvidence: false,
		physicalHardwareEvidence: false,
		productionModelExecutionEstablished: false,
		walletCapabilityEstablished: false,
	})
})
