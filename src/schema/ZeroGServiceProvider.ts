// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum ZeroGServiceProviderSelector {
	NetworkProviderId = 'NetworkProviderId',
}
export const ZeroGServiceProvider = entity({
	entityType: EntityType.ZeroGServiceProvider,
	label: 'zero g service provider',
	labelPlural: 'zero g service providers',
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
