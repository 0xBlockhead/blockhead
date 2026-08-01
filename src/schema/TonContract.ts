// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'

export default entity({
	entityType: EntityType.TonContract,
	labels: {
		singular: 'ton contract',
		plural: 'ton contracts',
	},
})({
	$account: {
		entityType: EntityType.TonAccount,
		cardinality: EntityFieldCardinality.One,
	},
	$$timestamps: {
		entityType: EntityType.TonContract_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$getMethods: {
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
