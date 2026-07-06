// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum DogecoinAuxPowParentBlockHeaderSelector {
	AuxPow = 'AuxPow',
}
export default {
	entityType: EntityType.DogecoinAuxPowParentBlockHeader,
	label: 'dogecoin aux pow parent block header',
	labelPlural: 'dogecoin aux pow parent block headers',
	selectors: [
		{
			name: DogecoinAuxPowParentBlockHeaderSelector.AuxPow,
			fields: [
				'$auxPow',
			],
		},
	],
	fields: [
		{
			name: '$auxPow',
			label: 'AuxPoW',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.DogecoinBlockAuxPow,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'hash',
			label: 'Hash',
			description: 'The hash that identifies this object in its protocol.',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'merkleRoot',
			label: 'Merkle root',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'nonce',
			label: 'Nonce',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
