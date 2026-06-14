import { type } from 'arktype'

import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'

export enum NearActionSelector {
	NearTransactionActionIndex = 'nearTransactionActionIndex',
}

export default {
	entityType: EntityType.NearAction,

	label: 'NEAR Action',
	labelPlural: 'NEAR Actions',

	selectors: [
		{
			name: NearActionSelector.NearTransactionActionIndex,
			fields: [
				'$transaction',
				'actionIndex',
			],
		},
	],

	fields: [
		{
			name: '$transaction',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.NearTransaction,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'actionIndex',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'actionKind',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'methodName',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'depositYoctoNear',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
