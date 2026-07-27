// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
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
		type: EntityFieldType.EntityReference,
		entityType: EntityType.StarknetContract,
		cardinality: EntityFieldCardinality.One,
	},
	storageKey: {
		label: 'storage key',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$$timestamps: {
		label: 'timestamps',
		type: EntityFieldType.EntitiesReference,
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
