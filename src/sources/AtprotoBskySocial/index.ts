import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { atprotoBskySocialBindings } from '$/sources/AtprotoBskySocial/bindings.ts'

export const atprotoBskySocialOrigins = [
	...new Map(
		atprotoBskySocialBindings
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
	provider: SourceProvider.AtprotoBskySocial,
	label: 'ATProto (Bsky social appview)',
	sources: [
		{
			provider: SourceProvider.AtprotoBskySocial,
			source: Source.Atproto_BskySocial_Xrpc,
			label: 'ATProto Bsky Social XRPC',
		},
	],
	bindings: atprotoBskySocialBindings,
} satisfies SourceProviderDefinition
