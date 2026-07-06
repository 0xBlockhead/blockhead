// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const openAIRestSourceDefinition = {
	provider: SourceProvider.OpenAI,
	source: Source.OpenAI_Rest,
	label: 'OpenAI REST',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default openAIRestSourceDefinition
