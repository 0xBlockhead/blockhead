// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum TezosOperationGroupSelector {
	NetworkOperationHash = 'NetworkOperationHash',
}
export const TezosOperationGroup = entity({
	entityType: EntityType.TezosOperationGroup,
	labels: {
		singular: 'tezos operation group',
		plural: 'tezos operation groups',
	},
})({
	$network: {
		label: 'network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.TezosNetwork,
		cardinality: EntityFieldCardinality.One,
	},
	operationHash: {
		label: 'operation hash',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$block: {
		label: 'block',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.TezosBlock,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	branch: {
		label: 'branch',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	signature: {
		label: 'signature',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	validationPass: {
		label: 'validation pass',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	operationCount: {
		label: 'operation count',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$operations: {
		label: 'operations',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.TezosOperation,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		NetworkOperationHash: [
			'$network',
			'operationHash',
		],
	},
})
