// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ZeroExHex } from '$/schema/ZeroExHex.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.GitForgeCompare,
	labels: {
		singular: 'Git forge compare',
		plural: 'Git forge compares',
	},
})({
	$forgeMirror: {
		entityType: EntityType.GitForgeMirror,
		cardinality: EntityFieldCardinality.One,
	},
	fromObjectId: {
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.One,
	},
	toObjectId: {
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.One,
	},
	$fromCommit: {
		entityType: EntityType.GitCommit,
		cardinality: EntityFieldCardinality.One,
	},
	$toCommit: {
		entityType: EntityType.GitCommit,
		cardinality: EntityFieldCardinality.One,
	},
	sameRef: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.One,
	},
	timedOut: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.One,
	},
	$$commits: {
		entityType: EntityType.GitCommit,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Gitlab_Rest,
		],
	},
	$$fileChanges: {
		entityType: EntityType.GitForgeCompareFileChange,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Gitlab_Rest,
		],
	},
})({
	selectors: {
		ForgeMirrorFromObjectIdToObjectId: [
			'$forgeMirror',
			'fromObjectId',
			'toObjectId',
		],
	},
})
