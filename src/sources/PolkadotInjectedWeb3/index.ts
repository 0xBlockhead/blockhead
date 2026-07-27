// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/PolkadotInjectedWeb3/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.PolkadotInjectedWeb3,
	label: 'Polkadot injected web3',
	sources: [
		{
			source: Source.PolkadotInjectedWeb3_WalletApi,
			label: 'Polkadot injected web3 wallet API',
		},
	],
	bindings: [bindings[Source.PolkadotInjectedWeb3_WalletApi]],
} satisfies SourceProviderDefinition
