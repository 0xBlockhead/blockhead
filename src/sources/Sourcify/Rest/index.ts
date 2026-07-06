// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const sourcifyRestSourceDefinition = {
	provider: SourceProvider.Sourcify,
	source: Source.Sourcify_Rest,
	label: 'Sourcify REST',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default sourcifyRestSourceDefinition
