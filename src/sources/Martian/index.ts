// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/Martian/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.Martian,
	label: 'Martian',
	sources: [
		{
			source: Source.Martian_WalletApi,
			label: 'Martian wallet API',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition
