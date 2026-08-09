import bindings from '$/sources/AtprotoBsky/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.AtprotoBsky,
	label: 'ATProto (Bsky public appview)',
	sources: {
		[Source.Atproto_Xrpc]: {
			label: 'ATProto XRPC',
		},
	},
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
