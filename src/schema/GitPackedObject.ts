// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
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
		type: EntityFieldType.Primitive,
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.One,
	},
	objectId: {
		label: 'object ID',
		type: EntityFieldType.Primitive,
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.One,
	},
	objectFormat: {
		label: 'object format',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	offset: {
		label: 'offset',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	deltaBaseObjectId: {
		label: 'delta base object ID',
		type: EntityFieldType.Primitive,
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	storedKind: {
		label: 'stored kind',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$packfile: {
		label: 'packfile',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.GitPackfile,
		cardinality: EntityFieldCardinality.One,
	},
	$object: {
		label: 'object',
		type: EntityFieldType.EntityReference,
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
