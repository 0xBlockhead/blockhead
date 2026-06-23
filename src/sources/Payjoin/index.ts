import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { payjoinBindings } from '$/sources/Payjoin/bindings.ts'

export const payjoinOrigins = [
	...new Map(
		payjoinBindings
			.flatMap((binding) => binding.endpoints)
			.flatMap((endpoint) => (
				endpoint.origin == null ?
					[]
				:
					[[
						endpoint.origin,
						{
							origin: endpoint.origin,
							corsEnabled: endpoint.corsEnabled === true,
						},
					]]
			))
	).values(),
]

export default {
	provider: SourceProvider.Payjoin,
	label: 'Payjoin',
	sources: [
		{
			provider: SourceProvider.Payjoin,
			source: Source.PayjoinOhttpRelay_Http,
			label: 'Payjoin OHTTP relay',
		},
		{
			provider: SourceProvider.Payjoin,
			source: Source.PayjoinReceiver_Http,
			label: 'Payjoin receiver HTTP',
		},
		{
			provider: SourceProvider.Payjoin,
			source: Source.PayjoinDirectory_Rest,
			label: 'Payjoin directory REST',
		},
	],
	bindings: payjoinBindings,
} satisfies SourceProviderDefinition
