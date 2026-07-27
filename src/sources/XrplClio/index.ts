// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'
import bindings from '$/sources/XrplClio/bindings.ts'

export default {
	provider: SourceProvider.XrplClio,
	label: 'XRPL Clio',
	sources: [
		{
			source: Source.XrplClio_JsonRpc,
			label: 'XRPL Clio JSON-RPC',
		},
	],
	bindings: bindings[Source.XrplClio_JsonRpc],
} satisfies SourceProviderDefinition
