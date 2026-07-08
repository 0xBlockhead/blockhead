import { sourceOriginsFromBindings } from '$/sources/$sources.ts'
import { openAiBindings } from '$/sources/OpenAI/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

const openAIOrigins = sourceOriginsFromBindings(openAiBindings)

const openAISourceProviderDefinition = {
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
	origins: openAIOrigins,
} satisfies SourceProviderDefinition

export default openAISourceProviderDefinition
