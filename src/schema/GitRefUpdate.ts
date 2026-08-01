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
		label: 'repository',
		entityType: EntityType.GitRepository,
		cardinality: EntityFieldCardinality.One,
	},
	refName: {
		label: 'ref name',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	oldObjectId: {
		label: 'old object ID',
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.One,
	},
	newObjectId: {
		label: 'new object ID',
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.One,
	},
	updateKind: {
		label: 'update kind',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	actorSelector: {
		label: 'actor selector',
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	timestampMs: {
		label: 'Timestamp',
		description: 'The observation time in Unix milliseconds.',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$signature: {
		label: 'signature',
		entityType: EntityType.GitSignature,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	source: {
		label: 'Source',
		description: 'The source that produced this observation.',
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
