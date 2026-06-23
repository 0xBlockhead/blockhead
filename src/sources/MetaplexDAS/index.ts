import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { metaplexDASBindings } from '$/sources/MetaplexDAS/bindings.ts'

export default {
	provider: SourceProvider.MetaplexDAS,
	label: 'Metaplex DAS',
	sources: [
		{
			provider: SourceProvider.MetaplexDAS,
			source: Source.MetaplexDAS_Rest,
			label: 'Metaplex DAS REST',
		},
	],
	bindings: metaplexDASBindings,
} satisfies SourceProviderDefinition
