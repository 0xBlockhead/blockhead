import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { fediBindings } from '$/sources/Fedi/bindings.ts'

export default {
	provider: SourceProvider.Fedi,
	label: 'Fedi',
	sources: [
		{
			provider: SourceProvider.Fedi,
			source: Source.Fedi_Rest,
			label: 'Fedi REST',
		},
	],
	bindings: fediBindings,
} satisfies SourceProviderDefinition
