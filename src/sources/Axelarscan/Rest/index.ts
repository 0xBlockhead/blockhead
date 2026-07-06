// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const axelarscanRestSourceDefinition = {
	provider: SourceProvider.Axelarscan,
	source: Source.Axelarscan_Rest,
	label: 'Axelarscan REST',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default axelarscanRestSourceDefinition
