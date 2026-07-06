// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const avascanRestSourceDefinition = {
	provider: SourceProvider.Avascan,
	source: Source.Avascan_Rest,
	label: 'Avascan REST',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default avascanRestSourceDefinition
