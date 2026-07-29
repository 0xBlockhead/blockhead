// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/Kabila/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.Kabila,
	label: 'Kabila',
	sources: [
		{
			source: Source.Kabila_WalletConnect,
			label: 'Kabila WalletConnect',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition
