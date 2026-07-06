// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const filfoxRestSourceDefinition = {
	provider: SourceProvider.Filfox,
	source: Source.Filfox_Rest,
	label: 'Filfox REST',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default filfoxRestSourceDefinition
