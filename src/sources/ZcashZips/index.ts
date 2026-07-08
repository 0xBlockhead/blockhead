import { sourceOriginsFromBindings } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'
import { zcashZipsBindings } from '$/sources/ZcashZips/bindings.ts'

const zcashZipsOrigins = sourceOriginsFromBindings(zcashZipsBindings)

const zcashZipsSourceProviderDefinition = {
	provider: SourceProvider.ZcashZips,
	label: 'Zcash ZIPs',
	sources: [
		{
			provider: SourceProvider.ZcashZips,
			source: Source.ZcashZips_Github,
			label: 'Zcash ZIPs GitHub',
		},
	],
	bindings: zcashZipsBindings,
	origins: zcashZipsOrigins,
} satisfies SourceProviderDefinition

export default zcashZipsSourceProviderDefinition
