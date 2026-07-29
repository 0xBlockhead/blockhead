// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
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
	targetObjectId: {
		label: 'target object ID',
		type: EntityFieldType.Primitive,
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.One,
	},
	targetKind: {
		label: 'target kind',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	tagName: {
		label: 'tag name',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	taggerSelector: {
		label: 'tagger selector',
		type: EntityFieldType.Primitive,
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	taggerTimestampMs: {
		label: 'tagger timestamp ms',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	message: {
		label: 'message',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$signatures: {
		label: 'signatures',
		type: EntityFieldType.EntitiesReference,
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
