import type { WalletMatrixScenario } from '../WalletCompatibilityMatrix.ts'
import {
	WalletHarnessConnectionProtocol,
	WalletHarnessEcosystem,
} from '../ecosystems.ts'


// Headed Connect / sign chrome is mapped through notification.html (see isMetaMaskNotificationPageUrl).
export const metamaskWalletMatrixScenarios = (version: string) => ([
	{
		id: 'metamask-create-new-1',
		wallet: {
			kind: 'metamask',
			version,
		},
		ecosystem: WalletHarnessEcosystem.Evm,
		initializationFlow: 'create-new',
		accountOrdinal: 1,
		connectionProtocol: WalletHarnessConnectionProtocol.Eip6963,
		connectionMethod: 'eth_requestAccounts',
		chain: 'eip155:1',
		requestMethod: 'personal_sign',
		lifecycleEdgeCase: 'reject-retry-approve',
	},
	{
		id: 'metamask-create-new-2',
		wallet: {
			kind: 'metamask',
			version,
		},
		ecosystem: WalletHarnessEcosystem.Evm,
		initializationFlow: 'create-new',
		accountOrdinal: 2,
		connectionProtocol: WalletHarnessConnectionProtocol.Eip6963,
		connectionMethod: 'eth_requestAccounts',
		chain: 'eip155:1',
		requestMethod: 'personal_sign',
		lifecycleEdgeCase: 'account-switch',
	},
	{
		id: 'metamask-import-private-key-3',
		wallet: {
			kind: 'metamask',
			version,
		},
		ecosystem: WalletHarnessEcosystem.Evm,
		initializationFlow: 'import-private-key',
		accountOrdinal: 3,
		connectionProtocol: WalletHarnessConnectionProtocol.Eip6963,
		connectionMethod: 'eth_requestAccounts',
		chain: 'eip155:1',
		requestMethod: 'personal_sign',
		lifecycleEdgeCase: 'disconnect-reload',
	},
] as const satisfies readonly WalletMatrixScenario[])
