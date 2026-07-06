// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const payjoinDirectoryRestSourceDefinition = {
	provider: SourceProvider.Payjoin,
	source: Source.PayjoinDirectory_Rest,
	label: 'Payjoin directory REST',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default payjoinDirectoryRestSourceDefinition
