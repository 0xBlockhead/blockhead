import type { WalletMatrixScenario } from '../WalletCompatibilityMatrix.ts'
import {
	WalletHarnessConnectionProtocol,
	WalletHarnessEcosystem,
} from '../ecosystems.ts'


// Recover needs mnemonic fixture material. This shard proves create-new + view-only.
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
		lifecycleEdgeCase: 'fixture-material-not-provided',
	},
] as const satisfies readonly WalletMatrixScenario[])
