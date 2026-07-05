// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum CardanoStakeCredentialSelector {
	NetworkCredential = 'NetworkCredential',
}
export default {
	entityType: EntityType.CardanoStakeCredential,
	label: 'cardano stake credential',
	labelPlural: 'cardano stake credentials',
	selectors: [
		{
			name: CardanoStakeCredentialSelector.NetworkCredential,
			fields: [
				'$network',
				'credential',
			],
		},
	],
	fields: [
		{
				name: '$network',
				label: 'network',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.CardanoNetwork,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'credential',
				label: 'credential',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'credentialKind',
				label: 'credential kind',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'rewardAddress',
				label: 'reward address',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$delegationEpochs',
				label: 'delegation epochs',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.CardanoStakeDelegation_Epoch,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$addresses',
				label: 'addresses',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.CardanoAddress,
				cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
