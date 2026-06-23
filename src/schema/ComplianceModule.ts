import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum ComplianceModuleSelector {
	ProfileModuleKey = '$profile+moduleKey',
}
export default {
	entityType: EntityType.ComplianceModule,
	label: 'compliance module',
	labelPlural: 'compliance modules',
	selectors: [
		{
			name: ComplianceModuleSelector.ProfileModuleKey,
			fields: [
				'$profile',
				'moduleKey',
			],
		},
	],
	fields: [
		{
			name: '$profile',
			label: 'profile',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.RegulatedAssetProfile,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'moduleKey',
			label: 'module key',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'moduleSelector',
			label: 'module selector',
			type: EntityFieldType.Primitive,
			primitiveType: type("unknown"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'ruleKind',
			label: 'rule kind',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'config',
			label: 'config',
			type: EntityFieldType.Primitive,
			primitiveType: type("unknown"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
