// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.DogecoinBlockAuxPow,
	labels: {
		singular: 'dogecoin block aux pow',
		plural: 'dogecoin block aux pows',
	},
})({
	$block: {
		entityType: EntityType.UtxoBlock,
		cardinality: EntityFieldCardinality.One,
	},
	$parentBlockHeader: {
		entityType: EntityType.DogecoinAuxPowParentBlockHeader,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$coinbaseBranch: {
		entityType: EntityType.DogecoinAuxPowMerkleBranch,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$chainBranch: {
		entityType: EntityType.DogecoinAuxPowMerkleBranch,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		Block: [
			'$block',
		],
	},
})
