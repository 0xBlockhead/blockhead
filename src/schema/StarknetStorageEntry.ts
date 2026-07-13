// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum StarknetStorageEntrySelector {
	ContractStorageKey = 'ContractStorageKey',
}
export const StarknetStorageEntry = entity({
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
