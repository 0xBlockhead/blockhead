// Generated from APP.ts.

import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'
import bindings from '$/sources/Xmtp/bindings.ts'

export default {
	provider: SourceProvider.Xmtp,
	label: 'XMTP',
	sources: [
		{
			source: Source.Xmtp_BrowserSdk,
			label: 'XMTP browser SDK',
		},
		{
			source: Source.Xmtp_NodeSdk,
			label: 'XMTP Node SDK',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition<typeof bindings>
