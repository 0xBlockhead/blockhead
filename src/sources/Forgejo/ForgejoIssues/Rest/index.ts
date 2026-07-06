// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const forgejoIssuesRestSourceDefinition = {
	provider: SourceProvider.Forgejo,
	source: Source.ForgejoIssues_Rest,
	label: 'Forgejo issues REST',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default forgejoIssuesRestSourceDefinition
