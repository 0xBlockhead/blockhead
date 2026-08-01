// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.SorobanContractStorageEntry,
	labels: {
		singular: 'soroban contract storage entry',
		plural: 'soroban contract storage entries',
	},
})({
	$contract: {
		label: 'contract',
		entityType: EntityType.SorobanContract,
		cardinality: EntityFieldCardinality.One,
	},
	keyHash: {
		label: 'key hash',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	key: {
		label: 'key',
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'timestamps',
		entityType: EntityType.SorobanContractStorageEntry_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		ContractKeyHash: [
			'$contract',
			'keyHash',
		],
	},
})
