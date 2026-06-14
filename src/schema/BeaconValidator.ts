import { type } from 'arktype'

import { ZeroExHex } from '$/schema/ZeroExHex.ts'
import type { EntityDefinition, EntityFieldDefinition } from '$/schema/$schema.ts'
import {
	EntityFieldCardinality,
	EntityFieldType,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

export enum BeaconValidatorSelector {
	EvmNetworkValidatorIndex = 'evmNetworkValidatorIndex',
}

export default {
	entityType: EntityType.BeaconValidator,

	label: 'Beacon validator',
	labelPlural: 'Beacon validators',

	selectors: [
		{
			name: BeaconValidatorSelector.EvmNetworkValidatorIndex,
			fields: [
				'$network',
				'validatorIndex',
			],
		},
	],

	fields: [
		{
			name: '$network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmNetwork,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'validatorIndex',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'balanceGwei',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Beacon_Rest,
			],
		},
		{
			name: 'effectiveBalanceGwei',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Beacon_Rest,
			],
		},
		{
			name: 'status',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Beacon_Rest,
			],
		},
		{
			name: 'pubkey',
			type: EntityFieldType.Primitive,
			primitiveType: ZeroExHex,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Beacon_Rest,
			],
		},
		{
			name: 'slashed',
			type: EntityFieldType.Primitive,
			primitiveType: type('boolean'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Beacon_Rest,
			],
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
