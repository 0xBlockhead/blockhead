import type { WalletMatrixScenario } from '../WalletCompatibilityMatrix.ts'
import {
	WalletHarnessConnectionProtocol,
	WalletHarnessEcosystem,
} from '../ecosystems.ts'


// Side-panel onboarding/account automation for Lace 2.2.0 is not yet reliably executable (headed expo UI).
export const laceWalletMatrixScenarios = (version: string) => ([
	{
		id: 'lace-create-new-1',
		wallet: {
			kind: 'lace',
			version,
		},
		ecosystem: WalletHarnessEcosystem.Cardano,
		initializationFlow: 'create-new',
		accountOrdinal: 1,
		connectionProtocol: WalletHarnessConnectionProtocol.CardanoCip30,
		connectionMethod: 'enable',
		chain: 'cip34:1-764824073',
		requestMethod: 'getUsedAddresses',
		lifecycleEdgeCase: 'side-panel-onboarding-blocked',
	},
	{
		id: 'lace-create-new-2',
		wallet: {
			kind: 'lace',
			version,
		},
		ecosystem: WalletHarnessEcosystem.Cardano,
		initializationFlow: 'create-new',
		accountOrdinal: 2,
		connectionProtocol: WalletHarnessConnectionProtocol.CardanoCip30,
		connectionMethod: 'enable',
		chain: 'cip34:1-764824073',
		requestMethod: 'getUsedAddresses',
		lifecycleEdgeCase: 'side-panel-second-account-blocked',
	},
	{
		id: 'lace-recover-3',
		wallet: {
			kind: 'lace',
			version,
		},
		ecosystem: WalletHarnessEcosystem.Cardano,
		initializationFlow: 'recover',
		accountOrdinal: 3,
		connectionProtocol: WalletHarnessConnectionProtocol.CardanoCip30,
		connectionMethod: 'enable',
		chain: 'cip34:1-764824073',
		requestMethod: 'getUsedAddresses',
		lifecycleEdgeCase: 'side-panel-recover-blocked',
	},
] as const satisfies readonly WalletMatrixScenario[])
