// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/Mastodon/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.Mastodon,
	label: 'Mastodon',
	sources: [
		{
			source: Source.Mastodon_Rest,
			label: 'Mastodon REST',
		},
	],
	bindings: bindings[Source.Mastodon_Rest],
} satisfies SourceProviderDefinition
