import { type } from 'arktype'

import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'

export enum HyperliquidAccountSelector {
	NetworkAddress = 'networkAddress',
}

export default {
	entityType: EntityType.HyperliquidAccount,

	label: 'Hyperliquid Account',
	labelPlural: 'Hyperliquid Accounts',

	selectors: [
		{
			name: HyperliquidAccountSelector.NetworkAddress,
			fields: [
				'$network',
				'address',
			],
		},
	],

	fields: [
		{
			name: '$network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Network,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'address',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'accountRole',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$masterAccount',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.HyperliquidAccount,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$agentAccount',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.HyperliquidAccount,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
