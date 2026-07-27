// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/FedimintGatewayd/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.FedimintGatewayd,
	label: 'Fedimint gatewayd',
	sources: [
		{
			source: Source.FedimintGatewayd_Rest,
			label: 'Fedimint gatewayd REST',
		},
	],
	bindings: [bindings[Source.FedimintGatewayd_Rest]],
} satisfies SourceProviderDefinition
