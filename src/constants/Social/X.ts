// Types
import type { EntitySelector } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'


// Constants
export const xNetworkFieldValues = {
	docsUrl: 'https://developer.x.com',
	homeUrl: 'https://x.com',
	protocolName: 'X (API v2)',
	registryLabel: 'Curated seed users + live user timelines',
	topology: 'Constants seeds + live REST -> network -> users -> posts',
} as const

/** User `id` is X’s string user id (REST `id` / `id_str`), not @handle. */
export const xNetworkSeedUsers: readonly EntitySelector<typeof schema, EntityType.XUser>[] = [
	{ id: '783214' },
]
