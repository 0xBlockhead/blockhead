// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum NearActionSelector {
	NearTransactionActionIndex = 'NearTransactionActionIndex',
}
export default {
	entityType: EntityType.NearAction,
	label: 'near action',
	labelPlural: 'near actions',
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
			label: 'Transaction',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.NearTransaction,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'actionIndex',
			label: 'Action index',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'actionKind',
			label: 'Action kind',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
			defaultSources: [
				Source.NearRpc_JsonRpc,
			],
		},
		{
			name: 'methodName',
			label: 'Method name',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.NearRpc_JsonRpc,
			],
		},
		{
			name: 'depositYoctoNear',
			label: 'Deposit yocto near',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.NearRpc_JsonRpc,
			],
		},
	],
} as const satisfies EntityDefinition
