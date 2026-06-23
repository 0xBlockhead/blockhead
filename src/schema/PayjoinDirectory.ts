import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum PayjoinDirectorySelector {
	DirectoryUrl = 'directoryUrl',
}
export default {
	entityType: EntityType.PayjoinDirectory,
	label: 'payjoin directory',
	labelPlural: 'payjoin directories',
	selectors: [
		{
			name: PayjoinDirectorySelector.DirectoryUrl,
			fields: [
				'directoryUrl',
			],
		},
	],
	fields: [
		{
			name: 'directoryUrl',
			label: 'directory URL',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'ohttpGatewayUrl',
			label: 'ohttp gateway URL',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'ohttpKeyConfig',
			label: 'ohttp key config',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'maxPayloadBytes',
			label: 'max payload bytes',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$blockheadSessions',
			label: 'blockhead sessions',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.BlockheadPayjoinSession,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
