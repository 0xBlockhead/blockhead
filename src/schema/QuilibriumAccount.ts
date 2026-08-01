// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
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
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	accountAddress: {
		label: 'account address',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	accountKind: {
		label: 'account kind',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$blockheadAccountStates: {
		label: 'blockhead account states',
		type: EntityFieldType.EntitiesReference,
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
