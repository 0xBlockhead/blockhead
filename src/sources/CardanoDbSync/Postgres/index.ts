// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const cardanoDbSyncPostgresSourceDefinition = {
	provider: SourceProvider.CardanoDbSync,
	source: Source.CardanoDbSync_Postgres,
	label: 'cardano-db-sync Postgres',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default cardanoDbSyncPostgresSourceDefinition
