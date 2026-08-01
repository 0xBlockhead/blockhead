// Generated from APP.ts.

import bindings from '$/sources/Celestia/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.Celestia,
	label: 'Celestia',
	sources: [
		{
			source: Source.CelestiaNode,
			label: 'Celestia Node',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition
