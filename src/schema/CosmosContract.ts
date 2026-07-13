// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum CosmosContractSelector {
	NetworkAddress = 'NetworkAddress',
}
export const CosmosContract = entity({
	entityType: EntityType.CosmosContract,
	labels: {
		singular: 'Cosmos contract',
		plural: 'Cosmos contracts',
	},
})({
	$network: {
		label: 'Network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	address: {
		label: 'Address',
		description: 'The address or account identifier used by the source protocol.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	codeId: {
		label: 'Code ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$creator: {
		label: 'Creator',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.CosmosAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$admin: {
		label: 'Admin',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.CosmosAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		NetworkAddress: [
			'$network',
			'address',
		],
	},
})
