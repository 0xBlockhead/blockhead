// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum _GlobalEnsNetworkSelector {
	Scope = 'Scope',
}
export default {
	entityType: EntityType._GlobalEnsNetwork,
	label: 'ENS',
	labelPlural: 'ENS',
	selectors: [
		{
			name: _GlobalEnsNetworkSelector.Scope,
			fields: [
				'scope',
			],
		},
	],
	fields: [
		{
			name: 'scope',
			label: 'Scope',
			description: 'The fixed scope value that identifies this hub row.',
			type: EntityFieldType.Primitive,
			primitiveType: type.unit('_GlobalEnsNetwork'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$registryContract',
			label: 'Registry name contract',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmContract,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$ethRegistrarController',
			label: '.eth registrar controller',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmContract,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$reverseRegistrar',
			label: 'Reverse registrar',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmContract,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$nameWrapper',
			label: 'Name wrapper',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmContract,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$timestamps',
			label: 'Observations',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType._GlobalEnsNetwork_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
