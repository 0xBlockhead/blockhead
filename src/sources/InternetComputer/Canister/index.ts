// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const internetComputerCanisterSourceDefinition = {
	provider: SourceProvider.InternetComputer,
	source: Source.InternetComputer_Canister,
	label: 'Internet Computer canister',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default internetComputerCanisterSourceDefinition
