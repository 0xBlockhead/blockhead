// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ZeroExHex } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.GitBlob,
	labels: {
		singular: 'Git blob',
		plural: 'Git blobs',
	},
})({
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
	$object: {
		label: 'object',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.GitObject,
		cardinality: EntityFieldCardinality.One,
	},
	mime: {
		label: 'mime',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	byteSize: {
		label: 'byte size',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	textSample: {
		label: 'text sample',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$paths: {
		label: 'paths',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.GitTreeEntry,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		ObjectIdObjectFormat: [
			'objectId',
			'objectFormat',
		],
	},
})
