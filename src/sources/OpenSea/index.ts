import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { openSeaBindings } from '$/sources/OpenSea/bindings.ts'

export default {
	provider: SourceProvider.OpenSea,
	label: 'OpenSea',
	sources: [
		{
			provider: SourceProvider.OpenSea,
			source: Source.OpenSea_Rest,
			label: 'OpenSea REST',
		},
	],
	bindings: openSeaBindings,
} satisfies SourceProviderDefinition
