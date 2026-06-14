import { type } from 'arktype'

import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'

export enum DogecoinAuxPowParentBlockHeaderSelector {
	DogecoinBlockAuxPow = 'dogecoinBlockAuxPow',
}

export default {
	entityType: EntityType.DogecoinAuxPowParentBlockHeader,

	label: 'Dogecoin AuxPoW Parent Header',
	labelPlural: 'Dogecoin AuxPoW Parent Headers',

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
			type: EntityFieldType.EntityReference,
			entityType: EntityType.DogecoinBlockAuxPow,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'hash',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'merkleRoot',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'nonce',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
