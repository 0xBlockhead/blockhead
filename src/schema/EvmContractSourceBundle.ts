// Generated from APP.ts. Do not edit by hand.

import { entity, facet } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum EvmContractSourceBundleSelector {
	EvmContract = 'EvmContract',
}
export const EvmContractSourceBundle = entity({
	entityType: EntityType.EvmContractSourceBundle,
	labels: {
		singular: 'EVM contract source bundle',
		plural: 'EVM contract source bundles',
	},
})({
	$contract: {
		label: 'Contract',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.EvmContract,
		cardinality: EntityFieldCardinality.One,
	},
	files: {
		label: 'Files',
		type: EntityFieldType.Primitive,
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.One,
	},
})({
	selectors: {
		EvmContract: [
			'$contract',
		],
	},
})
