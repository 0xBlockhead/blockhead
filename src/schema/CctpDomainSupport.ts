// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum CctpDomainSupportSelector {
	CctpVersionDomainId = 'CctpVersionDomainId',
}
export default {
	entityType: EntityType.CctpDomainSupport,
	label: 'CCTP domain support',
	labelPlural: 'CCTP domain supports',
	selectors: [
		{
			name: CctpDomainSupportSelector.CctpVersionDomainId,
			fields: [
				'cctpVersion',
				'domainId',
			],
		},
	],
	fields: [
		{
			name: 'cctpVersion',
			label: 'CCTP version',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'domainId',
			label: 'Domain ID',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'name',
			label: 'Name',
			description: 'The human-readable name of the subject.',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$network',
			label: 'Network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Network,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'standardTransferSource',
			label: 'Standard transfer source',
			type: EntityFieldType.Primitive,
			primitiveType: type('boolean'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'fastTransferSource',
			label: 'Fast transfer source',
			type: EntityFieldType.Primitive,
			primitiveType: type('boolean'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'forwardingDestination',
			label: 'Forwarding destination',
			type: EntityFieldType.Primitive,
			primitiveType: type('boolean'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'supportedTokens',
			label: 'Supported tokens',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: 'tokenMessengerAddress',
			label: 'Token messenger address',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'messageTransmitterAddress',
			label: 'Message transmitter address',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'tokenMinterAddress',
			label: 'Token minter address',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$messages',
			label: 'Messages',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.CctpMessage,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$burnFeeTimestamps',
			label: 'Burn fee timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.CctpBurnFee_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
