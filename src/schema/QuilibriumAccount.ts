import { type } from 'arktype'

import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'

export enum QuilibriumAccountSelector {
	NetworkAccountAddress = 'networkAccountAddress',
}

export default {
	entityType: EntityType.QuilibriumAccount,

	label: 'Quilibrium Account',
	labelPlural: 'Quilibrium Accounts',

	selectors: [
		{
			name: QuilibriumAccountSelector.NetworkAccountAddress,
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
			name: 'accountKind',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
