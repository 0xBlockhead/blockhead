import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { algodBindings } from '$/sources/Algod/bindings.ts'

export default {
	provider: SourceProvider.Algod,
	label: 'Algod',
	sources: [
		{
			provider: SourceProvider.Algod,
			source: Source.Algod_Rest,
			label: 'Algod REST',
		},
	],
	bindings: algodBindings,
} satisfies SourceProviderDefinition
