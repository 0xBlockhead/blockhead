import { type } from 'arktype'

import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'

export enum MoneroStealthOutputSelector {
	MoneroTransactionOutputIndex = 'moneroTransactionOutputIndex',
}

export default {
	entityType: EntityType.MoneroStealthOutput,

	label: 'Monero Stealth Output',
	labelPlural: 'Monero Stealth Outputs',

	selectors: [
		{
			name: MoneroStealthOutputSelector.MoneroTransactionOutputIndex,
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
			entityType: EntityType.MoneroTransaction,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'outputIndex',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'publicKey',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'commitment',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
