import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { mempoolSpaceBindings } from '$/sources/MempoolSpace/bindings.ts'

export const mempoolSpaceOrigins = mempoolSpaceBindings.flatMap((binding) => (
	binding.endpoints.map((endpoint) => ({
		origin: endpoint.origin,
		corsEnabled: endpoint.corsEnabled,
	}))
))

export default {
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
} satisfies SourceProviderDefinition
