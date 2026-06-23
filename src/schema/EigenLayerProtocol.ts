import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum EigenLayerProtocolSelector {
	Network = '$network',
}
export default {
	entityType: EntityType.EigenLayerProtocol,
	label: 'eigen layer protocol',
	labelPlural: 'eigen layer protocols',
	selectors: [
		{
			name: EigenLayerProtocolSelector.Network,
			fields: [
				'$network',
			],
		},
	],
	fields: [
		{
			name: '$network',
			label: 'network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmNetwork,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'protocolName',
			label: 'protocol name',
			type: EntityFieldType.Primitive,
			primitiveType: type("'EigenLayer'"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$delegationManager',
			label: 'delegation manager',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmContract,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$strategyManager',
			label: 'strategy manager',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmContract,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$avsDirectory',
			label: 'avs directory',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmContract,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$allocationManager',
			label: 'allocation manager',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmContract,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$rewardsCoordinator',
			label: 'rewards coordinator',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmContract,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$slasher',
			label: 'slasher',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmContract,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$operators',
			label: 'operators',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.EigenLayerOperator,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$avss',
			label: 'avss',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.EigenLayerAvs,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$strategies',
			label: 'strategies',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.EigenLayerStrategy,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$rewards',
			label: 'rewards',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.EigenLayerReward_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$slashingEvents',
			label: 'slashing events',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.EigenLayerSlashingEvent,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
