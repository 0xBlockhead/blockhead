// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum FedimintGateway_TimestampSelector {
	GatewayTimestampMsSource = 'GatewayTimestampMsSource',
}
export default {
	entityType: EntityType.FedimintGateway_Timestamp,
	label: 'Fedimint gateway timestamp',
	labelPlural: 'Fedimint gateway observations',
	selectors: [
		{
			name: FedimintGateway_TimestampSelector.GatewayTimestampMsSource,
			fields: [
				'$gateway',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
			name: '$gateway',
			label: 'gateway',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.FedimintGateway,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'timestampMs',
			label: 'Timestamp',
			description: 'The observation time in Unix milliseconds.',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'source',
			label: 'Source',
			description: 'The source that produced this observation.',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'reachable',
			label: 'reachable',
			type: EntityFieldType.Primitive,
			primitiveType: type('boolean'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'online',
			label: 'online',
			type: EntityFieldType.Primitive,
			primitiveType: type('boolean'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'version',
			label: 'version',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'lightningAlias',
			label: 'Lightning alias',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'routingFeesJson',
			label: 'routing fees JSON',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'federationsCount',
			label: 'federations count',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'lightningBalanceMsat',
			label: 'Lightning balance msat',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'ecashBalanceMsat',
			label: 'ecash balance msat',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'onchainBalanceSats',
			label: 'onchain balance sats',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'channelsJson',
			label: 'channels JSON',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'paymentSummaryJson',
			label: 'payment summary JSON',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
