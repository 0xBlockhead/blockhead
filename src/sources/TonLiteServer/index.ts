// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'
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
	bindings: [bindings[Source.TonLiteServer_Adnl]],
} satisfies SourceProviderDefinition
