// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ZeroExHex } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.GitPackfile,
	labels: {
		singular: 'Git packfile',
		plural: 'Git packfiles',
	},
})({
	packHash: {
		label: 'pack hash',
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
	objectCount: {
		label: 'object count',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	packSizeBytes: {
		label: 'pack size bytes',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	indexHash: {
		label: 'index hash',
		type: EntityFieldType.Primitive,
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$repository: {
		label: 'repository',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.GitRepository,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		PackHash: [
			'packHash',
		],
	},
})
