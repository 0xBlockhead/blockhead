// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ZeroExHex } from '$/schema/ZeroExHex.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.AlgorandBox_Round,
	labels: {
		singular: 'algorand box round',
		plural: 'algorand box rounds',
	},
})({
	$box: {
		entityType: EntityType.AlgorandBox,
		cardinality: EntityFieldCardinality.One,
	},
	round: {
		primitiveType: type('bigint').narrow((value) => value >= 0n),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	value: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	valueHash: {
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Nodely,
		],
	},
	deleted: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Nodely,
		],
	},
})({
	selectors: {
		BoxRoundSource: [
			'$box',
			'round',
			'source',
		],
	},
})
