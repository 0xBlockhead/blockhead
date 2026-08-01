// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ZeroExHex } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.GitRefUpdate,
	labels: {
		singular: 'Git ref update',
		plural: 'Git ref updates',
	},
})({
	$repository: {
		entityType: EntityType.GitRepository,
		cardinality: EntityFieldCardinality.One,
	},
	refName: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	oldObjectId: {
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.One,
	},
	newObjectId: {
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.One,
	},
	updateKind: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	actorSelector: {
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	timestampMs: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$signature: {
		entityType: EntityType.GitSignature,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	source: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		RepositoryRefNameOldObjectIdNewObjectId: [
			'$repository',
			'refName',
			'oldObjectId',
			'newObjectId',
		],
	},
})
