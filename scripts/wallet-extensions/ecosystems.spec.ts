import assert from 'node:assert/strict'
import test from 'node:test'

import {
	assertEveryRealWalletKindHasEcosystem,
	WalletHarnessConnectionProtocol,
	WalletHarnessCoverageKind,
	WalletHarnessEcosystem,
	walletHarnessEcosystemByEcosystem,
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

test('maps every RealWalletKind into at least one ecosystem', () => {
	assert.doesNotThrow(() => assertEveryRealWalletKindHasEcosystem(realWalletKinds))
	for (const kind of realWalletKinds)
		assert.ok(walletHarnessEcosystemsByExtensionKind(kind).length > 0)
})

test('keeps Lightning and Farcaster in the denominator as non-extension architectures', () => {
	assert.equal(
		walletHarnessEcosystemByEcosystem[WalletHarnessEcosystem.Lightning].coverageKind,
		WalletHarnessCoverageKind.ArchitectureOnly
	)
	assert.equal(
		walletHarnessEcosystemByEcosystem[WalletHarnessEcosystem.Farcaster].coverageKind,
		WalletHarnessCoverageKind.IdentityOverlay
	)
	assert.deepEqual(
		walletHarnessEcosystemByEcosystem[WalletHarnessEcosystem.Lightning].extensionKinds,
		[]
	)
	assert.deepEqual(
		walletHarnessEcosystemByEcosystem[WalletHarnessEcosystem.Farcaster].extensionKinds,
		[]
	)
})

test('keeps Farcaster as the sole IdentityOverlay — never a RealWalletKind extension adapter', () => {
	const identityOverlayRows = walletHarnessEcosystems.filter((row) => (
		row.coverageKind === WalletHarnessCoverageKind.IdentityOverlay
	))
	assert.deepEqual(
		identityOverlayRows.map((row) => row.ecosystem),
		[WalletHarnessEcosystem.Farcaster]
	)

	const farcaster = walletHarnessEcosystemByEcosystem[WalletHarnessEcosystem.Farcaster]
	assert.deepEqual(farcaster.connectionProtocols, [
		WalletHarnessConnectionProtocol.FarcasterEvmProof,
	])
	assert.deepEqual(farcaster.caipNamespaces, ['eip155'])
	assert.deepEqual(farcaster.extensionKinds, [])

	for (const kind of realWalletKinds) {
		assert.equal(
			walletHarnessEcosystemsByExtensionKind(kind).some((row) => (
				row.ecosystem === WalletHarnessEcosystem.Farcaster
			)),
			false,
			`${kind} must not map into Farcaster`
		)
	}

	for (const row of walletHarnessEcosystems) {
		if (row.ecosystem === WalletHarnessEcosystem.Farcaster)
			continue
		assert.equal(
			(row.connectionProtocols as readonly string[]).includes(
				WalletHarnessConnectionProtocol.FarcasterEvmProof
			),
			false,
			`${row.ecosystem} must not claim FarcasterEvmProof`
		)
		assert.notEqual(
			row.coverageKind,
			WalletHarnessCoverageKind.IdentityOverlay,
			`${row.ecosystem} must not reuse IdentityOverlay`
		)
	}
})

test('enumerates irreducible ecosystems without free-string gaps', () => {
	const ecosystems = new Set(walletHarnessEcosystems.map((row) => row.ecosystem))
	for (const ecosystem of Object.values(WalletHarnessEcosystem))
		assert.ok(ecosystems.has(ecosystem), ecosystem)
})
