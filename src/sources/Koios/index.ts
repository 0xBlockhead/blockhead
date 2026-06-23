import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { koiosBindings } from '$/sources/Koios/bindings.ts'

export default {
	provider: SourceProvider.Koios,
	label: 'Koios',
	sources: [
		{
			provider: SourceProvider.Koios,
			source: Source.Koios_Rest,
			label: 'Koios REST',
		},
	],
	bindings: koiosBindings,
} satisfies SourceProviderDefinition
