// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const mistralAiRestSourceDefinition = {
	provider: SourceProvider.MistralAi,
	source: Source.MistralAi_Rest,
	label: 'Mistral AI REST',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default mistralAiRestSourceDefinition
