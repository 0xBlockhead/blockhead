import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum BeaconValidatorSelector {
	EvmNetworkValidatorIndex = 'evmNetworkValidatorIndex',
	NetworkValidatorIndex = '$network+validatorIndex',
	NetworkPubkey = '$network+pubkey',
}
export default {
	entityType: EntityType.BeaconValidator,
	label: 'beacon validator',
	labelPlural: 'beacon validators',
	selectors: [
		{
			name: BeaconValidatorSelector.EvmNetworkValidatorIndex,
			fields: [
				'$network',
				'validatorIndex',
			],
		},
		{
			name: BeaconValidatorSelector.NetworkPubkey,
			fields: [
				'$network',
				'pubkey',
			],
		},
	],
	fields: [
		{
			name: '$network',
			label: 'network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmNetwork,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'validatorIndex',
			label: 'validator index',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'pubkey',
			label: 'public key',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.BeaconValidator_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
