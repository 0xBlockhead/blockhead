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
		label: 'network',
		entityType: EntityType.AlgorandNetwork,
		cardinality: EntityFieldCardinality.One,
	},
	group: {
		label: 'group',
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.One,
	},
	$$transactions: {
		label: 'transactions',
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
