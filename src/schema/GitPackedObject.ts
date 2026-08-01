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
		label: 'pack hash',
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.One,
	},
	objectId: {
		label: 'object ID',
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.One,
	},
	objectFormat: {
		label: 'object format',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	offset: {
		label: 'offset',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	deltaBaseObjectId: {
		label: 'delta base object ID',
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	storedKind: {
		label: 'stored kind',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$packfile: {
		label: 'packfile',
		entityType: EntityType.GitPackfile,
		cardinality: EntityFieldCardinality.One,
	},
	$object: {
		label: 'object',
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
