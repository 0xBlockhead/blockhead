// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.FedimintFederation,
	labels: {
		singular: 'Fedimint federation',
		plural: 'Fedimint federations',
	},
})({
	federationId: {
		label: 'federation ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	name: {
		label: 'Name',
		description: 'The human-readable name of the subject.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	guardianCount: {
		label: 'guardian count',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	guardianThreshold: {
		label: 'guardian threshold',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	clientConfigJson: {
		label: 'client config JSON',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	moduleConfigJson: {
		label: 'module config JSON',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	consensusVersion: {
		label: 'consensus version',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'timestamps',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.FedimintFederation_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$gateways: {
		label: 'gateways',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.FedimintGateway,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		FederationId: [
			'federationId',
		],
	},
})
