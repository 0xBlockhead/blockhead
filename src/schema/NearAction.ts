import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum NearActionSelector {
	NearTransactionActionIndex = 'nearTransactionActionIndex',
	TransactionActionIndex = '$transaction+actionIndex',
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
			label: 'transaction',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.NearTransaction,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'actionIndex',
			label: 'action index',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'actionKind',
			label: 'action kind',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'methodName',
			label: 'method name',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'depositYoctoNear',
			label: 'deposit yocto near',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
