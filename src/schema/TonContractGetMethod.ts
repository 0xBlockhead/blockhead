// Generated from APP.ts. Do not edit by hand.

import { entity, facet } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum TonContractGetMethodSelector {
	ContractMethodName = 'ContractMethodName',
}
export const TonContractGetMethod = entity({
	entityType: EntityType.TonContractGetMethod,
	labels: {
		singular: 'ton contract get method',
		plural: 'ton contract get methods',
	},
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
