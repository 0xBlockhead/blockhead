// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const forgejoPullsRestSourceDefinition = {
	provider: SourceProvider.Forgejo,
	source: Source.ForgejoPulls_Rest,
	label: 'Forgejo pulls REST',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default forgejoPullsRestSourceDefinition
