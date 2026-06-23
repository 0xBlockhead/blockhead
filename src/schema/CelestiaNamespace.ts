import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum CelestiaNamespaceSelector {
	NetworkNamespaceId = '$network+namespaceId',
}
export default {
	entityType: EntityType.CelestiaNamespace,
	label: 'celestia namespace',
	labelPlural: 'celestia namespaces',
	selectors: [
		{
			name: CelestiaNamespaceSelector.NetworkNamespaceId,
			fields: [
				'$network',
				'namespaceId',
			],
		},
	],
	fields: [
		{
			name: '$network',
			label: 'network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.CelestiaNetwork,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'namespaceId',
			label: 'namespace ID',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'namespaceVersion',
			label: 'namespace version',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'label',
			label: 'Label',
			description: 'A human-readable name for the subject.',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$blobs',
			label: 'blobs',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.CelestiaBlob,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.CelestiaNamespace_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
