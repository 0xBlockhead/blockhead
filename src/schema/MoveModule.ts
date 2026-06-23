import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum MoveModuleSelector {
	NetworkAddressModuleName = '$network+address+moduleName',
}
export default {
	entityType: EntityType.MoveModule,
	label: 'move module',
	labelPlural: 'move modules',
	selectors: [
		{
			name: MoveModuleSelector.NetworkAddressModuleName,
			fields: [
				'$network',
				'address',
				'moduleName',
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
			name: 'address',
			label: 'Address',
			description: 'The address or account identifier used by the source protocol.',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'moduleName',
			label: 'module name',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.MoveModule_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$functions',
			label: 'functions',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.MoveFunction,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$structs',
			label: 'structs',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.MoveStruct,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
