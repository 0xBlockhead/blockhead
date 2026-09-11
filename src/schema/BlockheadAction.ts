// Generated from APP.ts.

import { actionContent } from '$/actions/index.ts'
import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Hash32 } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BlockheadAction,
	labels: {
		singular: 'blockhead action',
		plural: 'blockhead actions',
	},
})({
	id: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	content: {
		primitiveType: actionContent,
		cardinality: EntityFieldCardinality.One,
	},
	contentRevisionHash: {
		primitiveType: Hash32,
		cardinality: EntityFieldCardinality.One,
	},
	createdAt: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	updatedAt: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	$$sessionActions: {
		entityType: EntityType.BlockheadSessionAction,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		Id: [
			'id',
		],
	},
})
