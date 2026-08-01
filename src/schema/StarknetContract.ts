// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.StarknetContract,
	labels: {
		singular: 'starknet contract',
		plural: 'starknet contracts',
	},
})({
	$network: {
		entityType: EntityType.StarknetNetwork,
		cardinality: EntityFieldCardinality.One,
	},
	address: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$$accountStates: {
		entityType: EntityType.StarknetAccount_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$storage: {
		entityType: EntityType.StarknetStorageEntry,
		cardinality: EntityFieldCardinality.Many,
	},
	$$events: {
		entityType: EntityType.StarknetEvent,
		cardinality: EntityFieldCardinality.Many,
	},
	$$transactions: {
		entityType: EntityType.StarknetTransaction,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		NetworkAddress: [
			'$network',
			'address',
		],
	},
})
