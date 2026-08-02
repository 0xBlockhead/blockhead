// Generated from APP.ts.

import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'
import bindings from '$/sources/Tonlib/bindings.ts'

export default {
	provider: SourceProvider.Tonlib,
	label: 'tonlib',
	sources: [
		{
			source: Source.Tonlib_JsonRpc,
			label: 'tonlib JSON-RPC',
		},
	],
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
