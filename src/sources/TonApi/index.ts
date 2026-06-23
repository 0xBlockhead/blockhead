import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { tonApiBindings } from '$/sources/TonApi/bindings.ts'

export default {
	provider: SourceProvider.TonApi,
	label: 'TonAPI',
	sources: [
		{
			provider: SourceProvider.TonApi,
			source: Source.TonApi_Rest,
			label: 'TonAPI REST',
		},
	],
	bindings: tonApiBindings,
} satisfies SourceProviderDefinition
