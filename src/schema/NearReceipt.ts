// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum NearReceiptSelector {
	NetworkReceiptId = 'NetworkReceiptId',
}
export default {
	entityType: EntityType.NearReceipt,
	label: 'near receipt',
	labelPlural: 'near receipts',
	selectors: [
		{
			name: NearReceiptSelector.NetworkReceiptId,
			fields: [
				'$network',
				'receiptId',
			],
		},
	],
	fields: [
		{
				name: '$network',
				label: 'Network',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.Network,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'receiptId',
				label: 'Receipt ID',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: '$predecessor',
				label: 'Predecessor',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.NearAccount,
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.NearRpc_JsonRpc,
				],
		},
		{
				name: '$receiver',
				label: 'Receiver',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.NearAccount,
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.NearRpc_JsonRpc,
				],
		},
	],
} as const satisfies EntityDefinition
