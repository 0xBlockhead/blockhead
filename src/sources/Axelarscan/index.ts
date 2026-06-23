import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { axelarscanBindings } from '$/sources/Axelarscan/bindings.ts'

export default {
	provider: SourceProvider.Axelarscan,
	label: 'Axelarscan',
	sources: [
		{
			provider: SourceProvider.Axelarscan,
			source: Source.Axelarscan_Rest,
			label: 'Axelarscan REST',
		},
	],
	bindings: axelarscanBindings,
} satisfies SourceProviderDefinition
