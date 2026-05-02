import type { EntityId } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { schema } from '$/schema/index.ts'

export const xNetworkFieldValues = {
	docsUrl: 'https://developer.x.com',
	homeUrl: 'https://x.com',
	protocolName: 'X (API v2)',
	registryLabel: 'Curated seed users + live user timelines',
	topology: 'network -> users -> posts',
} as const

/** User `id` is X’s string user id (REST `id` / `id_str`), not @handle. */
export const xNetworkSeedUsers: readonly EntityId<typeof schema, EntityType.XUser>[] = [
	{ id: '783214' },
]
