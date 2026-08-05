import type { WalletMatrixScenario } from '../WalletCompatibilityMatrix.ts'
import {
	WalletHarnessConnectionProtocol,
	WalletHarnessEcosystem,
} from '../ecosystems.ts'


// Account 2 Add Wallet opens a blank tab on Taho 0.66.0; recover has no safe fixture.
export const tahoWalletMatrixScenarios = (version: string) => ([
	{
		id: 'taho-create-new-1',
		wallet: {
			kind: 'taho',
			version,
		},
		ecosystem: WalletHarnessEcosystem.Evm,
		initializationFlow: 'create-new',
		accountOrdinal: 1,
		connectionProtocol: WalletHarnessConnectionProtocol.Eip6963,
		connectionMethod: 'eth_requestAccounts',
		chain: 'eip155:1',
		requestMethod: 'eth_accounts',
		lifecycleEdgeCase: 'connect-approve',
	},
	{
		id: 'taho-create-new-2',
		wallet: {
			kind: 'taho',
			version,
		},
		ecosystem: WalletHarnessEcosystem.Evm,
		initializationFlow: 'create-new',
		accountOrdinal: 2,
		connectionProtocol: WalletHarnessConnectionProtocol.Eip6963,
		connectionMethod: 'eth_requestAccounts',
		chain: 'eip155:1',
		requestMethod: 'eth_accounts',
		lifecycleEdgeCase: 'blank-add-wallet-tab-blocked',
	},
	{
		id: 'taho-recover-3',
		wallet: {
			kind: 'taho',
			version,
		},
		ecosystem: WalletHarnessEcosystem.Evm,
		initializationFlow: 'recover',
		accountOrdinal: 3,
		connectionProtocol: WalletHarnessConnectionProtocol.Eip6963,
		connectionMethod: 'eth_requestAccounts',
		chain: 'eip155:1',
		requestMethod: 'eth_accounts',
		lifecycleEdgeCase: 'fixture-material-not-provided-blocked',
	},
] as const satisfies readonly WalletMatrixScenario[])
