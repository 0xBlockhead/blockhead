import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { dogecoinDipsBindings } from '$/sources/DogecoinDips/bindings.ts'

export default {
	provider: SourceProvider.DogecoinDips,
	label: 'Dogecoin DIPs',
	sources: [
		{
			provider: SourceProvider.DogecoinDips,
			source: Source.DogecoinDips_Github,
			label: 'Dogecoin DIPs GitHub',
		},
	],
	bindings: dogecoinDipsBindings,
} satisfies SourceProviderDefinition
