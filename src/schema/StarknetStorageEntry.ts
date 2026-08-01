// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.StarknetStorageEntry,
	labels: {
		singular: 'starknet storage entry',
		plural: 'starknet storage entries',
	},
})({
	$contract: {
		label: 'contract',
		entityType: EntityType.StarknetContract,
		cardinality: EntityFieldCardinality.One,
	},
	storageKey: {
		label: 'storage key',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$$timestamps: {
		label: 'timestamps',
		entityType: EntityType.StarknetStorageEntry_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		ContractStorageKey: [
			'$contract',
			'storageKey',
		],
	},
})
