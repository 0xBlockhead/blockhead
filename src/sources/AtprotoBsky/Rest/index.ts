import { Source } from '$/sources/$Source.ts'
import { SourceProvider } from '$/sources/$SourceProvider.ts'
import type { SourceDefinition } from '$/sources/$Source.ts'

const AtprotoBskyXrpcSource = {
	provider: SourceProvider.AtprotoBsky,
	source: Source.Atproto_Xrpc,
	label: 'AT Protocol (public appview, XRPC)',
} satisfies SourceDefinition

export default AtprotoBskyXrpcSource
