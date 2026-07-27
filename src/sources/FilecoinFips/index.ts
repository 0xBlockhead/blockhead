// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/FilecoinFips/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.FilecoinFips,
	label: 'Filecoin FIPs',
	sources: [
		{
			source: Source.FilecoinFips_Github,
			label: 'Filecoin FIPs GitHub',
		},
	],
	bindings: [bindings[Source.FilecoinFips_Github]],
} satisfies SourceProviderDefinition
