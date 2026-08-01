// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/Octez/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.Octez,
	label: 'Octez',
	sources: [
		{
			source: Source.OctezNode,
			label: 'Octez Mainnet node',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition
