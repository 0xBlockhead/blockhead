// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
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
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	name: {
		label: 'Name',
		description: 'The human-readable name of the subject.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	guardianCount: {
		label: 'guardian count',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	guardianThreshold: {
		label: 'guardian threshold',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	clientConfigJson: {
		label: 'client config JSON',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	moduleConfigJson: {
		label: 'module config JSON',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	consensusVersion: {
		label: 'consensus version',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'timestamps',
		entityType: EntityType.FedimintFederation_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$gateways: {
		label: 'gateways',
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
