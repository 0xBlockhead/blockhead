// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum DogecoinBlockAuxPowSelector {
	Block = 'Block',
}
export const DogecoinBlockAuxPow = entity({
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
