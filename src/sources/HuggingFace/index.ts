// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/HuggingFace/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.HuggingFace,
	label: 'Hugging Face',
	sources: [
		{
			source: Source.HuggingFaceHub_Rest,
			label: 'Hugging Face Hub REST',
		},
	],
	bindings: [bindings[Source.HuggingFaceHub_Rest]],
} satisfies SourceProviderDefinition
