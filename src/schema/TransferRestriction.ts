// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum TransferRestrictionSelector {
	AssetInstanceRestrictionKeySource = 'AssetInstanceRestrictionKeySource',
}
export default {
	entityType: EntityType.TransferRestriction,
	label: 'transfer restriction',
	labelPlural: 'transfer restrictions',
	selectors: [
		{
			name: TransferRestrictionSelector.AssetInstanceRestrictionKeySource,
			fields: [
				'$assetInstance',
				'restrictionKey',
				'source',
			],
		},
	],
	fields: [
		{
			name: '$assetInstance',
			label: 'asset instance',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.AssetInstance,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'restrictionKey',
			label: 'restriction key',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'source',
			label: 'Source',
			description: 'The source that produced this observation.',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'restrictionKind',
			label: 'restriction kind',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$profile',
			label: 'profile',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.RegulatedAssetProfile,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'message',
			label: 'message',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'ruleSelector',
			label: 'rule selector',
			type: EntityFieldType.Primitive,
			primitiveType: type('unknown'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$checks',
			label: 'checks',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.TransferRestrictionCheck_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
