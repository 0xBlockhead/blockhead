// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum TonContractGetMethodSelector {
	ContractMethodName = 'ContractMethodName',
}
export const TonContractGetMethod = entity({
	entityType: EntityType.TonContractGetMethod,
	label: 'ton contract get method',
	labelPlural: 'ton contract get methods',
})({
	$contract: {
		label: 'contract',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.TonContract,
		cardinality: EntityFieldCardinality.One,
	},
	methodName: {
		label: 'method name',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$$timestamps: {
		label: 'timestamps',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.TonContractGetMethod_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		ContractMethodName: [
			'$contract',
			'methodName',
		],
	},
})
