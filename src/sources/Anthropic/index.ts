// Generated from APP.ts.

import bindings from '$/sources/Anthropic/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.Anthropic,
	label: 'Anthropic',
	sources: [
		{
			source: Source.Anthropic_Rest,
			label: 'Anthropic REST',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition
