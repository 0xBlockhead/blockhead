// Types
import type { EntityId } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { schema } from '$/schema/index.ts'


// Constants
export const atprotoNetworkFieldValues = {
	docsUrl: 'https://atproto.com/specs/atp',
	homeUrl: 'https://atproto.com',
	protocolName: 'AT Protocol (Bluesky / appviews)',
	registryLabel: 'Curated seed actors + public appview feeds',
	topology: 'network -> actors -> posts',
} as const

export const atprotoNetworkSeedActors: readonly EntityId<typeof schema, EntityType.AtprotoActor>[] = [
	{
		did: 'did:plc:z72i7hdynmk6r22z27h6tvur',
	},
]
