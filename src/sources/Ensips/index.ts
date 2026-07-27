// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/Ensips/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.Ensips,
	label: 'ENSIPs',
	sources: [
		{
			source: Source.Ensips_Github,
			label: 'ENSIPs GitHub',
		},
	],
	bindings: [bindings[Source.Ensips_Github]],
} satisfies SourceProviderDefinition
