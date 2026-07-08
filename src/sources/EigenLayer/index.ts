import { sourceOriginsFromBindings } from '$/sources/$sources.ts'
import { eigenLayerBindings } from '$/sources/EigenLayer/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

const eigenLayerOrigins = sourceOriginsFromBindings(eigenLayerBindings)

const eigenLayerSourceProviderDefinition = {
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
	origins: eigenLayerOrigins,
} satisfies SourceProviderDefinition

export default eigenLayerSourceProviderDefinition
