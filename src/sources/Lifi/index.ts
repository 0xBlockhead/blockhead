import { sourceOriginsFromBindings } from '$/sources/$sources.ts'
import { lifiBindings } from '$/sources/Lifi/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

const lifiOrigins = sourceOriginsFromBindings(lifiBindings)

const lifiSourceProviderDefinition = {
	provider: SourceProvider.Lifi,
	label: 'LI.FI',
	sources: [
		{
			provider: SourceProvider.Lifi,
			source: Source.LifiStatus_Rest,
			label: 'LI.FI status REST',
		},
		{
			provider: SourceProvider.Lifi,
			source: Source.Lifi_Rest,
			label: 'LI.FI REST',
		},
	],
	bindings: lifiBindings,
	origins: lifiOrigins,
} satisfies SourceProviderDefinition

export default lifiSourceProviderDefinition
