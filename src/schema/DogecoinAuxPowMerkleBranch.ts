import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum DogecoinAuxPowMerkleBranchSelector {
	DogecoinBlockAuxPowBranchKind = 'dogecoinBlockAuxPowBranchKind',
	AuxPowBranchKind = '$auxPow+branchKind',
}
export default {
	entityType: EntityType.DogecoinAuxPowMerkleBranch,
	label: 'dogecoin aux pow merkle branch',
	labelPlural: 'dogecoin aux pow merkle branches',
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
			label: 'aux pow',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.DogecoinBlockAuxPow,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'branchKind',
			label: 'branch kind',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'branchHashes',
			label: 'branch hashes',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: 'index',
			label: 'index',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
