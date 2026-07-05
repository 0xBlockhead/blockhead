// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum IcpCanisterMethodSelector {
	CanisterMethodNameMethodKind = 'CanisterMethodNameMethodKind',
}
export default {
	entityType: EntityType.IcpCanisterMethod,
	label: 'icp canister method',
	labelPlural: 'icp canister methods',
	selectors: [
		{
			name: IcpCanisterMethodSelector.CanisterMethodNameMethodKind,
			fields: [
				'$canister',
				'methodName',
				'methodKind',
			],
		},
	],
	fields: [
		{
				name: '$canister',
				label: 'canister',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.IcpCanister,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'methodName',
				label: 'method name',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'methodKind',
				label: 'method kind',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: '$timestamps',
				label: 'timestamps',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.IcpCanisterMethod_Timestamp,
				cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
