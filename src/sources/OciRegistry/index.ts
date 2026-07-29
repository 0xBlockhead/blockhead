// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/OciRegistry/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.OciRegistry,
	label: 'OCI Registry',
	sources: [
		{
			source: Source.OciRegistry_Distribution,
			label: 'OCI distribution registry',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition
