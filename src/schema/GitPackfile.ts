// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
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
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.One,
	},
	objectFormat: {
		label: 'object format',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	objectCount: {
		label: 'object count',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	packSizeBytes: {
		label: 'pack size bytes',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	indexHash: {
		label: 'index hash',
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$repository: {
		label: 'repository',
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
