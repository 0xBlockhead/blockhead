// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.QuilibriumAccount,
	labels: {
		singular: 'quilibrium account',
		plural: 'quilibrium accounts',
	},
})({
	$network: {
		label: 'network',
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	accountAddress: {
		label: 'account address',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	accountKind: {
		label: 'account kind',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$blockheadAccountStates: {
		label: 'blockhead account states',
		entityType: EntityType.BlockheadQuilibriumAccountState,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		NetworkAccountAddress: [
			'$network',
			'accountAddress',
		],
	},
})
