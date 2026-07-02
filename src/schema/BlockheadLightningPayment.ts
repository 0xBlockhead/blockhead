// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum BlockheadLightningPaymentSelector {
	NetworkPaymentHash = 'NetworkPaymentHash',
}
export default {
	entityType: EntityType.BlockheadLightningPayment,
	label: 'Lightning payment',
	labelPlural: 'Lightning payments',
	selectors: [
		{
			name: BlockheadLightningPaymentSelector.NetworkPaymentHash,
			fields: [
				'$network',
				'paymentHash',
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
				name: 'paymentHash',
				label: 'Payment hash',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'paymentRequest',
				label: 'Payment request',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'valueMsat',
				label: 'Value msat',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'createdAtMs',
				label: 'Created',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'paymentIndex',
				label: 'Payment index',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$localNodeState',
				label: 'Local node state',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.BlockheadLightningNodeState,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$invoice',
				label: 'Invoice',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.BlockheadLightningInvoice,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$$timestamps',
				label: 'Observations',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.BlockheadLightningPayment_Timestamp,
				cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
