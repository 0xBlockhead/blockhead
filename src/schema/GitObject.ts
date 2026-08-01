// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ZeroExHex } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.GitObject,
	labels: {
		singular: 'Git object',
		plural: 'Git objects',
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
	objectKind: {
		label: 'object kind',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	sizeBytes: {
		label: 'size bytes',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$repository: {
		label: 'repository',
		entityType: EntityType.GitRepository,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		ObjectIdObjectFormat: [
			'objectId',
			'objectFormat',
		],
	},
})
