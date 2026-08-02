// Generated from APP.ts.

import bindings from '$/sources/Filfox/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.Filfox,
	label: 'Filfox',
	sources: [
		{
			source: Source.Filfox_Rest,
			label: 'Filfox REST',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition<typeof bindings>
