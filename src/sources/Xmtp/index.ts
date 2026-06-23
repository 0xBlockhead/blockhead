import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { xmtpBindings } from '$/sources/Xmtp/bindings.ts'

export default {
	provider: SourceProvider.Xmtp,
	label: 'XMTP',
	sources: [
		{
			provider: SourceProvider.Xmtp,
			source: Source.Xmtp_BrowserSdk,
			label: 'XMTP browser SDK',
		},
		{
			provider: SourceProvider.Xmtp,
			source: Source.Xmtp_NodeSdk,
			label: 'XMTP Node SDK',
		},
	],
	bindings: xmtpBindings,
} satisfies SourceProviderDefinition
