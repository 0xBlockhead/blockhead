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
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	domainId: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	name: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$network: {
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	standardTransferSource: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	fastTransferSource: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	forwardingDestination: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	supportedTokens: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
	},
	tokenMessengerAddress: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	messageTransmitterAddress: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	tokenMinterAddress: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$messages: {
		entityType: EntityType.CctpMessage,
		cardinality: EntityFieldCardinality.Many,
	},
	$$burnFeeTimestamps: {
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
