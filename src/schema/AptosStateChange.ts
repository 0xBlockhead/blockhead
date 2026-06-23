import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum AptosStateChangeSelector {
	TransactionChangeIndex = '$transaction+changeIndex',
}
export default {
	entityType: EntityType.AptosStateChange,
	label: 'aptos state change',
	labelPlural: 'aptos state changes',
	selectors: [
		{
			name: AptosStateChangeSelector.TransactionChangeIndex,
			fields: [
				'$transaction',
				'changeIndex',
			],
		},
	],
	fields: [
		{
			name: '$transaction',
			label: 'transaction',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.AptosTransaction,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'changeIndex',
			label: 'change index',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'changeKind',
			label: 'change kind',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'address',
			label: 'Address',
			description: 'The address or account identifier used by the source protocol.',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'stateKeyHash',
			label: 'state key hash',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'resourceType',
			label: 'resource type',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'moduleAddress',
			label: 'module address',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'moduleName',
			label: 'module name',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$resource',
			label: 'resource',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.AptosAccountResource,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$module',
			label: 'module',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.MoveModule,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'value',
			label: 'Value',
			description: 'The source-domain value.',
			type: EntityFieldType.Primitive,
			primitiveType: type("unknown"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
