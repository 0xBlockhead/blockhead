// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/AvalanchePlatformVm/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.AvalanchePlatformVm,
	label: 'Avalanche PlatformVM',
	sources: [
		{
			source: Source.AvalanchePlatformVm_JsonRpc,
			label: 'Avalanche PlatformVM JSON-RPC',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition
