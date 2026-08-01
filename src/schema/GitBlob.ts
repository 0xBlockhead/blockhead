// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
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
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.One,
	},
	objectFormat: {
		label: 'object format',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$object: {
		label: 'object',
		entityType: EntityType.GitObject,
		cardinality: EntityFieldCardinality.One,
	},
	mime: {
		label: 'mime',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	byteSize: {
		label: 'byte size',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	textSample: {
		label: 'text sample',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$paths: {
		label: 'paths',
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
