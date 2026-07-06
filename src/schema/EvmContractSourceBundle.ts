// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum EvmContractSourceBundleSelector {
	EvmContract = 'EvmContract',
}
export default {
	entityType: EntityType.EvmContractSourceBundle,
	label: 'EVM contract source bundle',
	labelPlural: 'EVM contract source bundles',
	selectors: [
		{
			name: EvmContractSourceBundleSelector.EvmContract,
			fields: [
				'$contract',
			],
		},
	],
	fields: [
		{
			name: '$contract',
			label: 'Contract',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmContract,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'files',
			label: 'Files',
			type: EntityFieldType.Primitive,
			primitiveType: type('unknown'),
			cardinality: EntityFieldCardinality.One,
		},
	],
} as const satisfies EntityDefinition
