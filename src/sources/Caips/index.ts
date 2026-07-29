// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/Caips/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.Caips,
	label: 'CAIPs',
	sources: [
		{
			source: Source.Caips_Github,
			label: 'CAIPs GitHub',
		},
		{
			source: Source.CaipNamespaces_Github,
			label: 'CAIP namespaces GitHub',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition
