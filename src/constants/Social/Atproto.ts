// Types
import type { EntityId } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'


// Constants
export const atprotoNetworkFieldValues = {
	docsUrl: 'https://atproto.com/specs/atp',
	homeUrl: 'https://atproto.com',
	protocolName: 'AT Protocol (Bluesky / appviews)',
	registryLabel: 'Curated seed actors + public appview feeds',
	topology: 'Constants seeds + live XRPC -> network -> actors -> posts',
} as const

/** Stable Bluesky DID used in E2E probes, smoke routes, and hub examples. */
export const atprotoProbeDid = 'did:plc:z72i7hdynmk6r22z27h6tvur' as const

export const atprotoProbePostUri = (
	'at://did:plc:z72i7hdynmk6r22z27h6tvur/app.bsky.feed.post/3l6oveex3ii2l' as const
)

export const atprotoNetworkSeedActors: readonly EntityId<typeof schema, EntityType.AtprotoActor>[] = [
	{
		did: atprotoProbeDid,
	},
]
