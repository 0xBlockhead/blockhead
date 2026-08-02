// Generated from APP.ts.

import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'
import bindings from '$/sources/Starkscan/bindings.ts'

export default {
	provider: SourceProvider.Starkscan,
	label: 'Starkscan',
	sources: [
		{
			source: Source.Starkscan,
			label: 'Starkscan',
		},
	],
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
