// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.TonContract,
	labels: {
		singular: 'ton contract',
		plural: 'ton contracts',
	},
})({
	$account: {
		label: 'account',
		entityType: EntityType.TonAccount,
		cardinality: EntityFieldCardinality.One,
	},
	$$timestamps: {
		label: 'timestamps',
		entityType: EntityType.TonContract_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$getMethods: {
		label: 'get methods',
		entityType: EntityType.TonContractGetMethod,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		Account: [
			'$account',
		],
	},
})
