import assert from 'node:assert/strict'
import test from 'node:test'

import {
	architectureDenominatorScenarios,
	assertArchitectureDenominatorScenarios,
} from './architectures.matrix.ts'
import {
	WalletHarnessConnectionProtocol,
	WalletHarnessCoverageKind,
	WalletHarnessEcosystem,
	walletHarnessEcosystemByEcosystem,
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

	const lightning = architectureDenominatorScenarios.find((scenario) => (
		scenario.ecosystem === WalletHarnessEcosystem.Lightning
	))
	assert.equal(lightning?.connectionProtocol, WalletHarnessConnectionProtocol.LightningNode)
	assert.equal(lightning?.request.kind, 'invoice')
	assert.equal(
		walletHarnessEcosystemByEcosystem[WalletHarnessEcosystem.Lightning].extensionKinds.length,
		0
	)
})

test('product wallet catalog has no Lightning soft-wallet protocol', async () => {
	const { walletConnectionMethods, walletProtocols } = await import('../../src/constants/Wallet.ts')
	assert.equal(
		walletProtocols.some((row) => (
			row.protocol.includes('lightning')
			|| row.label.toLowerCase().includes('lightning')
		)),
		false
	)
	assert.equal(
		walletConnectionMethods.some((method) => (
			method.id.includes('lightning')
			|| method.label.toLowerCase().includes('lightning')
			|| method.caipNamespaces.includes('lightning')
		)),
		false
	)
})
