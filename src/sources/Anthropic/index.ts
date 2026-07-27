// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/Anthropic/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.Anthropic,
	label: 'Anthropic',
	sources: [
		{
			source: Source.Anthropic_Rest,
			label: 'Anthropic REST',
		},
	],
	bindings: [bindings[Source.Anthropic_Rest]],
} satisfies SourceProviderDefinition
