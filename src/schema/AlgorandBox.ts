// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ZeroExHex } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export enum AlgorandBoxSelector {
	ApplicationBoxName = 'ApplicationBoxName',
}
export const AlgorandBox = entity({
	entityType: EntityType.AlgorandBox,
	label: 'algorand box',
	labelPlural: 'algorand boxes',
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
		primitiveType: (ZeroExHex),
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
