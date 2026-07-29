// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ZeroExHex } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.AlgorandTransactionGroup,
	labels: {
		singular: 'algorand transaction group',
		plural: 'algorand transaction groups',
	},
})({
	$network: {
		label: 'network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.AlgorandNetwork,
		cardinality: EntityFieldCardinality.One,
	},
	group: {
		label: 'group',
		type: EntityFieldType.Primitive,
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.One,
	},
	$$transactions: {
		label: 'transactions',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.AlgorandTransaction,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		NetworkGroup: [
			'$network',
			'group',
		],
	},
})
