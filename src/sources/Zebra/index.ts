import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'
import bindings from '$/sources/Zebra/bindings.ts'

export default {
	provider: SourceProvider.Zebra,
	label: 'Zebra',
	sources: {
		[Source.Zebra_JsonRpc]: {
			label: 'Zebra JSON-RPC',
		},
	},
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
