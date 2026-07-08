// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum SorobanContractStorageEntrySelector {
	ContractKeyHash = 'ContractKeyHash',
}
export const SorobanContractStorageEntry = entity({
	entityType: EntityType.SorobanContractStorageEntry,
	label: 'soroban contract storage entry',
	labelPlural: 'soroban contract storage entries',
})({
	$contract: {
		label: 'contract',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.SorobanContract,
		cardinality: EntityFieldCardinality.One,
	},
	keyHash: {
		label: 'key hash',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	key: {
		label: 'key',
		type: EntityFieldType.Primitive,
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'timestamps',
		type: EntityFieldType.EntitiesReference,
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
