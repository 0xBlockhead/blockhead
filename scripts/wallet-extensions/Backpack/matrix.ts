import type { WalletMatrixScenario } from '../WalletCompatibilityMatrix.ts'
import {
	WalletHarnessConnectionProtocol,
	WalletHarnessEcosystem,
} from '../ecosystems.ts'


// Recover remains blocked because this shard accepts no mnemonic fixture material.
// Keep the cell blocked until a safe fixture-backed recovery contract is wired.
// This shard proves create-new + view-only.
// Headed Connect chrome is mapped through popup.html (see isBackpackPopupPageUrl).
export const backpackWalletMatrixScenarios = (version: string) => ([
	{
		id: 'backpack-create-new-1',
		wallet: {
			kind: 'backpack',
			version,
		},
		ecosystem: WalletHarnessEcosystem.Solana,
		initializationFlow: 'create-new',
		accountOrdinal: 1,
		connectionProtocol: WalletHarnessConnectionProtocol.WalletStandard,
		connectionMethod: 'standard:connect',
		chain: 'solana:mainnet',
		requestMethod: 'solana:signMessage',
		lifecycleEdgeCase: 'reject-retry-approve',
	},
	{
		id: 'backpack-watch-only-2',
		wallet: {
			kind: 'backpack',
			version,
		},
		ecosystem: WalletHarnessEcosystem.Solana,
		initializationFlow: 'watch-only',
		accountOrdinal: 2,
		connectionProtocol: WalletHarnessConnectionProtocol.WalletStandard,
		connectionMethod: 'standard:connect',
		chain: 'solana:mainnet',
		requestMethod: 'standard:events',
		lifecycleEdgeCase: 'account-switch',
	},
	{
		id: 'backpack-recover-3',
		wallet: {
			kind: 'backpack',
			version,
		},
		ecosystem: WalletHarnessEcosystem.Solana,
		initializationFlow: 'recover',
		accountOrdinal: 3,
		connectionProtocol: WalletHarnessConnectionProtocol.WalletStandard,
		connectionMethod: 'standard:connect',
		chain: 'solana:mainnet',
		requestMethod: 'solana:signTransaction',
		lifecycleEdgeCase: 'fixture-material-not-provided-blocked',
	},
] as const satisfies readonly WalletMatrixScenario[])
