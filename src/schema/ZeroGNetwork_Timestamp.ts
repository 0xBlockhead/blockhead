import { type } from 'arktype'

import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import ZeroGNetwork from '$/schema/ZeroGNetwork.ts'
import { Source } from '$/sources/$Source.ts'

export default {
	entityType: EntityType.ZeroGNetwork_Timestamp,

	label: '0G network snapshot',
	labelPlural: '0G network snapshots',

	id: type({
		$network: ZeroGNetwork.id,
		timestampMs: 'number',
	}),

	fields: [
		{
			name: 'headBlockNumber',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.ZeroGChain_JsonRpc,
			],
		},
		{
			name: 'headBlockHash',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.ZeroGChain_JsonRpc,
			],
		},
		{
			name: 'headTimestampMs',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.ZeroGChain_JsonRpc,
			],
		},
		{
			name: 'transactionCount',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.ZeroGChain_JsonRpc,
			],
		},
		{
			name: 'gasUsed',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.ZeroGChain_JsonRpc,
			],
		},
		{
			name: 'gasLimit',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.ZeroGChain_JsonRpc,
			],
		},
		{
			name: 'baseFeePerGas',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.ZeroGChain_JsonRpc,
			],
		},
		{
			name: 'storageLogSyncHeight',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.ZeroGStorageScan_Rest,
			],
		},
		{
			name: 'storageLayer1LogSyncHeight',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.ZeroGStorageScan_Rest,
			],
		},
		{
			name: 'storageTransactionCount',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.ZeroGStorageScan_Rest,
			],
		},
		{
			name: 'latestDataRoot',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.ZeroGStorageScan_Rest,
			],
		},
		{
			name: 'latestDataSizeBytes',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.ZeroGStorageScan_Rest,
			],
		},
		{
			name: 'latestStorageTxHash',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.ZeroGStorageScan_Rest,
			],
		},
		{
			name: 'storageMinerCount',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.ZeroGStorageScan_Rest,
			],
		},
		{
			name: 'latestStorageMiner',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.ZeroGStorageScan_Rest,
			],
		},
		{
			name: 'storageFeeTotal',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.ZeroGStorageScan_Rest,
			],
		},
		{
			name: 'storageRewardTotal',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.ZeroGStorageScan_Rest,
			],
		},
		{
			name: 'storageTotalWinCount',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.ZeroGStorageScan_Rest,
			],
		},
		{
			name: 'expiredFileCount',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.ZeroGStorageScan_Rest,
			],
		},
		{
			name: 'prunedFileCount',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.ZeroGStorageScan_Rest,
			],
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
