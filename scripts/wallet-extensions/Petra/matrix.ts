import type { WalletMatrixScenario } from '../WalletCompatibilityMatrix.ts'
import {
	WalletHarnessConnectionProtocol,
	WalletHarnessEcosystem,
} from '../ecosystems.ts'


// Account 3 recover stays blocked: no safe fixture material in CI.
// Do not invent a recover or import-private-key pass — keep those cells explicitly blocked.
export const petraWalletMatrixScenarios = (version: string) => ([
	{
		id: 'petra-create-new-1',
		wallet: {
			kind: 'petra',
			version,
		},
		ecosystem: WalletHarnessEcosystem.Aptos,
		initializationFlow: 'create-new',
		accountOrdinal: 1,
		connectionProtocol: WalletHarnessConnectionProtocol.WalletStandard,
		connectionMethod: 'aptos:connect',
		chain: 'aptos:1',
		requestMethod: 'aptos:signMessage',
		lifecycleEdgeCase: 'discover-connect-approve',
	},
	{
		id: 'petra-create-new-2',
		wallet: {
			kind: 'petra',
			version,
		},
		ecosystem: WalletHarnessEcosystem.Aptos,
		initializationFlow: 'create-new',
		accountOrdinal: 2,
		connectionProtocol: WalletHarnessConnectionProtocol.WalletStandard,
		connectionMethod: 'aptos:connect',
		chain: 'aptos:1',
		requestMethod: 'aptos:signMessage',
		lifecycleEdgeCase: 'second-account-connect-or-headed-approve',
	},
	{
		id: 'petra-recover-3',
		wallet: {
			kind: 'petra',
			version,
		},
		ecosystem: WalletHarnessEcosystem.Aptos,
		initializationFlow: 'recover',
		accountOrdinal: 3,
		connectionProtocol: WalletHarnessConnectionProtocol.WalletStandard,
		connectionMethod: 'aptos:connect',
		chain: 'aptos:1',
		requestMethod: 'aptos:signMessage',
		lifecycleEdgeCase: 'fixture-material-not-provided-blocked',
	},
] as const satisfies readonly WalletMatrixScenario[])
