import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum BlockheadWalletTransportSessionSelector {
	ConnectionKeyTransportSessionId = 'connectionKey+transportSessionId',
}
export default {
	entityType: EntityType.BlockheadWalletTransportSession,
	label: 'blockhead wallet transport session',
	labelPlural: 'blockhead wallet transport sessions',
	selectors: [
		{
			name: BlockheadWalletTransportSessionSelector.ConnectionKeyTransportSessionId,
			fields: [
				'connectionKey',
				'transportSessionId',
			],
		},
	],
	fields: [
		{
			name: 'connectionKey',
			label: 'connection key',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'transportSessionId',
			label: 'transport session ID',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$connection',
			label: 'connection',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.BlockheadWalletConnection,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'transportKind',
			label: 'transport kind',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'sessionKind',
			label: 'session kind',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'status',
			label: 'status',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'topic',
			label: 'topic',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'peerId',
			label: 'peer ID',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'relayProtocol',
			label: 'relay protocol',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'bridgeUrl',
			label: 'bridge URL',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'manifestUrl',
			label: 'manifest URL',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'origin',
			label: 'origin',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'deviceId',
			label: 'device ID',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'createdAt',
			label: 'Created',
			description: 'The time when the subject was created according to the source.',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'updatedAt',
			label: 'Updated',
			description: 'The time when the subject was last updated according to the source.',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'expiresAt',
			label: 'expires AT',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'metadata',
			label: 'metadata',
			type: EntityFieldType.Primitive,
			primitiveType: type("unknown"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
