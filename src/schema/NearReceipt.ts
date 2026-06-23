import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum NearReceiptSelector {
	NetworkReceiptId = 'networkReceiptId',
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
			label: 'network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Network,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'receiptId',
			label: 'receipt ID',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$predecessor',
			label: 'predecessor',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.NearAccount,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$receiver',
			label: 'receiver',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.NearAccount,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
