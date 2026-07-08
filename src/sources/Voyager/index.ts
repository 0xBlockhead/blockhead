import { sourceOriginsFromBindings } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'
import { voyagerBindings } from '$/sources/Voyager/bindings.ts'

const voyagerOrigins = sourceOriginsFromBindings(voyagerBindings)

const voyagerSourceProviderDefinition = {
	provider: SourceProvider.Voyager,
	label: 'Voyager',
	sources: [
		{
			provider: SourceProvider.Voyager,
			source: Source.Voyager_Rest,
			label: 'Voyager REST',
		},
	],
	bindings: voyagerBindings,
	origins: voyagerOrigins,
} satisfies SourceProviderDefinition

export default voyagerSourceProviderDefinition
