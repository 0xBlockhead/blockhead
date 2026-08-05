import type { WalletMatrixScenario } from '../WalletCompatibilityMatrix.ts'
import {
	WalletHarnessConnectionProtocol,
	WalletHarnessEcosystem,
} from '../ecosystems.ts'


// All three cells stay explicitly blocked: Lace 2.2.0 headed expo side-panel
// create-new / second-account / recover automation is not reliably executable.
// Do not invent pass or soft-pass outcomes for these lifecycle edge cases.
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
