import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { eip8004ScanBindings } from '$/sources/Eip8004Scan/bindings.ts'

export const eip8004ScanOrigins = [
	...new Map(
		eip8004ScanBindings
			.flatMap((binding) => binding.endpoints)
			.map((endpoint) => [
				endpoint.origin,
				{
					origin: endpoint.origin,
					corsEnabled: endpoint.corsEnabled,
				},
			])
	).values(),
]

export default {
	provider: SourceProvider.Eip8004Scan,
	label: '8004scan',
	sources: [
		{
			provider: SourceProvider.Eip8004Scan,
			source: Source.Eip8004Scan_Rest,
			label: '8004scan REST',
		},
	],
	bindings: eip8004ScanBindings,
} satisfies SourceProviderDefinition
