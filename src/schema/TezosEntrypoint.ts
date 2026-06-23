import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum TezosEntrypointSelector {
	ContractEntrypointName = '$contract+entrypointName',
}
export default {
	entityType: EntityType.TezosEntrypoint,
	label: 'tezos entrypoint',
	labelPlural: 'tezos entrypoints',
	selectors: [
		{
			name: TezosEntrypointSelector.ContractEntrypointName,
			fields: [
				'$contract',
				'entrypointName',
			],
		},
	],
	fields: [
		{
			name: '$contract',
			label: 'contract',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.TezosContract,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'entrypointName',
			label: 'entrypoint name',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'parameterType',
			label: 'parameter type',
			type: EntityFieldType.Primitive,
			primitiveType: type("unknown"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'annotations',
			label: 'annotations',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
