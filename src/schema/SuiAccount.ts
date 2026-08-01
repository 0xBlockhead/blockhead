// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.SuiAccount,
	labels: {
		singular: 'sui account',
		plural: 'sui accounts',
	},
})({
	$network: {
		label: 'network',
		entityType: EntityType.SuiNetwork,
		cardinality: EntityFieldCardinality.One,
	},
	address: {
		label: 'Address',
		description: 'The address or account identifier used by the source protocol.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$$balances: {
		label: 'balances',
		entityType: EntityType.SuiCoinBalance_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$objects: {
		label: 'objects',
		entityType: EntityType.SuiObject,
		cardinality: EntityFieldCardinality.Many,
	},
	$$transactions: {
		label: 'transactions',
		entityType: EntityType.SuiTransaction,
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
