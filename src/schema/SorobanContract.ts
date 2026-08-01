// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.SorobanContract,
	labels: {
		singular: 'soroban contract',
		plural: 'soroban contracts',
	},
})({
	$network: {
		label: 'network',
		entityType: EntityType.StellarNetwork,
		cardinality: EntityFieldCardinality.One,
	},
	contractId: {
		label: 'contract ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$$timestamps: {
		label: 'timestamps',
		entityType: EntityType.SorobanContract_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$storageEntries: {
		label: 'storage entries',
		entityType: EntityType.SorobanContractStorageEntry,
		cardinality: EntityFieldCardinality.Many,
	},
	$$transactions: {
		label: 'transactions',
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
