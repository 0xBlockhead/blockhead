import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { mintscanBindings } from '$/sources/Mintscan/bindings.ts'

export default {
	provider: SourceProvider.Mintscan,
	label: 'Mintscan',
	sources: [
		{
			provider: SourceProvider.Mintscan,
			source: Source.Mintscan_Rest,
			label: 'Mintscan REST',
		},
	],
	bindings: mintscanBindings,
} satisfies SourceProviderDefinition
