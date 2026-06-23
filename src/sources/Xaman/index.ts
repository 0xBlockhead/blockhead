import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { xamanBindings } from '$/sources/Xaman/bindings.ts'

export default {
	provider: SourceProvider.Xaman,
	label: 'Xaman',
	sources: [
		{
			provider: SourceProvider.Xaman,
			source: Source.Xaman_Api,
			label: 'Xaman API',
		},
	],
	bindings: xamanBindings,
} satisfies SourceProviderDefinition
