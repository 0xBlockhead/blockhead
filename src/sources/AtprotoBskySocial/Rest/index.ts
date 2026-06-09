import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceDefinition } from '$/sources/index.ts'

const AtprotoBskySocialXrpcSource = {
	provider: SourceProvider.AtprotoBskySocial,
	source: Source.Atproto_BskySocial_Xrpc,
	label: 'AT Protocol (bsky.social appview, XRPC)',
} satisfies SourceDefinition

export default AtprotoBskySocialXrpcSource
