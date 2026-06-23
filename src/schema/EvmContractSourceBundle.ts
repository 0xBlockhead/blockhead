import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum EvmContractSourceBundleSelector {
	EvmContract = 'evmContract',
	Contract = '$contract',
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
			label: 'contract',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmContract,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'files',
			label: 'files',
			type: EntityFieldType.Primitive,
			primitiveType: type("unknown"),
			cardinality: EntityFieldCardinality.One,
		},
	],
} as const satisfies EntityDefinition
