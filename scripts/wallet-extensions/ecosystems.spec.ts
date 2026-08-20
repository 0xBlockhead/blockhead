import assert from 'node:assert/strict'
import test from 'node:test'

import {
	assertEveryRealWalletKindHasEcosystem,
	WalletHarnessCoverageKind,
	WalletHarnessEcosystem,
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
