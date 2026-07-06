// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const easScanGraphqlSourceDefinition = {
	provider: SourceProvider.EasScan,
	source: Source.EasScan_Graphql,
	label: 'EAS Scan GraphQL',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default easScanGraphqlSourceDefinition
