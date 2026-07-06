// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const payjoinOhttpRelayHttpSourceDefinition = {
	provider: SourceProvider.Payjoin,
	source: Source.PayjoinOhttpRelay_Http,
	label: 'Payjoin OHTTP relay',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default payjoinOhttpRelayHttpSourceDefinition
