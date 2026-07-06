// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const xmtpNodeSdkSourceDefinition = {
	provider: SourceProvider.Xmtp,
	source: Source.Xmtp_NodeSdk,
	label: 'XMTP Node SDK',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default xmtpNodeSdkSourceDefinition
