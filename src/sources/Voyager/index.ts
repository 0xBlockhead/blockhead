import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { voyagerBindings } from '$/sources/Voyager/bindings.ts'

export default {
	provider: SourceProvider.Voyager,
	label: 'Voyager',
	sources: [
		{
			provider: SourceProvider.Voyager,
			source: Source.Voyager_Rest,
			label: 'Voyager REST',
		},
	],
	bindings: voyagerBindings,
} satisfies SourceProviderDefinition
