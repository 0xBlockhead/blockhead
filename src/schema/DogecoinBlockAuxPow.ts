import { type } from 'arktype'

import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import UtxoBlock from '$/schema/UtxoBlock.ts'

export enum DogecoinBlockAuxPowSelector {
	UtxoBlock = 'utxoBlock',
}

export default {
	entityType: EntityType.DogecoinBlockAuxPow,

	label: 'Dogecoin AuxPoW',
	labelPlural: 'Dogecoin AuxPoW Records',

	selectors: [
		{
			name: DogecoinBlockAuxPowSelector.UtxoBlock,
			fields: [
				'$block',
			],
		},
	],

	fields: [
		{
			name: '$block',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.UtxoBlock,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$parentBlockHeader',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.DogecoinAuxPowParentBlockHeader,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$coinbaseBranch',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.DogecoinAuxPowMerkleBranch,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$chainBranch',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.DogecoinAuxPowMerkleBranch,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
