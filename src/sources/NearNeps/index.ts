import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { nearNepsBindings } from '$/sources/NearNeps/bindings.ts'

export default {
	provider: SourceProvider.NearNeps,
	label: 'Near NEPs',
	sources: [
		{
			provider: SourceProvider.NearNeps,
			source: Source.NearNeps_Github,
			label: 'Near NEPs GitHub',
		},
	],
	bindings: nearNepsBindings,
} satisfies SourceProviderDefinition
