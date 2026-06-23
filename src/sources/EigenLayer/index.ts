import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { eigenLayerBindings } from '$/sources/EigenLayer/bindings.ts'

export default {
	provider: SourceProvider.EigenLayer,
	label: 'EigenLayer',
	sources: [
		{
			provider: SourceProvider.EigenLayer,
			source: Source.EigenLayerContracts_Evm,
			label: 'EigenLayer contract catalog',
		},
	],
	bindings: eigenLayerBindings,
} satisfies SourceProviderDefinition
