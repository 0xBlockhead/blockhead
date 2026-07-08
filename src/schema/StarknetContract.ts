// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum StarknetContractSelector {
	NetworkAddress = 'NetworkAddress',
}
export const StarknetContract = entity({
	entityType: EntityType.StarknetContract,
	label: 'starknet contract',
	labelPlural: 'starknet contracts',
})({
	$network: {
		label: 'network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.StarknetNetwork,
		cardinality: EntityFieldCardinality.One,
	},
	address: {
		label: 'Address',
		description: 'The address or account identifier used by the source protocol.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$$accountStates: {
		label: 'account states',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.StarknetAccount_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$storage: {
		label: 'storage',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.StarknetStorageEntry,
		cardinality: EntityFieldCardinality.Many,
	},
	$$events: {
		label: 'events',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.StarknetEvent,
		cardinality: EntityFieldCardinality.Many,
	},
	$$transactions: {
		label: 'transactions',
		type: EntityFieldType.EntitiesReference,
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
