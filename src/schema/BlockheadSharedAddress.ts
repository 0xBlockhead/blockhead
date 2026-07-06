// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum BlockheadSharedAddressSelector {
	Id = 'Id',
}
export default {
	entityType: EntityType.BlockheadSharedAddress,
	label: 'blockhead shared address',
	labelPlural: 'blockhead shared addresses',
	selectors: [
		{
			name: BlockheadSharedAddressSelector.Id,
			fields: [
				'id',
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
			name: 'peerId',
			label: 'peer ID',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$account',
			label: 'account',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmAccount,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'targetPeerIds',
			label: 'target peer ids',
			type: EntityFieldType.Primitive,
			primitiveType: (type("string[] | null")),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'sharedAt',
			label: 'shared AT',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
	],
} as const satisfies EntityDefinition
