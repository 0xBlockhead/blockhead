// Generated from APP.ts.

import bindings from '$/sources/PolkadotInjectedWeb3/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.PolkadotInjectedWeb3,
	label: 'Polkadot injected web3',
	sources: {
		[Source.PolkadotInjectedWeb3_WalletApi]: {
			label: 'Polkadot injected web3 wallet API',
		},
	},
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
