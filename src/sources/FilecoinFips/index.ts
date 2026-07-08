import { sourceOriginsFromBindings } from '$/sources/$sources.ts'
import { filecoinFipsBindings } from '$/sources/FilecoinFips/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

const filecoinFipsOrigins = sourceOriginsFromBindings(filecoinFipsBindings)

const filecoinFipsSourceProviderDefinition = {
	provider: SourceProvider.FilecoinFips,
	label: 'Filecoin FIPs',
	sources: [
		{
			provider: SourceProvider.FilecoinFips,
			source: Source.FilecoinFips_Github,
			label: 'Filecoin FIPs GitHub',
		},
	],
	bindings: filecoinFipsBindings,
	origins: filecoinFipsOrigins,
} satisfies SourceProviderDefinition

export default filecoinFipsSourceProviderDefinition
