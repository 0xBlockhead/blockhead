// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ZeroExHex } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.GitPackedObject,
	labels: {
		singular: 'Git packed object',
		plural: 'Git packed objects',
	},
})({
	packHash: {
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.One,
	},
	objectId: {
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.One,
	},
	objectFormat: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	offset: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	deltaBaseObjectId: {
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	storedKind: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$packfile: {
		entityType: EntityType.GitPackfile,
		cardinality: EntityFieldCardinality.One,
	},
	$object: {
		entityType: EntityType.GitObject,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		PackHashObjectIdObjectFormat: [
			'packHash',
			'objectId',
			'objectFormat',
		],
	},
})
