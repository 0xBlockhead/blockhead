// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.NostrRelay_Timestamp,
	labels: {
		singular: 'Nostr relay timestamp',
		plural: 'Nostr relay observations',
	},
})({
	$relay: {
		label: 'Relay',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.NostrRelay,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		label: 'Timestamp',
		description: 'The observation time in Unix milliseconds.',
		type: EntityFieldType.Primitive,
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		description: 'The source that produced this observation.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	name: {
		label: 'Name',
		description: 'The human-readable name of the subject.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	description: {
		label: 'Description',
		description: 'A human-readable description from the source domain.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	software: {
		label: 'Software',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	version: {
		label: 'Version',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	supportedNips: {
		label: 'Supported NIPs',
		type: EntityFieldType.Primitive,
		primitiveType: type('number').array(),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	limitation: {
		label: 'Limitations',
		type: EntityFieldType.Primitive,
		primitiveType: type({ 'maxMessageLength?': type('number'), 'maxSubscriptions?': type('number'), 'maxFilters?': type('number'), 'maxLimit?': type('number'), 'maxSubscriptionIdLength?': type('number'), 'maxEventTags?': type('number'), 'maxContentLength?': type('number'), 'minimumProofOfWorkDifficulty?': type('number'), 'authenticationRequired?': type('boolean'), 'paymentRequired?': type('boolean'), 'restrictedWrites?': type('boolean'), 'createdAtLowerLimit?': type('number'), 'createdAtUpperLimit?': type('number') }),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	fees: {
		label: 'Fees',
		type: EntityFieldType.Primitive,
		primitiveType: type({ 'admission?': type({ 'amount': type('number'), 'unit': type('string'), 'period?': type('number'), 'kinds?': type('number').array() }).array(), 'subscription?': type({ 'amount': type('number'), 'unit': type('string'), 'period?': type('number'), 'kinds?': type('number').array() }).array(), 'publication?': type({ 'amount': type('number'), 'unit': type('string'), 'period?': type('number'), 'kinds?': type('number').array() }).array() }),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	paymentsUrl: {
		label: 'Payments URL',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	termsOfServiceUrl: {
		label: 'Terms of service URL',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	iconUrl: {
		label: 'Icon URL',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	bannerUrl: {
		label: 'Banner URL',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	pubkey: {
		label: 'Public key',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	contact: {
		label: 'Contact',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	isPaid: {
		label: 'Paid relay',
		type: EntityFieldType.Primitive,
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	activeUsers: {
		label: 'Active users',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	eventsPerDay: {
		label: 'Events per day',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	rank: {
		label: 'Rank',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	reachable: {
		label: 'Reachable',
		type: EntityFieldType.Primitive,
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	error: {
		label: 'Error',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		RelayTimestampMsSource: [
			'$relay',
			'timestampMs',
			'source',
		],
	},
})
