import { type } from 'arktype'

import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'

export enum DogecoinAuxPowMerkleBranchSelector {
	DogecoinBlockAuxPowBranchKind = 'dogecoinBlockAuxPowBranchKind',
}

export default {
	entityType: EntityType.DogecoinAuxPowMerkleBranch,

	label: 'Dogecoin AuxPoW Merkle Branch',
	labelPlural: 'Dogecoin AuxPoW Merkle Branches',

	selectors: [
		{
			name: DogecoinAuxPowMerkleBranchSelector.DogecoinBlockAuxPowBranchKind,
			fields: [
				'$auxPow',
				'branchKind',
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
			name: 'branchKind',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'branchHashes',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrMany,
		},
		{
			name: 'index',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
