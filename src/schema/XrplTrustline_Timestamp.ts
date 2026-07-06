// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum XrplTrustline_TimestampSelector {
	TrustlineLedgerIndexSource = 'TrustlineLedgerIndexSource',
}
export default {
	entityType: EntityType.XrplTrustline_Timestamp,
	label: 'xrpl trustline timestamp',
	labelPlural: 'xrpl trustline observations',
	selectors: [
		{
			name: XrplTrustline_TimestampSelector.TrustlineLedgerIndexSource,
			fields: [
				'$trustline',
				'ledgerIndex',
				'source',
			],
		},
	],
	fields: [
		{
			name: '$trustline',
			label: 'trustline',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.XrplTrustline,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'ledgerIndex',
			label: 'ledger index',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'source',
			label: 'Source',
			description: 'The source that produced this observation.',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'timestampMs',
			label: 'Timestamp',
			description: 'The observation time in Unix milliseconds.',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'balance',
			label: 'balance',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'limit',
			label: 'limit',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'limitPeer',
			label: 'limit peer',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'noRipple',
			label: 'no ripple',
			type: EntityFieldType.Primitive,
			primitiveType: type('boolean'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'noRipplePeer',
			label: 'no ripple peer',
			type: EntityFieldType.Primitive,
			primitiveType: type('boolean'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'authorized',
			label: 'authorized',
			type: EntityFieldType.Primitive,
			primitiveType: type('boolean'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'peerAuthorized',
			label: 'peer authorized',
			type: EntityFieldType.Primitive,
			primitiveType: type('boolean'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
