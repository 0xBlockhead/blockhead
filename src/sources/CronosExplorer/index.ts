// Generated from APP.ts.

import bindings from '$/sources/CronosExplorer/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.CronosExplorer,
	label: 'Cronos Explorer',
	sources: [
		{
			source: Source.CronosExplorer,
			label: 'Cronos Explorer',
		},
	],
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
