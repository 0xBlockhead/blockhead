// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/KaspaExplorer/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.KaspaExplorer,
	label: 'Kaspa Explorer',
	sources: [
		{
			source: Source.KaspaExplorer_Rest,
			label: 'Kaspa Explorer REST',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition
