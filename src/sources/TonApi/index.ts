// Generated from APP.ts.

import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'
import bindings from '$/sources/TonApi/bindings.ts'

export default {
	provider: SourceProvider.TonApi,
	label: 'TonAPI',
	sources: [
		{
			source: Source.TonApi_Rest,
			label: 'TonAPI REST',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition<typeof bindings>
