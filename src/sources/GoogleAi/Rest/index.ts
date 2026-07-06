// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const googleAiRestSourceDefinition = {
	provider: SourceProvider.GoogleAi,
	source: Source.GoogleAi_Rest,
	label: 'Google AI REST',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default googleAiRestSourceDefinition
