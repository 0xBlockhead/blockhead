import { sourceOriginsFromBindings } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'
import { starkscanBindings } from '$/sources/Starkscan/bindings.ts'

const starkscanOrigins = sourceOriginsFromBindings(starkscanBindings)

const starkscanSourceProviderDefinition = {
	provider: SourceProvider.Starkscan,
	label: 'Starkscan',
	sources: [
		{
			provider: SourceProvider.Starkscan,
			source: Source.Starkscan_Rest,
			label: 'Starkscan REST',
		},
	],
	bindings: starkscanBindings,
	origins: starkscanOrigins,
} satisfies SourceProviderDefinition

export default starkscanSourceProviderDefinition
