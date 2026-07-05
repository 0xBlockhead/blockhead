// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum ZeroGServiceProviderSelector {
	NetworkProviderId = 'NetworkProviderId',
}
export default {
	entityType: EntityType.ZeroGServiceProvider,
	label: 'zero g service provider',
	labelPlural: 'zero g service providers',
	selectors: [
		{
			name: ZeroGServiceProviderSelector.NetworkProviderId,
			fields: [
				'$network',
				'providerId',
			],
		},
	],
	fields: [
		{
				name: '$network',
				label: 'network',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.Network,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'providerId',
				label: 'provider ID',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'serviceKind',
				label: 'service kind',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$operator',
				label: 'operator',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.EvmAccount,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'verificationMethod',
				label: 'verification method',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$$requests',
				label: 'requests',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.ZeroGServiceRequest,
				cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
