// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/MistralAi/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.MistralAi,
	label: 'Mistral AI',
	sources: [
		{
			source: Source.MistralAi_Rest,
			label: 'Mistral AI REST',
		},
	],
	bindings: [bindings[Source.MistralAi_Rest]],
} satisfies SourceProviderDefinition
