import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { bithompBindings } from '$/sources/Bithomp/bindings.ts'

export default {
	provider: SourceProvider.Bithomp,
	label: 'Bithomp',
	sources: [
		{
			provider: SourceProvider.Bithomp,
			source: Source.Bithomp_Rest,
			label: 'Bithomp REST',
		},
	],
	bindings: bithompBindings,
} satisfies SourceProviderDefinition
