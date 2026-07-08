import { sourceOriginsFromBindings } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'
import { zebraBindings } from '$/sources/Zebra/bindings.ts'

const zebraOrigins = sourceOriginsFromBindings(zebraBindings)

const zebraSourceProviderDefinition = {
	provider: SourceProvider.Zebra,
	label: 'Zebra',
	sources: [
		{
			provider: SourceProvider.Zebra,
			source: Source.Zebra_JsonRpc,
			label: 'Zebra JSON-RPC',
		},
	],
	bindings: zebraBindings,
	origins: zebraOrigins,
} satisfies SourceProviderDefinition

export default zebraSourceProviderDefinition
