// Generated from APP.ts. Do not edit by hand.

import { entity, facet } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum SorobanContractSelector {
	NetworkContractId = 'NetworkContractId',
}
export const SorobanContract = entity({
	entityType: EntityType.SorobanContract,
	labels: {
		singular: 'soroban contract',
		plural: 'soroban contracts',
	},
})({
	$network: {
		label: 'network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.StellarNetwork,
		cardinality: EntityFieldCardinality.One,
	},
	contractId: {
		label: 'contract ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$$timestamps: {
		label: 'timestamps',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.SorobanContract_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$storageEntries: {
		label: 'storage entries',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.SorobanContractStorageEntry,
		cardinality: EntityFieldCardinality.Many,
	},
	$$transactions: {
		label: 'transactions',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.StellarTransaction,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		NetworkContractId: [
			'$network',
			'contractId',
		],
	},
})
