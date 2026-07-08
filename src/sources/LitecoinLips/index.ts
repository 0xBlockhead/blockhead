import { sourceOriginsFromBindings } from '$/sources/$sources.ts'
import { litecoinLipsBindings } from '$/sources/LitecoinLips/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

const litecoinLipsOrigins = sourceOriginsFromBindings(litecoinLipsBindings)

const litecoinLipsSourceProviderDefinition = {
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
	origins: litecoinLipsOrigins,
} satisfies SourceProviderDefinition

export default litecoinLipsSourceProviderDefinition
