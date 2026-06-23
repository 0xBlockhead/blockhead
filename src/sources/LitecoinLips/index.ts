import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { litecoinLipsBindings } from '$/sources/LitecoinLips/bindings.ts'

export default {
	provider: SourceProvider.LitecoinLips,
	label: 'Litecoin LIPs',
	sources: [
		{
			provider: SourceProvider.LitecoinLips,
			source: Source.LitecoinLips_Github,
			label: 'Litecoin LIPs GitHub',
		},
	],
	bindings: litecoinLipsBindings,
} satisfies SourceProviderDefinition
