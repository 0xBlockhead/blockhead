// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
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
		type: EntityFieldType.EntityReference,
		entityType: EntityType.UtxoBlock,
		cardinality: EntityFieldCardinality.One,
	},
	$parentBlockHeader: {
		label: 'Parent block header',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.DogecoinAuxPowParentBlockHeader,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$coinbaseBranch: {
		label: 'Coinbase branch',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.DogecoinAuxPowMerkleBranch,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$chainBranch: {
		label: 'Chain branch',
		type: EntityFieldType.EntityReference,
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
