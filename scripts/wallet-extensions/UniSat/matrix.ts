import type { WalletMatrixScenario } from '../WalletCompatibilityMatrix.ts'
import {
	WalletHarnessConnectionProtocol,
	WalletHarnessEcosystem,
} from '../ecosystems.ts'


// Account 3 recover stays blocked: no safe fixture material in CI.
// Do not invent a recover pass — keep that cell explicitly blocked.
// This shard proves create-new + derived account switch.
// Ordinals purpose is a separate unsupported cell: UniSat injected getAccounts/requestAccounts
// return unlabeled address strings and must not fake a Sats Connect payment/ordinals role split.
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
		lifecycleEdgeCase: 'fixture-material-not-provided-blocked',
	},
] as const satisfies readonly WalletMatrixScenario[])

export const unisatOrdinalsPurposeUnsupportedScenario = (version: string) => (
	{
		id: 'unisat-ordinals-purpose-unsupported',
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
		requestMethod: 'getAccounts',
		lifecycleEdgeCase: 'ordinals-purpose-not-exposed-by-injected-api',
	} as const satisfies WalletMatrixScenario
)
