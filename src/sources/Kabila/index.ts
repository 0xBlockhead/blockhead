// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/Kabila/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.Kabila,
	label: 'Kabila',
	sources: [
		{
			source: Source.Kabila_WalletConnect,
			label: 'Kabila WalletConnect',
		},
	],
	bindings: [bindings[Source.Kabila_WalletConnect]],
} satisfies SourceProviderDefinition
