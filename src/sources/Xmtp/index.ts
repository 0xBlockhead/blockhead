// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'
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
	bindings: [
		bindings[Source.Xmtp_BrowserSdk],
		bindings[Source.Xmtp_NodeSdk],
	],
} satisfies SourceProviderDefinition
