// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/CronosExplorer/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.CronosExplorer,
	label: 'Cronos Explorer',
	sources: [
		{
			source: Source.CronosExplorer_Rest,
			label: 'Cronos Explorer REST',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition
