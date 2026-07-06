// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const conseilPostgresSourceDefinition = {
	provider: SourceProvider.Conseil,
	source: Source.Conseil_Postgres,
	label: 'Conseil Postgres',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default conseilPostgresSourceDefinition
