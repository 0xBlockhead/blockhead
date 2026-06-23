import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { cohereBindings } from '$/sources/Cohere/bindings.ts'

export default {
	provider: SourceProvider.Cohere,
	label: 'Cohere',
	sources: [
		{
			provider: SourceProvider.Cohere,
			source: Source.Cohere_Rest,
			label: 'Cohere REST',
		},
	],
	bindings: cohereBindings,
} satisfies SourceProviderDefinition
