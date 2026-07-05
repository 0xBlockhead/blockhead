// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { EvmAddress, ZeroExHex } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export enum EasAttestationSelector {
	NetworkUid = 'NetworkUid',
}
export default {
	entityType: EntityType.EasAttestation,
	label: 'EAS attestation',
	labelPlural: 'EAS attestations',
	selectors: [
		{
			name: EasAttestationSelector.NetworkUid,
			fields: [
				'$network',
				'uid',
			],
		},
	],
	fields: [
		{
				name: '$network',
				label: 'Network',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.EvmNetwork,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'uid',
				label: 'UID',
				type: EntityFieldType.Primitive,
				primitiveType: (ZeroExHex),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: '$schema',
				label: 'Schema',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.EasSchema,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'schemaUid',
				label: 'Schema UID',
				type: EntityFieldType.Primitive,
				primitiveType: (ZeroExHex),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'recipient',
				label: 'Recipient',
				type: EntityFieldType.Primitive,
				primitiveType: (EvmAddress),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: '$recipientAccount',
				label: 'Recipient account',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.EvmNetworkAccount,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'attester',
				label: 'Attester',
				type: EntityFieldType.Primitive,
				primitiveType: (EvmAddress),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: '$attesterAccount',
				label: 'Attester account',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.EvmNetworkAccount,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'refUid',
				label: 'Ref UID',
				type: EntityFieldType.Primitive,
				primitiveType: (ZeroExHex),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$refAttestation',
				label: 'Ref attestation',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.EasAttestation,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'attestedAt',
				label: 'Attested at',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'expirationTime',
				label: 'Expiration time',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'revocable',
				label: 'Revocable',
				type: EntityFieldType.Primitive,
				primitiveType: type('boolean'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'data',
				label: 'Data',
				type: EntityFieldType.Primitive,
				primitiveType: (ZeroExHex),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$$timestamps',
				label: 'Timestamps',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.EasAttestation_Timestamp,
				cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
