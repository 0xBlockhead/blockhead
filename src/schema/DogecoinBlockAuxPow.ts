import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum DogecoinBlockAuxPowSelector {
	UtxoBlock = 'utxoBlock',
	Block = '$block',
}
export default {
	entityType: EntityType.DogecoinBlockAuxPow,
	label: 'dogecoin block aux pow',
	labelPlural: 'dogecoin block aux pows',
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
			label: 'block',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.UtxoBlock,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$parentBlockHeader',
			label: 'parent block header',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.DogecoinAuxPowParentBlockHeader,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$coinbaseBranch',
			label: 'coinbase branch',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.DogecoinAuxPowMerkleBranch,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$chainBranch',
			label: 'chain branch',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.DogecoinAuxPowMerkleBranch,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
