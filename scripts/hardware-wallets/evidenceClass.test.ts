import assert from 'node:assert/strict'
import { test } from 'node:test'
import { executeHardwareWalletHarness, hardwareWalletHarnessDefinitions, HardwareWalletEvidenceUnavailableError } from './evidenceClass.ts'
const brands = Object.keys(hardwareWalletHarnessDefinitions) as Array<keyof typeof hardwareWalletHarnessDefinitions>
test('enrolls source-faithful protocols', () => assert.deepEqual(brands.map((brand) => hardwareWalletHarnessDefinitions[brand].protocol), ['json-rpc', 'websocket', 'iso7816-apdu', 'qr', 'apdu', 'http']))
test('does not invoke transport after readiness failure', async () => {
	const calls: string[] = []
	await assert.rejects(executeHardwareWalletHarness({ brand: 'ledger-speculos', executable: '/installed/speculos', readinessProbe: async () => { calls.push('readiness'); return false }, nativeTransport: async () => { calls.push('transport'); return 'response' }, verifyExactSignature: async () => { calls.push('verify'); return true } }), (error: unknown) => error instanceof HardwareWalletEvidenceUnavailableError)
	assert.deepEqual(calls, ['readiness'])
})
test('does not invoke signature verification after native transport failure', async () => {
	const calls: string[] = []
	await assert.rejects(executeHardwareWalletHarness({ brand: 'keycard', executable: '/installed/keycard-tool', readinessProbe: async () => { calls.push('readiness'); return true }, nativeTransport: async () => { calls.push('transport'); throw new Error('APDU refused') }, verifyExactSignature: async () => { calls.push('verify'); return true } }), /APDU refused/)
	assert.deepEqual(calls, ['readiness', 'transport'])
})
test('wrong signature remains transport-only evidence', async () => {
	const evidence = await executeHardwareWalletHarness({ brand: 'bitbox02', executable: '/installed/bitbox02-simulator', readinessProbe: async () => true, nativeTransport: async () => ({ signature: 'wrong' }), verifyExactSignature: async () => false })
	assert.equal(evidence.phase, 'native-transport'); assert.equal(evidence.emulatorProtocolExecuted, true); assert.equal(evidence.capabilityEstablished, false); assert.equal(evidence.cryptographicSignatureVerified, false)
})
test('exact signature verification is required for capability and never settlement', async () => {
	const evidence = await executeHardwareWalletHarness({ brand: 'trezor-user-env', executable: '/installed/trezor-user-env', readinessProbe: async () => true, nativeTransport: async () => ({ signature: 'exact' }), verifyExactSignature: async (response) => response !== undefined })
	assert.equal(evidence.phase, 'cryptographic-signature'); assert.equal(evidence.capabilityEstablished, true); assert.equal(evidence.cryptographicSignatureVerified, true); assert.equal(evidence.nativeSettlementEvidence, false); assert.equal(evidence.physicalHardwareEvidence, false)
})
test('refuses missing executable before invoking callbacks', async () => {
	const calls: string[] = []
	await assert.rejects(executeHardwareWalletHarness({ brand: 'keystone', executable: ' ', readinessProbe: async () => { calls.push('readiness'); return true }, nativeTransport: async () => { calls.push('transport'); return 'response' }, verifyExactSignature: async () => { calls.push('verify'); return true } }), (error: unknown) => error instanceof HardwareWalletEvidenceUnavailableError)
	assert.deepEqual(calls, [])
})
