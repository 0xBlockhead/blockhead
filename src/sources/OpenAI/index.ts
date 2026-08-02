// Generated from APP.ts.

import bindings from '$/sources/OpenAI/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.OpenAI,
	label: 'OpenAI',
	sources: {
		[Source.OpenAI_Rest]: {
			label: 'OpenAI REST',
		},
	},
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
