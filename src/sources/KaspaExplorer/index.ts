// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/KaspaExplorer/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.KaspaExplorer,
	label: 'Kaspa Explorer',
	sources: [
		{
			source: Source.KaspaExplorer_Rest,
			label: 'Kaspa Explorer REST',
		},
	],
	bindings: [bindings[Source.KaspaExplorer_Rest]],
} satisfies SourceProviderDefinition
