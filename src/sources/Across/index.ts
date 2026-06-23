import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { acrossBindings } from '$/sources/Across/bindings.ts'

export default {
	provider: SourceProvider.Across,
	label: 'Across',
	sources: [
		{
			provider: SourceProvider.Across,
			source: Source.Across_Rest,
			label: 'Across REST',
		},
	],
	bindings: acrossBindings,
} satisfies SourceProviderDefinition
