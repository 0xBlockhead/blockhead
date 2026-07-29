// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
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
		type: EntityFieldType.EntityReference,
		entityType: EntityType.TonAccount,
		cardinality: EntityFieldCardinality.One,
	},
	$$timestamps: {
		label: 'timestamps',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.TonContract_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$getMethods: {
		label: 'get methods',
		type: EntityFieldType.EntitiesReference,
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
