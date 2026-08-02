// Generated from APP.ts.

import bindings from '$/sources/FedimintGatewayd/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.FedimintGatewayd,
	label: 'Fedimint gatewayd',
	sources: [
		{
			source: Source.FedimintGatewayd_Rest,
			label: 'Fedimint gatewayd REST',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition<typeof bindings>
