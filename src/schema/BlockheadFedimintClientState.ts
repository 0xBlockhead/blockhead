// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum BlockheadFedimintClientStateSelector {
	ClientIdFederationId = 'ClientIdFederationId',
}
export default {
	entityType: EntityType.BlockheadFedimintClientState,
	label: 'blockhead Fedimint client state',
	labelPlural: 'blockhead Fedimint client states',
	selectors: [
		{
			name: BlockheadFedimintClientStateSelector.ClientIdFederationId,
			fields: [
				'clientId',
				'federationId',
			],
		},
	],
	fields: [
		{
			name: 'clientId',
			label: 'client ID',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'clientName',
			label: 'client name',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'federationId',
			label: 'federation ID',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$federation',
			label: 'federation',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.FedimintFederation,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'inviteCode',
			label: 'invite code',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'mnemonicSet',
			label: 'mnemonic set',
			type: EntityFieldType.Primitive,
			primitiveType: type('boolean'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'guardianThreshold',
			label: 'guardian threshold',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'moduleConfigJson',
			label: 'module config JSON',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'joinedAt',
			label: 'joined AT',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'viewingKeyJson',
			label: 'viewing key JSON',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.BlockheadFedimintClientState_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
