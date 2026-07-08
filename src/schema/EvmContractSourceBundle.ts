// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum EvmContractSourceBundleSelector {
	EvmContract = 'EvmContract',
}
export const EvmContractSourceBundle = entity({
	entityType: EntityType.EvmContractSourceBundle,
	label: 'EVM contract source bundle',
	labelPlural: 'EVM contract source bundles',
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
