import type { WalletMatrixScenario } from '../WalletCompatibilityMatrix.ts'
import {
	WalletHarnessConnectionProtocol,
	WalletHarnessEcosystem,
} from '../ecosystems.ts'


// Headed Connect / authorize chrome is mapped through notification.html (see isPolkadotJsNotificationPageUrl).
// Account 3 recover is blocked: third initialization flow is not independently available in the shard.
export const polkadotJsWalletMatrixScenarios = (version: string) => ([
	{
		id: 'polkadot-js-create-new-1',
		wallet: {
			kind: 'polkadot-js',
			version,
		},
		ecosystem: WalletHarnessEcosystem.Polkadot,
		initializationFlow: 'create-new',
		accountOrdinal: 1,
		connectionProtocol: WalletHarnessConnectionProtocol.PolkadotInjectedWeb3,
		connectionMethod: 'enable',
		chain: 'polkadot:91b171bb158e2d3848fa23a9f1c25182',
		requestMethod: 'accounts.get',
		lifecycleEdgeCase: 'authorize-enumerate-candidate-connect-product-gap',
	},
	{
		id: 'polkadot-js-create-new-2',
		wallet: {
			kind: 'polkadot-js',
			version,
		},
		ecosystem: WalletHarnessEcosystem.Polkadot,
		initializationFlow: 'create-new',
		accountOrdinal: 2,
		connectionProtocol: WalletHarnessConnectionProtocol.PolkadotInjectedWeb3,
		connectionMethod: 'enable',
		chain: 'polkadot:91b171bb158e2d3848fa23a9f1c25182',
		requestMethod: 'accounts.get',
		lifecycleEdgeCase: 'account-switch-disconnect-reload-product-gap',
	},
	{
		id: 'polkadot-js-recover-3',
		wallet: {
			kind: 'polkadot-js',
			version,
		},
		ecosystem: WalletHarnessEcosystem.Polkadot,
		initializationFlow: 'recover',
		accountOrdinal: 3,
		connectionProtocol: WalletHarnessConnectionProtocol.PolkadotInjectedWeb3,
		connectionMethod: 'enable',
		chain: 'polkadot:91b171bb158e2d3848fa23a9f1c25182',
		requestMethod: 'accounts.get',
		lifecycleEdgeCase: 'rejection-retry-third-flow-unavailable',
	},
] as const satisfies readonly WalletMatrixScenario[])
