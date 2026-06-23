import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { EvmAddress } from '$/schema/ZeroExHex.ts'
export enum LensAccountSelector {
	Address = 'address',
	LocalName = 'localName',
	LegacyProfileId = 'legacyProfileId',
}
export default {
	entityType: EntityType.LensAccount,
	label: 'lens account',
	labelPlural: 'lens accounts',
	selectors: [
		{
			name: LensAccountSelector.Address,
			fields: [
				'address',
			],
		},
		{
			name: LensAccountSelector.LocalName,
			fields: [
				'localName',
			],
		},
		{
			name: LensAccountSelector.LegacyProfileId,
			fields: [
				'legacyProfileId',
			],
		},
	],
	fields: [
		{
			name: 'address',
			label: 'Address',
			description: 'The address or account identifier used by the source protocol.',
			type: EntityFieldType.Primitive,
			primitiveType: EvmAddress,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'legacyProfileId',
			label: 'legacy profile ID',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'localName',
			label: 'local name',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'displayName',
			label: 'display name',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'bio',
			label: 'bio',
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
			name: 'owner',
			label: 'owner',
			type: EntityFieldType.Primitive,
			primitiveType: EvmAddress,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'score',
			label: 'score',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'isMemberOf',
			label: 'is member of',
			type: EntityFieldType.Primitive,
			primitiveType: type("boolean"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$username',
			label: 'username',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.LensUsername,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$accountManagers',
			label: 'account managers',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.LensAccountManager,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.LensAccount_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: 'iconUrl',
			label: 'icon URL',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$icon',
			label: 'icon',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Media,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$posts',
			label: 'posts',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.LensPost,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
