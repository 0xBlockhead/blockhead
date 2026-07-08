import { sourceOriginsFromBindings } from '$/sources/$sources.ts'
import { mempoolSpaceBindings } from '$/sources/MempoolSpace/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

const mempoolSpaceOrigins = sourceOriginsFromBindings(mempoolSpaceBindings)

const mempoolSpaceSourceProviderDefinition = {
	provider: SourceProvider.MempoolSpace,
	label: 'mempool.space',
	sources: [
		{
			provider: SourceProvider.MempoolSpace,
			source: Source.MempoolSpace_Rest,
			label: 'mempool.space REST',
		},
	],
	bindings: mempoolSpaceBindings,
	origins: mempoolSpaceOrigins,
} satisfies SourceProviderDefinition

export default mempoolSpaceSourceProviderDefinition
