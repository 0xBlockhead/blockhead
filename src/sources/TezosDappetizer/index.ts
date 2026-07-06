// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const tezosDappetizerPostgresSourceDefinition = {
	provider: SourceProvider.TezosDappetizer,
	source: Source.TezosDappetizer_Postgres,
	label: 'Tezos Dappetizer Postgres',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default tezosDappetizerPostgresSourceDefinition
