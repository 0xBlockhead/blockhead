// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.CctpDomainSupport,
	labels: {
		singular: 'CCTP domain support',
		plural: 'CCTP domain supports',
	},
})({
	cctpVersion: {
		label: 'CCTP version',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	domainId: {
		label: 'Domain ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	name: {
		label: 'Name',
		description: 'The human-readable name of the subject.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$network: {
		label: 'Network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	standardTransferSource: {
		label: 'Standard transfer source',
		type: EntityFieldType.Primitive,
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	fastTransferSource: {
		label: 'Fast transfer source',
		type: EntityFieldType.Primitive,
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	forwardingDestination: {
		label: 'Forwarding destination',
		type: EntityFieldType.Primitive,
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	supportedTokens: {
		label: 'Supported tokens',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
	},
	tokenMessengerAddress: {
		label: 'Token messenger address',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	messageTransmitterAddress: {
		label: 'Message transmitter address',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	tokenMinterAddress: {
		label: 'Token minter address',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$messages: {
		label: 'Messages',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.CctpMessage,
		cardinality: EntityFieldCardinality.Many,
	},
	$$burnFeeTimestamps: {
		label: 'Burn fee timestamps',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.CctpBurnFee_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		CctpVersionDomainId: [
			'cctpVersion',
			'domainId',
		],
	},
})
