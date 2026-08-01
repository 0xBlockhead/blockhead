// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BlockheadFedimintClientState,
	labels: {
		singular: 'blockhead Fedimint client state',
		plural: 'blockhead Fedimint client states',
	},
})({
	clientId: {
		label: 'client ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	clientName: {
		label: 'client name',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	federationId: {
		label: 'federation ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$federation: {
		label: 'federation',
		entityType: EntityType.FedimintFederation,
		cardinality: EntityFieldCardinality.One,
	},
	inviteCode: {
		label: 'invite code',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	mnemonicSet: {
		label: 'mnemonic set',
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	guardianThreshold: {
		label: 'guardian threshold',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	moduleConfigJson: {
		label: 'module config JSON',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	joinedAt: {
		label: 'joined AT',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	viewingKeyJson: {
		label: 'viewing key JSON',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'timestamps',
		entityType: EntityType.BlockheadFedimintClientState_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		ClientIdFederationId: [
			'clientId',
			'federationId',
		],
	},
})
