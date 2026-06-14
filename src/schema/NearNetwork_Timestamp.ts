import { type } from 'arktype'

import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import NearNetwork from '$/schema/NearNetwork.ts'
import { Source } from '$/sources/Source.ts'

export enum NearNetwork_TimestampSelector {
	NearNetworkTimestampMs = 'nearNetworkTimestampMs',
}

export default {
	entityType: EntityType.NearNetwork_Timestamp,

	label: 'NEAR network snapshot',
	labelPlural: 'NEAR network snapshots',

	selectors: [
		{
			name: NearNetwork_TimestampSelector.NearNetworkTimestampMs,
			fields: [
				'$network',
				'timestampMs',
			],
		},
	],

	fields: [
		{
			name: '$network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.NearNetwork,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'timestampMs',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'headHeight',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.NearRpc_JsonRpc,
			],
		},
		{
			name: 'headHash',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.NearRpc_JsonRpc,
			],
		},
		{
			name: 'epochId',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.NearRpc_JsonRpc,
			],
		},
		{
			name: 'epochHeight',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.NearRpc_JsonRpc,
			],
		},
		{
			name: 'epochStartHeight',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.NearRpc_JsonRpc,
			],
		},
		{
			name: 'chunkCount',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.NearRpc_JsonRpc,
			],
		},
		{
			name: 'gasPriceYoctoNear',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.NearRpc_JsonRpc,
			],
		},
		{
			name: 'currentValidatorCount',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.NearRpc_JsonRpc,
			],
		},
		{
			name: 'nextValidatorCount',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.NearRpc_JsonRpc,
			],
		},
		{
			name: 'currentProposalCount',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.NearRpc_JsonRpc,
			],
		},
		{
			name: 'protocolVersion',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.NearRpc_JsonRpc,
			],
		},
		{
			name: 'latestProtocolVersion',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.NearRpc_JsonRpc,
			],
		},
		{
			name: 'nodeVersion',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.NearRpc_JsonRpc,
			],
		},
		{
			name: 'syncing',
			type: EntityFieldType.Primitive,
			primitiveType: type('boolean'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.NearRpc_JsonRpc,
			],
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
