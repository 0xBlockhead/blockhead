// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const payjoinReceiverHttpSourceDefinition = {
	provider: SourceProvider.Payjoin,
	source: Source.PayjoinReceiver_Http,
	label: 'Payjoin receiver HTTP',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default payjoinReceiverHttpSourceDefinition
