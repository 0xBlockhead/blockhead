import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum BlockheadBitTorrentClientState_TimestampSelector {
	ClientStateTimestampMsSource = '$clientState+timestampMs+source',
}
export default {
	entityType: EntityType.BlockheadBitTorrentClientState_Timestamp,
	label: 'blockhead bit torrent client state timestamp',
	labelPlural: 'blockhead bit torrent client state observations',
	selectors: [
		{
			name: BlockheadBitTorrentClientState_TimestampSelector.ClientStateTimestampMsSource,
			fields: [
				'$clientState',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
			name: '$clientState',
			label: 'client state',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.BlockheadBitTorrentClientState,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'timestampMs',
			label: 'Timestamp',
			description: 'The observation time in Unix milliseconds.',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'source',
			label: 'Source',
			description: 'The source that produced this observation.',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'clientVersion',
			label: 'client version',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'listenAddresses',
			label: 'listen addresses',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: 'port',
			label: 'port',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'downloadRate',
			label: 'download rate',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'uploadRate',
			label: 'upload rate',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'downloadedBytes',
			label: 'downloaded bytes',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'uploadedBytes',
			label: 'uploaded bytes',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'activeTorrentCount',
			label: 'active torrent count',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'lastSyncedAt',
			label: 'last synced AT',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
