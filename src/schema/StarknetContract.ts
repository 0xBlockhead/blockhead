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
		label: 'network',
		entityType: EntityType.StarknetNetwork,
		cardinality: EntityFieldCardinality.One,
	},
	address: {
		label: 'Address',
		description: 'The address or account identifier used by the source protocol.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$$accountStates: {
		label: 'account states',
		entityType: EntityType.StarknetAccount_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$storage: {
		label: 'storage',
		entityType: EntityType.StarknetStorageEntry,
		cardinality: EntityFieldCardinality.Many,
	},
	$$events: {
		label: 'events',
		entityType: EntityType.StarknetEvent,
		cardinality: EntityFieldCardinality.Many,
	},
	$$transactions: {
		label: 'transactions',
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
