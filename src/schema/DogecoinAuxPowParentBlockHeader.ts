import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum DogecoinAuxPowParentBlockHeaderSelector {
	DogecoinBlockAuxPow = 'dogecoinBlockAuxPow',
	AuxPow = '$auxPow',
}
export default {
	entityType: EntityType.DogecoinAuxPowParentBlockHeader,
	label: 'dogecoin aux pow parent block header',
	labelPlural: 'dogecoin aux pow parent block headers',
	selectors: [
		{
			name: DogecoinAuxPowParentBlockHeaderSelector.DogecoinBlockAuxPow,
			fields: [
				'$auxPow',
			],
		},
	],
	fields: [
		{
			name: '$auxPow',
			label: 'aux pow',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.DogecoinBlockAuxPow,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'hash',
			label: 'Hash',
			description: 'The hash that identifies this object in its protocol.',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'merkleRoot',
			label: 'merkle root',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'nonce',
			label: 'nonce',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
