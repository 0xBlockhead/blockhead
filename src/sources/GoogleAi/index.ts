import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { googleAiBindings } from '$/sources/GoogleAi/bindings.ts'

export default {
	provider: SourceProvider.GoogleAi,
	label: 'Google AI',
	sources: [
		{
			provider: SourceProvider.GoogleAi,
			source: Source.GoogleAi_Rest,
			label: 'Google AI REST',
		},
	],
	bindings: googleAiBindings,
} satisfies SourceProviderDefinition
