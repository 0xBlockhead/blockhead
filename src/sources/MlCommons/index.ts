import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { mlCommonsBindings } from '$/sources/MlCommons/bindings.ts'

export default {
	provider: SourceProvider.MlCommons,
	label: 'MLCommons',
	sources: [
		{
			provider: SourceProvider.MlCommons,
			source: Source.CroissantDocument_Local,
			label: 'Croissant document',
		},
	],
	bindings: mlCommonsBindings,
} satisfies SourceProviderDefinition
