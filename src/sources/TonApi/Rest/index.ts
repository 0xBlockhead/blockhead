// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const tonApiRestSourceDefinition = {
	provider: SourceProvider.TonApi,
	source: Source.TonApi_Rest,
	label: 'TonAPI REST',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default tonApiRestSourceDefinition
