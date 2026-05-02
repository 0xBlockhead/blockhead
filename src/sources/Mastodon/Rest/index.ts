import { Source } from '$/sources/$Source.ts'
import { SourceProvider } from '$/sources/$SourceProvider.ts'
import type { SourceDefinition } from '$/sources/$Source.ts'

const MastodonRestSource = {
	provider: SourceProvider.Mastodon,
	source: Source.Mastodon_Rest,
	label: 'Mastodon API v1 (REST)',
} satisfies SourceDefinition

export default MastodonRestSource
