// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/EigenExplorer/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.EigenExplorer,
	label: 'EigenExplorer',
	sources: [
		{
			source: Source.EigenExplorer_Rest,
			label: 'EigenExplorer REST',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition
