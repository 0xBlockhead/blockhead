import { type } from 'arktype'

import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'

export enum LogosAccountSelector {
	NetworkAccountAddress = 'networkAccountAddress',
}

export default {
	entityType: EntityType.LogosAccount,

	label: 'Logos Account',
	labelPlural: 'Logos Accounts',

	selectors: [
		{
			name: LogosAccountSelector.NetworkAccountAddress,
			fields: [
				'$network',
				'accountAddress',
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
			name: 'accountAddress',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$zone',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.LogosZone,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
