// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
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
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	domainId: {
		label: 'Domain ID',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	name: {
		label: 'Name',
		description: 'The human-readable name of the subject.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$network: {
		label: 'Network',
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	standardTransferSource: {
		label: 'Standard transfer source',
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	fastTransferSource: {
		label: 'Fast transfer source',
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	forwardingDestination: {
		label: 'Forwarding destination',
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	supportedTokens: {
		label: 'Supported tokens',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
	},
	tokenMessengerAddress: {
		label: 'Token messenger address',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	messageTransmitterAddress: {
		label: 'Message transmitter address',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	tokenMinterAddress: {
		label: 'Token minter address',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$messages: {
		label: 'Messages',
		entityType: EntityType.CctpMessage,
		cardinality: EntityFieldCardinality.Many,
	},
	$$burnFeeTimestamps: {
		label: 'Burn fee timestamps',
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
