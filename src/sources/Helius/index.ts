import { sourceOriginsFromBindings } from '$/sources/$sources.ts'
import { heliusBindings } from '$/sources/Helius/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

const heliusOrigins = sourceOriginsFromBindings(heliusBindings)

const heliusSourceProviderDefinition = {
	provider: SourceProvider.Helius,
	label: 'Helius',
	sources: [
		{
			provider: SourceProvider.Helius,
			source: Source.Helius_Rest,
			label: 'Helius REST',
		},
	],
	bindings: heliusBindings,
	origins: heliusOrigins,
} satisfies SourceProviderDefinition

export default heliusSourceProviderDefinition
