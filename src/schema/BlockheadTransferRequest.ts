// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum BlockheadTransferRequestSelector {
	IdEvmNetwork = 'IdEvmNetwork',
}
export default {
	entityType: EntityType.BlockheadTransferRequest,
	label: 'blockhead transfer request',
	labelPlural: 'blockhead transfer requests',
	selectors: [
		{
			name: BlockheadTransferRequestSelector.IdEvmNetwork,
			fields: [
				'id',
				'$network',
			],
		},
	],
	fields: [
		{
				name: 'id',
				label: 'ID',
				description: 'The identifier assigned by the source domain.',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: '$network',
				label: 'network',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.EvmNetwork,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: '$room',
				label: 'room',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.BlockheadRoom,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: '$from',
				label: 'from',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.EvmAccount,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: '$to',
				label: 'to',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.EvmAccount,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'allocations',
				label: 'allocations',
				type: EntityFieldType.Primitive,
				primitiveType: type({ 'destination': type('string'), 'token': type('string'), 'amount': type('bigint') }).array(),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'status',
				label: 'status',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'createdAt',
				label: 'Created',
				description: 'The time when the subject was created according to the source.',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'expiresAt',
				label: 'expires AT',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.One,
		},
	],
} as const satisfies EntityDefinition
