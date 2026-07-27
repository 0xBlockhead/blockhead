// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/EigenExplorer/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.EigenExplorer,
	label: 'EigenExplorer',
	sources: [
		{
			source: Source.EigenExplorer_Rest,
			label: 'EigenExplorer REST',
		},
	],
	bindings: [bindings[Source.EigenExplorer_Rest]],
} satisfies SourceProviderDefinition
