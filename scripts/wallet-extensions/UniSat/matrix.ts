import type { WalletMatrixScenario } from '../WalletCompatibilityMatrix.ts'
import {
	WalletHarnessConnectionProtocol,
	WalletHarnessEcosystem,
} from '../ecosystems.ts'


// Recover needs mnemonic fixture material; this shard proves create-new + derived account switch.
export const unisatWalletMatrixScenarios = (version: string) => ([
	{
		id: 'unisat-create-new-1',
		wallet: {
			kind: 'unisat',
			version,
		},
		ecosystem: WalletHarnessEcosystem.Bitcoin,
		initializationFlow: 'create-new',
		accountOrdinal: 1,
		connectionProtocol: WalletHarnessConnectionProtocol.BitcoinInjected,
		connectionMethod: 'requestAccounts',
		chain: 'bip122:000000000019d6689c085ae165831e93',
		requestMethod: 'requestAccounts',
		lifecycleEdgeCase: 'reject-retry-approve',
	},
	{
		id: 'unisat-create-new-2',
		wallet: {
			kind: 'unisat',
			version,
		},
		ecosystem: WalletHarnessEcosystem.Bitcoin,
		initializationFlow: 'create-new',
		accountOrdinal: 2,
		connectionProtocol: WalletHarnessConnectionProtocol.BitcoinInjected,
		connectionMethod: 'requestAccounts',
		chain: 'bip122:000000000019d6689c085ae165831e93',
		requestMethod: 'getAccounts',
		lifecycleEdgeCase: 'account-switch-disconnect',
	},
	{
		id: 'unisat-recover-3',
		wallet: {
			kind: 'unisat',
			version,
		},
		ecosystem: WalletHarnessEcosystem.Bitcoin,
		initializationFlow: 'recover',
		accountOrdinal: 3,
		connectionProtocol: WalletHarnessConnectionProtocol.BitcoinInjected,
		connectionMethod: 'requestAccounts',
		chain: 'bip122:000000000019d6689c085ae165831e93',
		requestMethod: 'getAccounts',
		lifecycleEdgeCase: 'fixture-material-not-provided',
	},
] as const satisfies readonly WalletMatrixScenario[])
