// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum DogecoinBlockAuxPowSelector {
	Block = 'Block',
}
export default {
	entityType: EntityType.DogecoinBlockAuxPow,
	label: 'dogecoin block aux pow',
	labelPlural: 'dogecoin block aux pows',
	selectors: [
		{
			name: DogecoinBlockAuxPowSelector.Block,
			fields: [
				'$block',
			],
		},
	],
	fields: [
		{
				name: '$block',
				label: 'Block',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.UtxoBlock,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: '$parentBlockHeader',
				label: 'Parent block header',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.DogecoinAuxPowParentBlockHeader,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$coinbaseBranch',
				label: 'Coinbase branch',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.DogecoinAuxPowMerkleBranch,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$chainBranch',
				label: 'Chain branch',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.DogecoinAuxPowMerkleBranch,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
