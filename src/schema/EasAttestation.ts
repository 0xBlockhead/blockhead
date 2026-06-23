import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { EvmAddress } from '$/schema/ZeroExHex.ts'
export enum EasAttestationSelector {
	NetworkUid = '$network+uid',
}
export default {
	entityType: EntityType.EasAttestation,
	label: 'eas attestation',
	labelPlural: 'eas attestations',
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
			label: 'network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmNetwork,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'uid',
			label: 'UID',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$schema',
			label: 'schema',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EasSchema,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'schemaUid',
			label: 'schema UID',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'recipient',
			label: 'recipient',
			type: EntityFieldType.Primitive,
			primitiveType: EvmAddress,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$recipientAccount',
			label: 'recipient account',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmNetworkAccount,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'attester',
			label: 'attester',
			type: EntityFieldType.Primitive,
			primitiveType: EvmAddress,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$attesterAccount',
			label: 'attester account',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmNetworkAccount,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'refUid',
			label: 'ref UID',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$refAttestation',
			label: 'ref attestation',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EasAttestation,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'attestedAt',
			label: 'attested AT',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'expirationTime',
			label: 'expiration time',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'revocable',
			label: 'revocable',
			type: EntityFieldType.Primitive,
			primitiveType: type("boolean"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'data',
			label: 'data',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.EasAttestation_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
