// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
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
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	providerId: {
		label: 'provider ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	serviceKind: {
		label: 'service kind',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$operator: {
		label: 'operator',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.EvmAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	verificationMethod: {
		label: 'verification method',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$requests: {
		label: 'requests',
		type: EntityFieldType.EntitiesReference,
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
