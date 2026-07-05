// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum FilecoinMessageReceiptSelector {
	MessageTipsetKeySource = 'MessageTipsetKeySource',
}
export default {
	entityType: EntityType.FilecoinMessageReceipt,
	label: 'filecoin message receipt',
	labelPlural: 'filecoin message receipts',
	selectors: [
		{
			name: FilecoinMessageReceiptSelector.MessageTipsetKeySource,
			fields: [
				'$message',
				'tipsetKey',
				'source',
			],
		},
	],
	fields: [
		{
				name: '$message',
				label: 'Message',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.FilecoinMessage,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'tipsetKey',
				label: 'Tipset key',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
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
				name: '$tipset',
				label: 'Tipset',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.FilecoinTipset,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'height',
				label: 'Height',
				description: 'The block height.',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'blockCid',
				label: 'Block CID',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'exitCode',
				label: 'Exit code',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'returnData',
				label: 'Return data',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'gasUsed',
				label: 'Gas used',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'replacedMessageCid',
				label: 'Replaced message CID',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
