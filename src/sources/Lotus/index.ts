import bindings from '$/sources/Lotus/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.Lotus,
	label: 'Lotus',
	sources: {
		[Source.Lotus_JsonRpc]: {
			label: 'Lotus JSON-RPC',
		},
	},
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
