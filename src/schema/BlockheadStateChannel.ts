import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum BlockheadStateChannelSelector {
	Id = 'id',
}
export default {
	entityType: EntityType.BlockheadStateChannel,
	label: 'blockhead state channel',
	labelPlural: 'blockhead state channels',
	selectors: [
		{
			name: BlockheadStateChannelSelector.Id,
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
			primitiveType: type("string"),
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
			name: '$participant0',
			label: 'participant0',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmAccount,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$participant1',
			label: 'participant1',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmAccount,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$asset',
			label: 'asset',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmCoinInstance,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$room',
			label: 'room',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.BlockheadRoom,
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
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.BlockheadStateChannel_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$transfers',
			label: 'transfers',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.BlockheadStateChannelTransfer,
			cardinality: EntityFieldCardinality.ZeroOrMany,
		},
		{
			name: '$$states',
			label: 'states',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.BlockheadStateChannelState,
			cardinality: EntityFieldCardinality.ZeroOrMany,
		},
		{
			name: '$$deposits',
			label: 'deposits',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.BlockheadStateChannelDeposit,
			cardinality: EntityFieldCardinality.ZeroOrMany,
		},
	],
} as const satisfies EntityDefinition
