import { sourceOriginsFromBindings } from '$/sources/$sources.ts'
import { junoBindings } from '$/sources/Juno/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

const junoOrigins = sourceOriginsFromBindings(junoBindings)

const junoSourceProviderDefinition = {
	provider: SourceProvider.Juno,
	label: 'Juno',
	sources: [
		{
			provider: SourceProvider.Juno,
			source: Source.Juno_JsonRpc,
			label: 'Juno JSON-RPC',
		},
	],
	bindings: junoBindings,
	origins: junoOrigins,
} satisfies SourceProviderDefinition

export default junoSourceProviderDefinition
