// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const atprotoXrpcSourceDefinition = {
	provider: SourceProvider.AtprotoBsky,
	source: Source.Atproto_Xrpc,
	label: 'AT Protocol public XRPC',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default atprotoXrpcSourceDefinition
