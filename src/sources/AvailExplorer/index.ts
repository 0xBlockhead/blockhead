// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/AvailExplorer/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.AvailExplorer,
	label: 'Avail Explorer',
	sources: [
		{
			source: Source.AvailExplorer_Rest,
			label: 'Avail Explorer REST',
		},
	],
	bindings: [bindings[Source.AvailExplorer_Rest]],
} satisfies SourceProviderDefinition
