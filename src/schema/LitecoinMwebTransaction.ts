import { type } from 'arktype'

import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import MwebBlock from '$/schema/LitecoinMwebBlock.ts'

export default {
	entityType: EntityType.LitecoinMwebTransaction,

	label: 'Litecoin MWEB Transaction',
	labelPlural: 'Litecoin MWEB Transactions',

	id: type({
		$mwebBlock: MwebBlock.id,
		transactionIndex: 'number',
	}),

	fields: [
		{
			name: 'kernelOffset',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$outputs',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.LitecoinMwebOutput,
			cardinality: EntityFieldCardinality.ZeroOrMany,
		},
		{
			name: '$$pegIns',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.LitecoinMwebPegIn,
			cardinality: EntityFieldCardinality.ZeroOrMany,
		},
		{
			name: '$$pegOuts',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.LitecoinMwebPegOut,
			cardinality: EntityFieldCardinality.ZeroOrMany,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
