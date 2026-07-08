import { sourceOriginsFromBindings } from '$/sources/$sources.ts'
import { easScanBindings } from '$/sources/EasScan/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

const easScanOrigins = sourceOriginsFromBindings(easScanBindings)

const easScanSourceProviderDefinition = {
	provider: SourceProvider.EasScan,
	label: 'EAS Scan',
	sources: [
		{
			provider: SourceProvider.EasScan,
			source: Source.EasScan_Graphql,
			label: 'EAS Scan GraphQL',
		},
	],
	bindings: easScanBindings,
	origins: easScanOrigins,
} satisfies SourceProviderDefinition

export default easScanSourceProviderDefinition
