// Generated from APP.ts.

import bindings from '$/sources/LitecoinLips/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.LitecoinLips,
	label: 'Litecoin LIPs',
	sources: [
		{
			source: Source.LitecoinLips_Github,
			label: 'Litecoin LIPs GitHub',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition<typeof bindings>
