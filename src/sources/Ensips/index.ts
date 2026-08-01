// Generated from APP.ts.

import bindings from '$/sources/Ensips/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.Ensips,
	label: 'ENSIPs',
	sources: [
		{
			source: Source.Ensips_Github,
			label: 'ENSIPs GitHub',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition
