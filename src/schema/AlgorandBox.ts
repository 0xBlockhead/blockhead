// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ZeroExHex } from '$/schema/ZeroExHex.ts'

export default entity({
	entityType: EntityType.AlgorandBox,
	labels: {
		singular: 'algorand box',
		plural: 'algorand boxes',
	},
})({
	$application: {
		entityType: EntityType.AlgorandApplication,
		cardinality: EntityFieldCardinality.One,
	},
	boxName: {
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.One,
	},
	$$rounds: {
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
