// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum TonContractGetMethodSelector {
	ContractMethodName = 'ContractMethodName',
}
export default {
	entityType: EntityType.TonContractGetMethod,
	label: 'ton contract get method',
	labelPlural: 'ton contract get methods',
	selectors: [
		{
			name: TonContractGetMethodSelector.ContractMethodName,
			fields: [
				'$contract',
				'methodName',
			],
		},
	],
	fields: [
		{
			name: '$contract',
			label: 'contract',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.TonContract,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'methodName',
			label: 'method name',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.TonContractGetMethod_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
