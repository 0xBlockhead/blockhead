// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum DogecoinAuxPowMerkleBranchSelector {
	AuxPowBranchKind = 'AuxPowBranchKind',
}
export default {
	entityType: EntityType.DogecoinAuxPowMerkleBranch,
	label: 'dogecoin aux pow merkle branch',
	labelPlural: 'dogecoin aux pow merkle branches',
	selectors: [
		{
			name: DogecoinAuxPowMerkleBranchSelector.AuxPowBranchKind,
			fields: [
				'$auxPow',
				'branchKind',
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
				name: 'branchKind',
				label: 'Branch kind',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'branchHashes',
				label: 'Branch hashes',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: 'index',
				label: 'Index',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
