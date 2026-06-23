import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { fedimintGatewaydBindings } from '$/sources/FedimintGatewayd/bindings.ts'

export default {
	provider: SourceProvider.FedimintGatewayd,
	label: 'Fedimint gatewayd',
	sources: [
		{
			provider: SourceProvider.FedimintGatewayd,
			source: Source.FedimintGatewayd_Rest,
			label: 'Fedimint gatewayd REST',
		},
	],
	bindings: fedimintGatewaydBindings,
} satisfies SourceProviderDefinition
