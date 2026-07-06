// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const circleCctpIrisApiSourceDefinition = {
	provider: SourceProvider.CircleCctp,
	source: Source.CircleCctp_IrisApi,
	label: 'Circle CCTP Iris API',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default circleCctpIrisApiSourceDefinition
