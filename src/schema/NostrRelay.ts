// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum NostrRelaySelector {
	RelayUrl = 'RelayUrl',
}
export default {
	entityType: EntityType.NostrRelay,
	label: 'Nostr relay',
	labelPlural: 'Nostr relays',
	description: 'A Nostr relay is a WebSocket endpoint that can publish, store, and serve signed events; relay metadata is optional NIP-11 source data.',
	selectors: [
		{
			name: NostrRelaySelector.RelayUrl,
			fields: [
				'relayUrl',
			],
		},
	],
	fields: [
		{
			name: 'relayUrl',
			label: 'Relay URL',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'name',
			label: 'Name',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Constants_Internal,
				Source.NostrBand_Rest,
				Source.NostrRelay_Nip11_Http,
			],
		},
		{
			name: 'description',
			label: 'Description',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.NostrBand_Rest,
				Source.NostrRelay_Nip11_Http,
			],
		},
		{
			name: 'software',
			label: 'Software',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.NostrBand_Rest,
				Source.NostrRelay_Nip11_Http,
			],
		},
		{
			name: 'version',
			label: 'Version',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.NostrBand_Rest,
				Source.NostrRelay_Nip11_Http,
			],
		},
		{
			name: 'supportedNipCount',
			label: 'Supported NIPs',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.NostrBand_Rest,
				Source.NostrRelay_Nip11_Http,
			],
		},
		{
			name: 'isPaid',
			label: 'Paid relay',
			type: EntityFieldType.Primitive,
			primitiveType: type('boolean'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.NostrBand_Rest,
				Source.NostrRelay_Nip11_Http,
			],
		},
		{
			name: 'limit',
			label: 'Event limit',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.NostrBand_Rest,
				Source.NostrRelay_Nip11_Http,
			],
		},
		{
			name: '$$timestamps',
			label: 'Observations',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.NostrRelay_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
