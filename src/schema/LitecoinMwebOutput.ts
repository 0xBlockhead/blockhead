import { type } from 'arktype'

import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'

export enum LitecoinMwebOutputSelector {
	LitecoinMwebTransactionOutputIndex = 'litecoinMwebTransactionOutputIndex',
}

export default {
	entityType: EntityType.LitecoinMwebOutput,

	label: 'Litecoin MWEB Output',
	labelPlural: 'Litecoin MWEB Outputs',

	selectors: [
		{
			name: LitecoinMwebOutputSelector.LitecoinMwebTransactionOutputIndex,
			fields: [
				'$transaction',
				'outputIndex',
			],
		},
	],

	fields: [
		{
			name: '$transaction',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.LitecoinMwebTransaction,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'outputIndex',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'commitment',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'senderPubkey',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
