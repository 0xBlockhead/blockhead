// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ZeroExHex } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.AlgorandBox_Round,
	labels: {
		singular: 'algorand box round',
		plural: 'algorand box rounds',
	},
})({
	$box: {
		label: 'box',
		entityType: EntityType.AlgorandBox,
		cardinality: EntityFieldCardinality.One,
	},
	round: {
		label: 'round',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		description: 'The source that produced this observation.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	value: {
		label: 'Value',
		description: 'The native asset amount transferred by the call frame.',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	valueHash: {
		label: 'value hash',
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	deleted: {
		label: 'deleted',
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
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
