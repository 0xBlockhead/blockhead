// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const gitLocalSourceDefinition = {
	provider: SourceProvider.Git,
	source: Source.Git_Local,
	label: 'Local Git repository',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default gitLocalSourceDefinition
