// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/OciRegistry/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.OciRegistry,
	label: 'OCI Registry',
	sources: [
		{
			source: Source.OciRegistry_Distribution,
			label: 'OCI distribution registry',
		},
	],
	bindings: [bindings[Source.OciRegistry_Distribution]],
} satisfies SourceProviderDefinition
