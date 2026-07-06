// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const icDashboardCanisterSourceDefinition = {
	provider: SourceProvider.InternetComputer,
	source: Source.IcDashboard_Canister,
	label: 'IC dashboard canister',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default icDashboardCanisterSourceDefinition
