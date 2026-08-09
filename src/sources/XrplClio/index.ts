import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'
import bindings from '$/sources/XrplClio/bindings.ts'

export default {
	provider: SourceProvider.XrplClio,
	label: 'XRPL Clio',
	sources: {
		[Source.XrplClio_JsonRpc]: {
			label: 'XRPL Clio JSON-RPC',
		},
	},
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
