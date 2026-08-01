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
		label: 'network',
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	providerId: {
		label: 'provider ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	serviceKind: {
		label: 'service kind',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$operator: {
		label: 'operator',
		entityType: EntityType.EvmAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	verificationMethod: {
		label: 'verification method',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$requests: {
		label: 'requests',
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
