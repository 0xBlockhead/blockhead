// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const farcasterRestSourceDefinition = {
	provider: SourceProvider.Farcaster,
	source: Source.Farcaster_Rest,
	label: 'Farcaster REST',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default farcasterRestSourceDefinition
