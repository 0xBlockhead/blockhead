// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/EthForks/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.EthForks,
	label: 'EthForks',
	sources: [
		{
			source: Source.EthForks_Rest,
			label: 'EthForks REST',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition
