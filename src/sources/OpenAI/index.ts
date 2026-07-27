// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/OpenAI/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.OpenAI,
	label: 'OpenAI',
	sources: [
		{
			source: Source.OpenAI_Rest,
			label: 'OpenAI REST',
		},
	],
	bindings: [bindings[Source.OpenAI_Rest]],
} satisfies SourceProviderDefinition
