import type { WalletMatrixScenario } from '../WalletCompatibilityMatrix.ts'
import {
	WalletHarnessConnectionProtocol,
	WalletHarnessEcosystem,
} from '../ecosystems.ts'


// Headed TonConnect chrome is mapped through index.html (see isTonkeeperIndexPageUrl).
// Account 3 recover stays blocked: this shard accepts no safe fixture material.
// Do not invent a recover pass — keep that cell explicitly blocked until a
// fixture-backed recovery contract is wired.
// Second create-new may be unavailable depending on extension UI.
export const tonkeeperWalletMatrixScenarios = (version: string) => ([
	{
		id: 'tonkeeper-create-new-1',
		wallet: {
			kind: 'tonkeeper',
			version,
		},
		ecosystem: WalletHarnessEcosystem.Ton,
		initializationFlow: 'create-new',
		accountOrdinal: 1,
		connectionProtocol: WalletHarnessConnectionProtocol.TonConnect,
		connectionMethod: 'connect',
		chain: 'ton:-239',
		requestMethod: 'send',
		lifecycleEdgeCase: 'discover-connect-disconnect',
	},
	{
		id: 'tonkeeper-create-new-2',
		wallet: {
			kind: 'tonkeeper',
			version,
		},
		ecosystem: WalletHarnessEcosystem.Ton,
		initializationFlow: 'create-new',
		accountOrdinal: 2,
		connectionProtocol: WalletHarnessConnectionProtocol.TonConnect,
		connectionMethod: 'connect',
		chain: 'ton:-239',
		requestMethod: 'restoreConnection',
		lifecycleEdgeCase: 'second-account-onboard',
	},
	{
		id: 'tonkeeper-recover-3',
		wallet: {
			kind: 'tonkeeper',
			version,
		},
		ecosystem: WalletHarnessEcosystem.Ton,
		initializationFlow: 'recover',
		accountOrdinal: 3,
		connectionProtocol: WalletHarnessConnectionProtocol.TonConnect,
		connectionMethod: 'connect',
		chain: 'ton:-239',
		requestMethod: 'listen',
		lifecycleEdgeCase: 'fixture-material-not-provided-blocked',
	},
] as const satisfies readonly WalletMatrixScenario[])
