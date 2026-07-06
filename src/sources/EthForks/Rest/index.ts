// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const ethForksRestSourceDefinition = {
	provider: SourceProvider.EthForks,
	source: Source.EthForks_Rest,
	label: 'EthForks REST',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default ethForksRestSourceDefinition
