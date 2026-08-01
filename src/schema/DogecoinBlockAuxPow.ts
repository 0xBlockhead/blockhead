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
		label: 'Block',
		entityType: EntityType.UtxoBlock,
		cardinality: EntityFieldCardinality.One,
	},
	$parentBlockHeader: {
		label: 'Parent block header',
		entityType: EntityType.DogecoinAuxPowParentBlockHeader,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$coinbaseBranch: {
		label: 'Coinbase branch',
		entityType: EntityType.DogecoinAuxPowMerkleBranch,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$chainBranch: {
		label: 'Chain branch',
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
