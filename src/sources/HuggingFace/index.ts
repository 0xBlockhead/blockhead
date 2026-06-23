import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { huggingFaceBindings } from '$/sources/HuggingFace/bindings.ts'

export default {
	provider: SourceProvider.HuggingFace,
	label: 'Hugging Face',
	sources: [
		{
			provider: SourceProvider.HuggingFace,
			source: Source.HuggingFaceHub_Rest,
			label: 'Hugging Face Hub REST',
		},
	],
	bindings: huggingFaceBindings,
} satisfies SourceProviderDefinition
