// Generated from APP.ts.

import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'
import bindings from '$/sources/TonLiteServer/bindings.ts'

export default {
	provider: SourceProvider.TonLiteServer,
	label: 'TON Lite Server',
	sources: [
		{
			source: Source.TonLiteServer_Adnl,
			label: 'TON Lite Server ADNL',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition
