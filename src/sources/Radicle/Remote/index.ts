// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const radicleRemoteSourceDefinition = {
	provider: SourceProvider.Radicle,
	source: Source.Radicle_Remote,
	label: 'Radicle remote repository',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default radicleRemoteSourceDefinition
