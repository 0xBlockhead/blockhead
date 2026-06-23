import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum ZcashShieldedPoolBlockStateSelector {
	BlockPool = '$block+pool',
}
export default {
	entityType: EntityType.ZcashShieldedPoolBlockState,
	label: 'zcash shielded pool block state',
	labelPlural: 'zcash shielded pool block states',
	selectors: [
		{
			name: ZcashShieldedPoolBlockStateSelector.BlockPool,
			fields: [
				'$block',
				'pool',
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
			name: 'pool',
			label: 'pool',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'finalRoot',
			label: 'final root',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'blockCommitments',
			label: 'block commitments',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
