// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/EigenLayer/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.EigenLayer,
	label: 'EigenLayer',
	sources: [
		{
			source: Source.EigenLayerContracts_Evm,
			label: 'EigenLayer contract catalog',
		},
	],
	bindings: [bindings[Source.EigenLayerContracts_Evm]],
} satisfies SourceProviderDefinition
