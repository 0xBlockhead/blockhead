import type { WalletMatrixScenario } from '../WalletCompatibilityMatrix.ts'
import {
	WalletHarnessConnectionProtocol,
	WalletHarnessEcosystem,
} from '../ecosystems.ts'


export const ambireWalletMatrixScenarios = (version: string) => ([
	{
		id: 'ambire-watch-only-1',
		wallet: {
			kind: 'ambire',
			version,
		},
		ecosystem: WalletHarnessEcosystem.Evm,
		initializationFlow: 'watch-only',
		accountOrdinal: 1,
		connectionProtocol: WalletHarnessConnectionProtocol.Eip6963,
		connectionMethod: 'eth_requestAccounts',
		chain: 'eip155:1',
		requestMethod: 'wallet_revokePermissions',
		lifecycleEdgeCase: 'discover-reject-retry-approve-revoke-disconnect',
	},
	{
		id: 'ambire-watch-only-2',
		wallet: {
			kind: 'ambire',
			version,
		},
		ecosystem: WalletHarnessEcosystem.Evm,
		initializationFlow: 'watch-only',
		accountOrdinal: 2,
		connectionProtocol: WalletHarnessConnectionProtocol.Eip6963,
		connectionMethod: 'eth_requestAccounts',
		chain: 'eip155:1',
		requestMethod: 'eth_accounts',
		lifecycleEdgeCase: 'switch-accountsChanged-profile-teardown',
	},
	// Recover derivation for a third Ambire signer is blocked in automation (internal HD derivation UI).
	{
		id: 'ambire-recover-signer-3',
		wallet: {
			kind: 'ambire',
			version,
		},
		ecosystem: WalletHarnessEcosystem.Evm,
		initializationFlow: 'recover',
		accountOrdinal: 3,
		connectionProtocol: WalletHarnessConnectionProtocol.Eip6963,
		connectionMethod: 'eth_requestAccounts',
		chain: 'eip155:1',
		requestMethod: 'personal_sign',
		lifecycleEdgeCase: 'internal-account-derivation-blocked',
	},
] as const satisfies readonly WalletMatrixScenario[])
