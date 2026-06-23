import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum BlockheadAgentCredentialStateSelector {
	CredentialId = 'credentialId',
}
export default {
	entityType: EntityType.BlockheadAgentCredentialState,
	label: 'blockhead agent credential state',
	labelPlural: 'blockhead agent credential states',
	selectors: [
		{
			name: BlockheadAgentCredentialStateSelector.CredentialId,
			fields: [
				'credentialId',
			],
		},
	],
	fields: [
		{
			name: 'credentialId',
			label: 'credential ID',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$connection',
			label: 'connection',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.BlockheadAgentConnection,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'credentialKind',
			label: 'credential kind',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
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
			name: 'createdAt',
			label: 'Created',
			description: 'The time when the subject was created according to the source.',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'updatedAt',
			label: 'Updated',
			description: 'The time when the subject was last updated according to the source.',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.BlockheadAgentCredentialState_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
