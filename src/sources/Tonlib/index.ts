// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'
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
	bindings: [bindings[Source.Tonlib_JsonRpc]],
} satisfies SourceProviderDefinition
