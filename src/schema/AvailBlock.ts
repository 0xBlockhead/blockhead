// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum AvailBlockSelector {
	NetworkBlockNumber = 'NetworkBlockNumber',
	NetworkBlockHash = 'NetworkBlockHash',
}
export default {
	entityType: EntityType.AvailBlock,
	label: 'avail block',
	labelPlural: 'avail blocks',
	selectors: [
		{
			name: AvailBlockSelector.NetworkBlockNumber,
			fields: [
				'$network',
				'blockNumber',
			],
		},
		{
			name: AvailBlockSelector.NetworkBlockHash,
			fields: [
				'$network',
				'blockHash',
			],
		},
	],
	fields: [
		{
			name: '$network',
			label: 'network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.AvailNetwork,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'blockNumber',
			label: 'Block number',
			description: 'The block height or number in its network.',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'blockHash',
			label: 'Block hash',
			description: 'The hash that identifies the block in its network.',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'parentHash',
			label: 'parent hash',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'stateRoot',
			label: 'state root',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'extrinsicsRoot',
			label: 'extrinsics root',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'timestampMs',
			label: 'Timestamp',
			description: 'The observation time in Unix milliseconds.',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'extrinsicCount',
			label: 'extrinsic count',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'dataSubmissionCount',
			label: 'data submission count',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'appIdCount',
			label: 'app ID count',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$parent',
			label: 'parent',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.AvailBlock,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$dataSubmissions',
			label: 'data submissions',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.AvailDataSubmission,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
