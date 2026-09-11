import assert from 'node:assert/strict'
import test from 'node:test'

import {
	assertEveryRealWalletKindHasEcosystem,
	WalletHarnessEvidenceKind,
	WalletHarnessCoverageKind,
	WalletHarnessEcosystem,
	walletHarnessEvidenceByExtensionKind,
	walletHarnessEcosystems,
	walletHarnessEcosystemsByExtensionKind,
} from './ecosystems.ts'
import type { RealWalletKind } from './WalletExtensionHarness.ts'

const realWalletKinds = [
	'ambire',
	'argent-x',
	'backpack',
	'keplr',
	'lace',
	'metamask',
	'petra',
	'phantom',
	'polkadot-js',
	'rabby',
	'taho',
	'tonkeeper',
	'unisat',
	'zerion',
] as const satisfies readonly RealWalletKind[]

test('maps every real wallet kind into an ecosystem', () => {
	assertEveryRealWalletKindHasEcosystem(realWalletKinds)
	for (const kind of realWalletKinds)
		assert.ok(walletHarnessEcosystemsByExtensionKind(kind).length)
})

test('requires one strongest evidence classification for every manifest wallet', () => {
	const evidenceKinds = Object.keys(walletHarnessEvidenceByExtensionKind).sort()
	assert.deepEqual(evidenceKinds, [...realWalletKinds].sort())
	assert.equal(walletHarnessEvidenceByExtensionKind.backpack, WalletHarnessEvidenceKind.CryptographicFixture)
	assert.equal(walletHarnessEvidenceByExtensionKind['polkadot-js'], WalletHarnessEvidenceKind.JourneyImplementation)
	assert.equal(walletHarnessEvidenceByExtensionKind.taho, WalletHarnessEvidenceKind.JourneyImplementation)
	assert.equal(walletHarnessEvidenceByExtensionKind.tonkeeper, WalletHarnessEvidenceKind.VerifiedRealHeadedJourney)
	assert.deepEqual(Object.entries(walletHarnessEvidenceByExtensionKind).filter(([, evidence]) => (
		evidence === WalletHarnessEvidenceKind.VerifiedRealHeadedJourney
	)).map(([kind]) => kind), ['tonkeeper'])
	assert.equal(walletHarnessEvidenceByExtensionKind.unisat, WalletHarnessEvidenceKind.CryptographicFixture)
	assert.ok(realWalletKinds.every((kind) => walletHarnessEvidenceByExtensionKind[kind] != null))
})

test('keeps architecture-only and identity-overlay rows out of extension mappings', () => {
	const nonExtensionRows = walletHarnessEcosystems.filter(({ coverageKind }) => (
		coverageKind === WalletHarnessCoverageKind.ArchitectureOnly
		|| coverageKind === WalletHarnessCoverageKind.IdentityOverlay
	))
	assert.deepEqual(
		nonExtensionRows.map(({ ecosystem }) => ecosystem).sort(),
		[
			WalletHarnessEcosystem.Farcaster,
			WalletHarnessEcosystem.Lightning,
			WalletHarnessEcosystem.Near,
			WalletHarnessEcosystem.Sui,
		].sort()
	)
	assert.ok(nonExtensionRows.every(({ extensionKinds }) => extensionKinds.length === 0))
})
