import { sourceOriginsFromBindings } from '$/sources/$sources.ts'
import { dogecoinDipsBindings } from '$/sources/DogecoinDips/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

const dogecoinDipsOrigins = sourceOriginsFromBindings(dogecoinDipsBindings)

const dogecoinDipsSourceProviderDefinition = {
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
	origins: dogecoinDipsOrigins,
} satisfies SourceProviderDefinition

export default dogecoinDipsSourceProviderDefinition
