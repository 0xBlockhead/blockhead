// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/KaspaWalletCli/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.KaspaWalletCli,
	label: 'Kaspa wallet CLI',
	sources: [
		{
			source: Source.KaspaWalletCli_WalletApi,
			label: 'Kaspa wallet CLI API',
		},
	],
	bindings: [bindings[Source.KaspaWalletCli_WalletApi]],
} satisfies SourceProviderDefinition
