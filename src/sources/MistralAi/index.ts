import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { mistralAiBindings } from '$/sources/MistralAi/bindings.ts'

export default {
	provider: SourceProvider.MistralAi,
	label: 'Mistral AI',
	sources: [
		{
			provider: SourceProvider.MistralAi,
			source: Source.MistralAi_Rest,
			label: 'Mistral AI REST',
		},
	],
	bindings: mistralAiBindings,
} satisfies SourceProviderDefinition
