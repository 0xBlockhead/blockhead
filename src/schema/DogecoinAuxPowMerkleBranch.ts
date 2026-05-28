import { type } from 'arktype'

import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import AuxPow from '$/schema/DogecoinBlockAuxPow.ts'

export default {
	entityType: EntityType.DogecoinAuxPowMerkleBranch,

	label: 'Dogecoin AuxPoW Merkle Branch',
	labelPlural: 'Dogecoin AuxPoW Merkle Branches',

	id: type({
		$auxPow: AuxPow.id,
		branchKind: 'string',
	}),

	fields: [
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
