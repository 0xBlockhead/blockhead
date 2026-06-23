import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import {
	mastodonBindings,
	mastodonPublicEnv,
} from '$/sources/Mastodon/bindings.ts'

export const mastodonOrigins = [
	...new Map(
		mastodonBindings
			.flatMap((binding) => binding.endpoints)
			.map((endpoint) => [
				endpoint.origin,
				{
					origin: endpoint.origin,
					corsEnabled: endpoint.corsEnabled,
				},
			])
	).values(),
]

export default {
	provider: SourceProvider.Mastodon,
	label: 'Mastodon',
	env: mastodonPublicEnv,
	sources: [
		{
			provider: SourceProvider.Mastodon,
			source: Source.Mastodon_Rest,
			label: 'Mastodon REST',
			env: mastodonPublicEnv,
		},
	],
	bindings: mastodonBindings,
} satisfies SourceProviderDefinition
