// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/Rss/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.Rss,
	label: 'RSS / Atom',
	sources: [
		{
			source: Source.Rss_Rest,
			label: 'RSS / Atom direct fetch',
		},
	],
	bindings: bindings[Source.Rss_Rest],
} satisfies SourceProviderDefinition
