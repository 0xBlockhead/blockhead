import { type } from 'arktype'

import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'

export enum NearReceiptSelector {
	NetworkReceiptId = 'networkReceiptId',
}

export default {
	entityType: EntityType.NearReceipt,

	label: 'NEAR Receipt',
	labelPlural: 'NEAR Receipts',

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
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Network,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'receiptId',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$predecessor',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.NearAccount,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$receiver',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.NearAccount,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
