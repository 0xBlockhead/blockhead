import type { WalletMatrixScenario } from '../WalletCompatibilityMatrix.ts'
import {
	WalletHarnessConnectionProtocol,
	WalletHarnessEcosystem,
} from '../ecosystems.ts'


// Headed Connect chrome is mapped through index.html (see isArgentXIndexPageUrl).
// Recover has no safe restore fixture; source-available build carries Argent non-commercial license.
// Keep that cell explicitly blocked — do not invent a recover pass.
export const argentXWalletMatrixScenarios = (version: string) => ([
	{
		id: 'argent-x-create-new-1',
		wallet: {
			kind: 'argent-x',
			version,
		},
		ecosystem: WalletHarnessEcosystem.Starknet,
		initializationFlow: 'create-new',
		accountOrdinal: 1,
		connectionProtocol: WalletHarnessConnectionProtocol.StarknetWalletApi,
		connectionMethod: 'wallet_requestAccounts',
		chain: 'starknet:SN_MAIN',
		requestMethod: 'wallet_requestChainId',
		lifecycleEdgeCase: 'reject-retry-approve',
	},
	{
		id: 'argent-x-create-new-2',
		wallet: {
			kind: 'argent-x',
			version,
		},
		ecosystem: WalletHarnessEcosystem.Starknet,
		initializationFlow: 'create-new',
		accountOrdinal: 2,
		connectionProtocol: WalletHarnessConnectionProtocol.StarknetWalletApi,
		connectionMethod: 'wallet_requestAccounts',
		chain: 'starknet:SN_MAIN',
		requestMethod: 'wallet_requestChainId',
		lifecycleEdgeCase: 'account-switch-disconnect-reload',
	},
	{
		id: 'argent-x-recover-3',
		wallet: {
			kind: 'argent-x',
			version,
		},
		ecosystem: WalletHarnessEcosystem.Starknet,
		initializationFlow: 'recover',
		accountOrdinal: 3,
		connectionProtocol: WalletHarnessConnectionProtocol.StarknetWalletApi,
		connectionMethod: 'wallet_requestAccounts',
		chain: 'starknet:SN_MAIN',
		requestMethod: 'wallet_requestChainId',
		lifecycleEdgeCase: 'fixture-material-not-provided-blocked',
	},
] as const satisfies readonly WalletMatrixScenario[])
