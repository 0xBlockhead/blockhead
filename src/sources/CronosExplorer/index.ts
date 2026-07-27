// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/CronosExplorer/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.CronosExplorer,
	label: 'Cronos Explorer',
	sources: [
		{
			source: Source.CronosExplorer_Rest,
			label: 'Cronos Explorer REST',
		},
	],
	bindings: [bindings[Source.CronosExplorer_Rest]],
} satisfies SourceProviderDefinition
