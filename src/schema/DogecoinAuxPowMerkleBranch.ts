// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.DogecoinAuxPowMerkleBranch,
	labels: {
		singular: 'dogecoin aux pow merkle branch',
		plural: 'dogecoin aux pow merkle branches',
	},
})({
	$auxPow: {
		entityType: EntityType.DogecoinBlockAuxPow,
		cardinality: EntityFieldCardinality.One,
	},
	branchKind: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	branchHashes: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
	},
	index: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		AuxPowBranchKind: [
			'$auxPow',
			'branchKind',
		],
	},
})
