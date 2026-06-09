import { type } from 'arktype'

import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import Network from '$/schema/Network.ts'
import { Source } from '$/sources/Source.ts'

export enum LightningChannelStatus {
	Open = 'Open',
	Active = 'Active',
	Inactive = 'Inactive',
	Closed = 'Closed',
	Pending = 'Pending',
	Unknown = 'Unknown',
}

export default {
	entityType: EntityType.LightningChannel,

	label: 'Lightning channel',
	labelPlural: 'Lightning channels',

	id: type({
		$network: Network.id,
		channelId: 'string',
	}),

	fields: [
		{
			name: 'shortChannelId',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.LightningMempoolSpace_Rest,
				Source.Amboss_Graphql,
			],
		},
		{
			name: 'status',
			type: EntityFieldType.Primitive,
			primitiveType: type.valueOf(LightningChannelStatus),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.LightningMempoolSpace_Rest,
				Source.Amboss_Graphql,
				Source.LightningLnd_Rest,
			],
		},
		{
			name: '$node0',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.LightningNode,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.LightningMempoolSpace_Rest,
				Source.Amboss_Graphql,
			],
		},
		{
			name: '$node1',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.LightningNode,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.LightningMempoolSpace_Rest,
				Source.Amboss_Graphql,
			],
		},
		{
			name: 'capacitySats',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.LightningMempoolSpace_Rest,
				Source.Amboss_Graphql,
				Source.LightningLnd_Rest,
			],
		},
		{
			name: 'localBalanceSats',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.LightningLnd_Rest,
			],
		},
		{
			name: 'remoteBalanceSats',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.LightningLnd_Rest,
			],
		},
		{
			name: 'unsettledBalanceSats',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'fundingTransactionId',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'fundingOutputIndex',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'closingTransactionId',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'closingFeeSats',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'closingReason',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'openedAtMs',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'closedAtMs',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'updatedAtMs',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'feeRatePpm',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.LightningMempoolSpace_Rest,
				Source.Amboss_Graphql,
			],
		},
		{
			name: 'active',
			type: EntityFieldType.Primitive,
			primitiveType: type('boolean'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.LightningLnd_Rest,
			],
		},
		{
			name: 'private',
			type: EntityFieldType.Primitive,
			primitiveType: type('boolean'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.LightningLnd_Rest,
			],
		},
		{
			name: 'initiator',
			type: EntityFieldType.Primitive,
			primitiveType: type('boolean'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.LightningLnd_Rest,
			],
		},
		{
			name: '$$htlcs',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.LightningHtlc,
			cardinality: EntityFieldCardinality.ZeroOrMany,
			defaultSources: [
				Source.LightningLnd_Rest,
			],
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
