// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const neynarRestSourceDefinition = {
	provider: SourceProvider.Neynar,
	source: Source.Neynar_Rest,
	label: 'Neynar REST',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default neynarRestSourceDefinition
