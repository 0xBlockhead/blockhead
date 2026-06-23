import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { anthropicBindings } from '$/sources/Anthropic/bindings.ts'

export default {
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
} satisfies SourceProviderDefinition
