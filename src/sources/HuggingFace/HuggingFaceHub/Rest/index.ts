// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const huggingFaceHubRestSourceDefinition = {
	provider: SourceProvider.HuggingFace,
	source: Source.HuggingFaceHub_Rest,
	label: 'Hugging Face Hub REST',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default huggingFaceHubRestSourceDefinition
