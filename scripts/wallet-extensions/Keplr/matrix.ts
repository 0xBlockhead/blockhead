import type { WalletMatrixScenario } from '../WalletCompatibilityMatrix.ts'
import {
	WalletHarnessConnectionProtocol,
	WalletHarnessEcosystem,
} from '../ecosystems.ts'


// Account 3 recover stays blocked: no safe fixture material in CI.
// Do not invent a recover pass — keep that cell explicitly blocked.
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
		lifecycleEdgeCase: 'fixture-material-not-provided-blocked',
	},
] as const satisfies readonly WalletMatrixScenario[])
