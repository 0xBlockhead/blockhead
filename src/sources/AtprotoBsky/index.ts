import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { atprotoBskyBindings } from '$/sources/AtprotoBsky/bindings.ts'

export const atprotoBskyOrigins = [
	...new Map(
		atprotoBskyBindings
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
	provider: SourceProvider.AtprotoBsky,
	label: 'ATProto (Bsky public appview)',
	sources: [
		{
			provider: SourceProvider.AtprotoBsky,
			source: Source.Atproto_Xrpc,
			label: 'ATProto XRPC',
		},
	],
	bindings: atprotoBskyBindings,
} satisfies SourceProviderDefinition
