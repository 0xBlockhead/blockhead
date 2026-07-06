// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const radicleLocalSourceDefinition = {
	provider: SourceProvider.Radicle,
	source: Source.Radicle_Local,
	label: 'Radicle local repository',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default radicleLocalSourceDefinition
