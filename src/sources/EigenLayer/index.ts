// Generated from APP.ts.

import bindings from '$/sources/EigenLayer/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.EigenLayer,
	label: 'EigenLayer',
	sources: [
		{
			source: Source.EigenLayerContracts_Evm,
			label: 'EigenLayer contract catalog',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition<typeof bindings>
