// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/Mastodon/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.Mastodon,
	label: 'Mastodon',
	sources: [
		{
			source: Source.Mastodon_Rest,
			label: 'Mastodon REST',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition
