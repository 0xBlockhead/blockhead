// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const fedimintGatewaydRestSourceDefinition = {
	provider: SourceProvider.FedimintGatewayd,
	source: Source.FedimintGatewayd_Rest,
	label: 'Fedimint gatewayd REST',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default fedimintGatewaydRestSourceDefinition
