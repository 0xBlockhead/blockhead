// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.CosmosContract,
	labels: {
		singular: 'Cosmos contract',
		plural: 'Cosmos contracts',
	},
})({
	$network: {
		label: 'Network',
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	address: {
		label: 'Address',
		description: 'The address or account identifier used by the source protocol.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	codeId: {
		label: 'Code ID',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$creator: {
		label: 'Creator',
		entityType: EntityType.CosmosAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$admin: {
		label: 'Admin',
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
