import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum BlockheadFilecoinPendingMessageSelector {
	NodeIdMessageCidObservedAtMs = 'nodeId+messageCid+observedAtMs',
}
export default {
	entityType: EntityType.BlockheadFilecoinPendingMessage,
	label: 'blockhead filecoin pending message',
	labelPlural: 'blockhead filecoin pending messages',
	selectors: [
		{
			name: BlockheadFilecoinPendingMessageSelector.NodeIdMessageCidObservedAtMs,
			fields: [
				'nodeId',
				'messageCid',
				'observedAtMs',
			],
		},
	],
	fields: [
		{
			name: 'nodeId',
			label: 'node ID',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'messageCid',
			label: 'message CID',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'observedAtMs',
			label: 'observed AT ms',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$network',
			label: 'network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.FilecoinNetwork,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$message',
			label: 'message',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.FilecoinMessage,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$from',
			label: 'from',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.FilecoinActor,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$to',
			label: 'to',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.FilecoinActor,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'nonce',
			label: 'nonce',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'method',
			label: 'method',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'valueAttoFil',
			label: 'value atto fil',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'gasLimit',
			label: 'gas limit',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'gasFeeCapAttoFil',
			label: 'gas fee cap atto fil',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'gasPremiumAttoFil',
			label: 'gas premium atto fil',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'signatureType',
			label: 'signature type',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'local',
			label: 'local',
			type: EntityFieldType.Primitive,
			primitiveType: type("boolean"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'payload',
			label: 'payload',
			type: EntityFieldType.Primitive,
			primitiveType: type("unknown"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
