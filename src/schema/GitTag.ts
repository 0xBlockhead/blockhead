// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ZeroExHex } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.GitTag,
	labels: {
		singular: 'Git tag',
		plural: 'Git tags',
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
	targetObjectId: {
		label: 'target object ID',
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.One,
	},
	targetKind: {
		label: 'target kind',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	tagName: {
		label: 'tag name',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	taggerSelector: {
		label: 'tagger selector',
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	taggerTimestampMs: {
		label: 'tagger timestamp ms',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	message: {
		label: 'message',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$signatures: {
		label: 'signatures',
		entityType: EntityType.GitSignature,
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
