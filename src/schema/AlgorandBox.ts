// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ZeroExHex } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.AlgorandBox,
	labels: {
		singular: 'algorand box',
		plural: 'algorand boxes',
	},
})({
	$application: {
		label: 'application',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.AlgorandApplication,
		cardinality: EntityFieldCardinality.One,
	},
	boxName: {
		label: 'box name',
		type: EntityFieldType.Primitive,
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.One,
	},
	$$rounds: {
		label: 'rounds',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.AlgorandBox_Round,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		ApplicationBoxName: [
			'$application',
			'boxName',
		],
	},
})
