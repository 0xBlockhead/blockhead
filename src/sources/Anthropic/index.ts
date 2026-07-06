// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const anthropicRestSourceDefinition = {
	provider: SourceProvider.Anthropic,
	source: Source.Anthropic_Rest,
	label: 'Anthropic REST',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default anthropicRestSourceDefinition
