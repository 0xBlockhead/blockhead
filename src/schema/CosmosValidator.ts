// Generated from APP.ts. Do not edit by hand.

import { entity, facet } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum CosmosValidatorSelector {
	NetworkOperatorAddress = 'NetworkOperatorAddress',
}
export const CosmosValidator = entity({
	entityType: EntityType.CosmosValidator,
	labels: {
		singular: 'Cosmos validator',
		plural: 'Cosmos validators',
	},
})({
	$network: {
		label: 'Network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	operatorAddress: {
		label: 'Operator address',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	consensusPubkey: {
		label: 'Consensus public key',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	moniker: {
		label: 'Moniker',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	identity: {
		label: 'Identity',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	website: {
		label: 'Website',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	securityContact: {
		label: 'Security contact',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	details: {
		label: 'Details',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'Timestamps',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.CosmosValidator_Timestamp,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.CosmosSdk_Rest,
		],
	},
})({
	selectors: {
		NetworkOperatorAddress: [
			'$network',
			'operatorAddress',
		],
	},
})
