import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { lotusBindings } from '$/sources/Lotus/bindings.ts'

export const lotusOrigins = [
	...new Map(
		lotusBindings
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
	provider: SourceProvider.Lotus,
	label: 'Lotus',
	sources: [
		{
			provider: SourceProvider.Lotus,
			source: Source.Lotus_JsonRpc,
			label: 'Lotus JSON-RPC',
		},
	],
	bindings: lotusBindings,
} satisfies SourceProviderDefinition
