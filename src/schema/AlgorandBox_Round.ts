// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ZeroExHex } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export enum AlgorandBox_RoundSelector {
	BoxRoundSource = 'BoxRoundSource',
}
export const AlgorandBox_Round = entity({
	entityType: EntityType.AlgorandBox_Round,
	labels: {
		singular: 'algorand box round',
		plural: 'algorand box rounds',
	},
})({
	$box: {
		label: 'box',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.AlgorandBox,
		cardinality: EntityFieldCardinality.One,
	},
	round: {
		label: 'round',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		description: 'The source that produced this observation.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	value: {
		label: 'Value',
		description: 'The source-domain value.',
		type: EntityFieldType.Primitive,
		primitiveType: (ZeroExHex),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	valueHash: {
		label: 'value hash',
		type: EntityFieldType.Primitive,
		primitiveType: (ZeroExHex),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	deleted: {
		label: 'deleted',
		type: EntityFieldType.Primitive,
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
