import type { WalletTestRequest } from './WalletExtensionHarness.ts'
import type { WalletMatrixOutcome } from './WalletCompatibilityMatrix.ts'
import {
	WalletHarnessCoverageKind,
	WalletHarnessConnectionProtocol,
	WalletHarnessEcosystem,
	walletHarnessEcosystemByEcosystem,
} from './ecosystems.ts'


// Types

/**
 * Architecture-only / identity-overlay denominator.
 *
 * Lightning: no browser extension wallet adapter and no product `src/state`
 * Lightning connection machine — invoice/node surfaces stay schema + Amboss
 * resolvers until a real node connection state exists. Do not invent a soft
 * wallet adapter to fill this gap.
 *
 * Farcaster: identity overlay over EVM `personal_sign` proof — not a
 * `WalletConnectionMethod`, not a `RealWalletKind`, not an injected extension
 * adapter. Proof borrows an existing EVM wallet session; CAIP-10 Account stays
 * orthogonal to `BlockheadWalletConnection` / Farcaster enrollment rows.
 * Do not invent a Farcaster browser wallet adapter to fill this gap.
 */
export type ArchitectureDenominatorScenario = {
	id: string
	ecosystem: (
		| WalletHarnessEcosystem.Lightning
		| WalletHarnessEcosystem.Farcaster
		| WalletHarnessEcosystem.Near
		| WalletHarnessEcosystem.Sui
	)
	coverageKind: (
		| WalletHarnessCoverageKind.ArchitectureOnly
		| WalletHarnessCoverageKind.IdentityOverlay
	)
	connectionProtocol: WalletHarnessConnectionProtocol
	chain: string
	request: Extract<
		WalletTestRequest,
		{
			ecosystem: (
				| WalletHarnessEcosystem.Lightning
				| WalletHarnessEcosystem.Farcaster
				| WalletHarnessEcosystem.Near
				| WalletHarnessEcosystem.Sui
			)
		}
	>
	expectedOutcome: Extract<WalletMatrixOutcome, 'unsupported'>
}


// Constants

export const architectureDenominatorScenarios = [
	{
		id: 'lightning-invoice-architecture-only',
		ecosystem: WalletHarnessEcosystem.Lightning,
		coverageKind: WalletHarnessCoverageKind.ArchitectureOnly,
		connectionProtocol: WalletHarnessConnectionProtocol.LightningNode,
		chain: 'lightning:mainnet',
		request: {
			ecosystem: WalletHarnessEcosystem.Lightning,
			kind: 'invoice',
			method: 'lightning-invoice',
			accountAddress: '03' + 'ab'.repeat(32),
			params: [
				'lnbc1architectureonly',
			],
		},
		expectedOutcome: 'unsupported',
	},
	{
		id: 'farcaster-evm-proof-architecture-only',
		ecosystem: WalletHarnessEcosystem.Farcaster,
		coverageKind: WalletHarnessCoverageKind.IdentityOverlay,
		connectionProtocol: WalletHarnessConnectionProtocol.FarcasterEvmProof,
		chain: 'eip155:1',
		request: {
			ecosystem: WalletHarnessEcosystem.Farcaster,
			kind: 'message',
			method: 'personal_sign',
			accountAddress: '0x1111111111111111111111111111111111111111',
			chainId: 'eip155:1',
			params: [
				'farcaster identity proof',
				'0x1111111111111111111111111111111111111111',
			],
		},
		expectedOutcome: 'unsupported',
	},
	{
		id: 'near-sign-message-architecture-only',
		ecosystem: WalletHarnessEcosystem.Near,
		coverageKind: WalletHarnessCoverageKind.ArchitectureOnly,
		connectionProtocol: WalletHarnessConnectionProtocol.WalletConnectV2,
		chain: 'near:mainnet',
		request: {
			ecosystem: WalletHarnessEcosystem.Near,
			kind: 'message',
			method: 'near:signMessage',
			accountAddress: 'example.near',
			chainId: 'near:mainnet',
			params: [
				'near architecture-only message',
			],
		},
		expectedOutcome: 'unsupported',
	},
	{
		id: 'sui-sign-personal-message-architecture-only',
		ecosystem: WalletHarnessEcosystem.Sui,
		coverageKind: WalletHarnessCoverageKind.ArchitectureOnly,
		connectionProtocol: WalletHarnessConnectionProtocol.WalletConnectV2,
		chain: 'sui:mainnet',
		request: {
			ecosystem: WalletHarnessEcosystem.Sui,
			kind: 'message',
			method: 'sui:signPersonalMessage',
			accountAddress: '0x' + '11'.repeat(32),
			chainId: 'sui:mainnet',
			params: [
				'sui architecture-only message',
			],
		},
		expectedOutcome: 'unsupported',
	},
] as const satisfies readonly ArchitectureDenominatorScenario[]


// Functions

export const assertArchitectureDenominatorScenarios = () => {
	for (const scenario of architectureDenominatorScenarios) {
		const ecosystemRow = walletHarnessEcosystemByEcosystem[scenario.ecosystem]
		if (ecosystemRow.coverageKind !== scenario.coverageKind)
			throw new Error(`${scenario.id}: expected coverageKind ${scenario.coverageKind}, got ${ecosystemRow.coverageKind}`)
		if (
			ecosystemRow.coverageKind !== WalletHarnessCoverageKind.ArchitectureOnly
			&& ecosystemRow.coverageKind !== WalletHarnessCoverageKind.IdentityOverlay
		)
			throw new Error(`${scenario.id}: denominator coverage must be architecture-only or identity-overlay`)
		if (ecosystemRow.extensionKinds.length !== 0)
			throw new Error(`${scenario.id}: architecture denominator must not map to extension wallets`)
		if (!(ecosystemRow.connectionProtocols as readonly WalletHarnessConnectionProtocol[]).includes(scenario.connectionProtocol))
			throw new Error(`${scenario.id}: connectionProtocol must be declared on the ecosystem row`)
		if (scenario.request.ecosystem !== scenario.ecosystem)
			throw new Error(`${scenario.id}: request ecosystem must match scenario ecosystem`)
		if (scenario.expectedOutcome !== 'unsupported')
			throw new Error(`${scenario.id}: architecture denominator scenarios must stay unsupported`)
	}
}
