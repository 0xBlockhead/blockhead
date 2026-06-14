// Types
import type { EntitySelector } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'


// Constants
export const lensNetworkFieldValues = {
	docsUrl: 'https://docs.lens.xyz',
	homeUrl: 'https://lens.xyz',
	protocolName: 'Lens',
	registryLabel: 'Curated seed accounts + GraphQL author feeds',
	topology: 'Constants seeds + live GraphQL -> network -> accounts -> posts',
} as const

export const lensNetworkSeedAccounts: readonly EntitySelector<typeof schema, EntityType.LensAccount>[] = [
	{
		address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
	},
]
