// Generated from APP.ts.

import bindings from '$/sources/HuggingFace/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.HuggingFace,
	label: 'Hugging Face',
	sources: {
		[Source.HuggingFaceHub_Rest]: {
			label: 'Hugging Face Hub REST',
		},
	},
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
