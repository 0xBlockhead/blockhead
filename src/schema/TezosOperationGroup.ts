// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum TezosOperationGroupSelector {
	NetworkOperationHash = 'NetworkOperationHash',
}
export default {
	entityType: EntityType.TezosOperationGroup,
	label: 'tezos operation group',
	labelPlural: 'tezos operation groups',
	selectors: [
		{
			name: TezosOperationGroupSelector.NetworkOperationHash,
			fields: [
				'$network',
				'operationHash',
			],
		},
	],
	fields: [
		{
				name: '$network',
				label: 'network',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.TezosNetwork,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'operationHash',
				label: 'operation hash',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: '$block',
				label: 'block',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.TezosBlock,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'branch',
				label: 'branch',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'signature',
				label: 'signature',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'validationPass',
				label: 'validation pass',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'operationCount',
				label: 'operation count',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$operations',
				label: 'operations',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.TezosOperation,
				cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
