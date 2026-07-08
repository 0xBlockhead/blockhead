import { sourceOriginsFromBindings } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'
import { tzktBindings } from '$/sources/Tzkt/bindings.ts'

const tzktOrigins = sourceOriginsFromBindings(tzktBindings)

const tzktSourceProviderDefinition = {
	provider: SourceProvider.Tzkt,
	label: 'TzKT',
	sources: [
		{
			provider: SourceProvider.Tzkt,
			source: Source.Tzkt_Rest,
			label: 'TzKT REST',
		},
	],
	bindings: tzktBindings,
	origins: tzktOrigins,
} satisfies SourceProviderDefinition

export default tzktSourceProviderDefinition
