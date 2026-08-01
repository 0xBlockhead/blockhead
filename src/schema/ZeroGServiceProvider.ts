// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.ZeroGServiceProvider,
	labels: {
		singular: 'zero g service provider',
		plural: 'zero g service providers',
	},
})({
	$network: {
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	providerId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	serviceKind: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$operator: {
		entityType: EntityType.EvmAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	verificationMethod: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$requests: {
		entityType: EntityType.ZeroGServiceRequest,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		NetworkProviderId: [
			'$network',
			'providerId',
		],
	},
})
