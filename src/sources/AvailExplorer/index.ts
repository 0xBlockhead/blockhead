// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/AvailExplorer/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.AvailExplorer,
	label: 'Avail Explorer',
	sources: [
		{
			source: Source.AvailExplorer_Rest,
			label: 'Avail Explorer REST',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition
