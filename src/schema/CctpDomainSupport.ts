import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum CctpDomainSupportSelector {
	CctpVersionDomainId = 'cctpVersion+domainId',
}
export default {
	entityType: EntityType.CctpDomainSupport,
	label: 'cctp domain support',
	labelPlural: 'cctp domain supports',
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
			label: 'cctp version',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'domainId',
			label: 'domain ID',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'name',
			label: 'Name',
			description: 'The human-readable name of the subject.',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$network',
			label: 'network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Network,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'standardTransferSource',
			label: 'standard transfer source',
			type: EntityFieldType.Primitive,
			primitiveType: type("boolean"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'fastTransferSource',
			label: 'fast transfer source',
			type: EntityFieldType.Primitive,
			primitiveType: type("boolean"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'forwardingDestination',
			label: 'forwarding destination',
			type: EntityFieldType.Primitive,
			primitiveType: type("boolean"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'supportedTokens',
			label: 'supported tokens',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: 'tokenMessengerAddress',
			label: 'token messenger address',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'messageTransmitterAddress',
			label: 'message transmitter address',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'tokenMinterAddress',
			label: 'token minter address',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$messages',
			label: 'messages',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.CctpMessage,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$burnFeeTimestamps',
			label: 'burn fee timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.CctpBurnFee_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
