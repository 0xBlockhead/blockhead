import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { openAiBindings } from '$/sources/OpenAI/bindings.ts'

export default {
	provider: SourceProvider.OpenAI,
	label: 'OpenAI',
	sources: [
		{
			provider: SourceProvider.OpenAI,
			source: Source.OpenAI_Rest,
			label: 'OpenAI REST',
		},
	],
	bindings: openAiBindings,
} satisfies SourceProviderDefinition
