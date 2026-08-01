// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
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
		entityType: EntityType.AlgorandNetwork,
		cardinality: EntityFieldCardinality.One,
	},
	group: {
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.One,
	},
	$$transactions: {
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
