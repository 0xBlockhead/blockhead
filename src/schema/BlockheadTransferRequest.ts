import { type } from 'arktype'

import { EvmAddress } from '$/schema/ZeroExHex.ts'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'

export enum BlockheadTransferRequestSelector {
	IdEvmNetwork = 'idEvmNetwork',
}


const transferAllocationRow = type({
	destination: EvmAddress,
	token: EvmAddress,
	amount: 'bigint',
})

export default {
	entityType: EntityType.BlockheadTransferRequest,

	label: 'Transfer Request',
	labelPlural: 'Transfer Requests',

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
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmNetwork,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$room',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.BlockheadRoom,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$from',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmAccount,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$to',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmAccount,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'allocations',
			type: EntityFieldType.Primitive,
			primitiveType: transferAllocationRow.array(),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'status',
			type: EntityFieldType.Primitive,
			primitiveType: type("'pending' | 'accepted' | 'rejected' | 'expired' | 'sent'"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'createdAt',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'expiresAt',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
