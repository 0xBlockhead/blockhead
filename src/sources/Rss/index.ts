// Generated from APP.ts.

import bindings from '$/sources/Rss/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.Rss,
	label: 'RSS / Atom',
	sources: [
		{
			source: Source.Rss_Rest,
			label: 'RSS / Atom direct fetch',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition
