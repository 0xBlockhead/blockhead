import type { WalletMatrixScenario } from '../WalletCompatibilityMatrix.ts'
import {
	WalletHarnessConnectionProtocol,
	WalletHarnessEcosystem,
} from '../ecosystems.ts'

/** Phantom's Wallet Standard surface is represented by three explicit cells.
 * The recovery cell remains unavailable until a source-faithful fixture exists. */
export const phantomWalletMatrixScenarios = (version: string) => ([
	{
		id: 'phantom-create-new-1',
		wallet: { kind: 'phantom', version },
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
		id: 'phantom-create-new-2',
		wallet: { kind: 'phantom', version },
		ecosystem: WalletHarnessEcosystem.Solana,
		initializationFlow: 'create-new',
		accountOrdinal: 2,
		connectionProtocol: WalletHarnessConnectionProtocol.WalletStandard,
		connectionMethod: 'standard:connect',
		chain: 'solana:mainnet',
		requestMethod: 'standard:events',
		lifecycleEdgeCase: 'account-switch',
	},
	{
		id: 'phantom-recover-3',
		wallet: { kind: 'phantom', version },
		ecosystem: WalletHarnessEcosystem.Solana,
		initializationFlow: 'recover',
		accountOrdinal: 3,
		connectionProtocol: WalletHarnessConnectionProtocol.WalletStandard,
		connectionMethod: 'standard:connect',
		chain: 'solana:mainnet',
		requestMethod: 'solana:signMessage',
		lifecycleEdgeCase: 'fixture-material-not-provided-unavailable',
	},
] as const satisfies readonly WalletMatrixScenario[])
