// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.TonContractGetMethod,
	labels: {
		singular: 'ton contract get method',
		plural: 'ton contract get methods',
	},
})({
	$contract: {
		entityType: EntityType.TonContract,
		cardinality: EntityFieldCardinality.One,
	},
	methodName: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$$timestamps: {
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
