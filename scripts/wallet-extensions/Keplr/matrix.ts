import type { WalletMatrixScenario } from '../WalletCompatibilityMatrix.ts'
import {
	WalletHarnessConnectionProtocol,
	WalletHarnessEcosystem,
} from '../ecosystems.ts'


// Recover needs mnemonic fixture material; this shard proves create-new accounts only.
export const keplrWalletMatrixScenarios = (version: string) => ([
	{
		id: 'keplr-create-new-1',
		wallet: {
			kind: 'keplr',
			version,
		},
		ecosystem: WalletHarnessEcosystem.Cosmos,
		initializationFlow: 'create-new',
		accountOrdinal: 1,
		connectionProtocol: WalletHarnessConnectionProtocol.CosmosOfflineSigner,
		connectionMethod: 'enable',
		chain: 'cosmos:cosmoshub-4',
		requestMethod: 'getOfflineSignerAuto',
		lifecycleEdgeCase: 'connect-approve',
	},
	{
		id: 'keplr-create-new-2',
		wallet: {
			kind: 'keplr',
			version,
		},
		ecosystem: WalletHarnessEcosystem.Cosmos,
		initializationFlow: 'create-new',
		accountOrdinal: 2,
		connectionProtocol: WalletHarnessConnectionProtocol.CosmosOfflineSigner,
		connectionMethod: 'enable',
		chain: 'cosmos:cosmoshub-4',
		requestMethod: 'getOfflineSignerAuto',
		lifecycleEdgeCase: 'account-switch-disconnect-reload',
	},
	{
		id: 'keplr-recover-3',
		wallet: {
			kind: 'keplr',
			version,
		},
		ecosystem: WalletHarnessEcosystem.Cosmos,
		initializationFlow: 'recover',
		accountOrdinal: 3,
		connectionProtocol: WalletHarnessConnectionProtocol.CosmosOfflineSigner,
		connectionMethod: 'enable',
		chain: 'cosmos:cosmoshub-4',
		requestMethod: 'getOfflineSignerAuto',
		lifecycleEdgeCase: 'fixture-material-not-provided',
	},
] as const satisfies readonly WalletMatrixScenario[])
