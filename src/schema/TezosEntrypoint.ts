// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum TezosEntrypointSelector {
	ContractEntrypointName = 'ContractEntrypointName',
}
export const TezosEntrypoint = entity({
	entityType: EntityType.TezosEntrypoint,
	labels: {
		singular: 'tezos entrypoint',
		plural: 'tezos entrypoints',
	},
})({
	$contract: {
		label: 'contract',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.TezosContract,
		cardinality: EntityFieldCardinality.One,
	},
	entrypointName: {
		label: 'entrypoint name',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	parameterType: {
		label: 'parameter type',
		type: EntityFieldType.Primitive,
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	annotations: {
		label: 'annotations',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		ContractEntrypointName: [
			'$contract',
			'entrypointName',
		],
	},
})
