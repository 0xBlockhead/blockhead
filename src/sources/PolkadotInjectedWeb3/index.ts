import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { polkadotInjectedWeb3Bindings } from '$/sources/PolkadotInjectedWeb3/bindings.ts'

export default {
	provider: SourceProvider.PolkadotInjectedWeb3,
	label: 'Polkadot injected web3',
	sources: [
		{
			provider: SourceProvider.PolkadotInjectedWeb3,
			source: Source.PolkadotInjectedWeb3_WalletApi,
			label: 'Polkadot injected web3 wallet API',
		},
	],
	bindings: polkadotInjectedWeb3Bindings,
} satisfies SourceProviderDefinition
