// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.GitForgeProtectedBranch,
	labels: {
		singular: 'Git forge protected branch',
		plural: 'Git forge protected branches',
	},
})({
	$forgeMirror: {
		entityType: EntityType.GitForgeMirror,
		cardinality: EntityFieldCardinality.One,
	},
	name: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	providerProtectedBranchId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	pushAccessDescriptions: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
	},
	mergeAccessDescriptions: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
	},
	unprotectAccessDescriptions: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
	},
	allowForcePush: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.One,
	},
	codeOwnerApprovalRequired: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.One,
	},
	inherited: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		ForgeMirrorName: [
			'$forgeMirror',
			'name',
		],
	},
})
