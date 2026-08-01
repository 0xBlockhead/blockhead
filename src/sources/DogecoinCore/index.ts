// Generated from APP.ts.

import bindings from '$/sources/DogecoinCore/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.DogecoinCore,
	label: 'Dogecoin Core',
	sources: [
		{
			source: Source.DogecoinCore_JsonRpc,
			label: 'Dogecoin Core JSON-RPC',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition
