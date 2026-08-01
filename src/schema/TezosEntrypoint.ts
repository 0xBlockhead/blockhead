// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.TezosEntrypoint,
	labels: {
		singular: 'tezos entrypoint',
		plural: 'tezos entrypoints',
	},
})({
	$contract: {
		label: 'contract',
		entityType: EntityType.TezosContract,
		cardinality: EntityFieldCardinality.One,
	},
	entrypointName: {
		label: 'entrypoint name',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	parameterType: {
		label: 'parameter type',
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	annotations: {
		label: 'annotations',
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
