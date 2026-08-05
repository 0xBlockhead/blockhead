import assert from 'node:assert/strict'
import test from 'node:test'

import {
	architectureDenominatorScenarios,
	assertArchitectureDenominatorScenarios,
} from './architectures.matrix.ts'
import {
	WalletHarnessCoverageKind,
	WalletHarnessEcosystem,
} from './ecosystems.ts'


test('keeps Lightning, Farcaster, Near, and Sui in the unsupported denominator', () => {
	assertArchitectureDenominatorScenarios()

	const ecosystems = new Set(architectureDenominatorScenarios.map((scenario) => scenario.ecosystem))
	assert.deepEqual([
		...ecosystems,
	].sort(), [
		WalletHarnessEcosystem.Farcaster,
		WalletHarnessEcosystem.Lightning,
		WalletHarnessEcosystem.Near,
		WalletHarnessEcosystem.Sui,
	].sort())

	for (const scenario of architectureDenominatorScenarios) {
		assert.equal(scenario.expectedOutcome, 'unsupported')
		assert.equal(scenario.request.method, scenario.request.method)
		assert.notEqual(scenario.request.ecosystem, WalletHarnessEcosystem.Evm)
	}

	assert.equal(
		architectureDenominatorScenarios.find((scenario) => (
			scenario.ecosystem === WalletHarnessEcosystem.Lightning
		))?.coverageKind,
		WalletHarnessCoverageKind.ArchitectureOnly
	)
	assert.equal(
		architectureDenominatorScenarios.find((scenario) => (
			scenario.ecosystem === WalletHarnessEcosystem.Farcaster
		))?.coverageKind,
		WalletHarnessCoverageKind.IdentityOverlay
	)
})
