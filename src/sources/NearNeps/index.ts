import { sourceOriginsFromBindings } from '$/sources/$sources.ts'
import { nearNepsBindings } from '$/sources/NearNeps/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

const nearNepsOrigins = sourceOriginsFromBindings(nearNepsBindings)

const nearNepsSourceProviderDefinition = {
	provider: SourceProvider.NearNeps,
	label: 'NEAR NEPs',
	sources: [
		{
			provider: SourceProvider.NearNeps,
			source: Source.NearNeps_Github,
			label: 'NEAR NEPs GitHub',
		},
	],
	bindings: nearNepsBindings,
	origins: nearNepsOrigins,
} satisfies SourceProviderDefinition

export default nearNepsSourceProviderDefinition
