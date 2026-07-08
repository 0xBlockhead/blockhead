import { sourceOriginsFromBindings } from '$/sources/$sources.ts'
import { anthropicBindings } from '$/sources/Anthropic/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

const anthropicOrigins = sourceOriginsFromBindings(anthropicBindings)

const anthropicSourceProviderDefinition = {
	provider: SourceProvider.Anthropic,
	label: 'Anthropic',
	sources: [
		{
			provider: SourceProvider.Anthropic,
			source: Source.Anthropic_Rest,
			label: 'Anthropic REST',
		},
	],
	bindings: anthropicBindings,
	origins: anthropicOrigins,
} satisfies SourceProviderDefinition

export default anthropicSourceProviderDefinition
