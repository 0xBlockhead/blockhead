// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const xmtpBrowserSdkSourceDefinition = {
	provider: SourceProvider.Xmtp,
	source: Source.Xmtp_BrowserSdk,
	label: 'XMTP browser SDK',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default xmtpBrowserSdkSourceDefinition
