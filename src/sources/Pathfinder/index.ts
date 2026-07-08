import { sourceOriginsFromBindings } from '$/sources/$sources.ts'
import { pathfinderBindings } from '$/sources/Pathfinder/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

const pathfinderOrigins = sourceOriginsFromBindings(pathfinderBindings)

const pathfinderSourceProviderDefinition = {
	provider: SourceProvider.Pathfinder,
	label: 'Pathfinder',
	sources: [
		{
			provider: SourceProvider.Pathfinder,
			source: Source.Pathfinder_JsonRpc,
			label: 'Pathfinder JSON-RPC',
		},
	],
	bindings: pathfinderBindings,
	origins: pathfinderOrigins,
} satisfies SourceProviderDefinition

export default pathfinderSourceProviderDefinition
