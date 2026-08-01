// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
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
		entityType: EntityType.NostrRelay,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		label: 'Timestamp',
		description: 'The observation time in Unix milliseconds.',
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		description: 'The source that produced this observation.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	name: {
		label: 'Name',
		description: 'The human-readable name of the subject.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	description: {
		label: 'Description',
		description: 'A human-readable description from the source domain.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	software: {
		label: 'Software',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	version: {
		label: 'Version',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	supportedNips: {
		label: 'Supported NIPs',
		primitiveType: type('number').array(),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	limitation: {
		label: 'Limitations',
		primitiveType: type({
			'maxMessageLength?': type('number'),
			'maxSubscriptions?': type('number'),
			'maxFilters?': type('number'),
			'maxLimit?': type('number'),
			'maxSubscriptionIdLength?': type('number'),
			'maxEventTags?': type('number'),
			'maxContentLength?': type('number'),
			'minimumProofOfWorkDifficulty?': type('number'),
			'authenticationRequired?': type('boolean'),
			'paymentRequired?': type('boolean'),
			'restrictedWrites?': type('boolean'),
			'createdAtLowerLimit?': type('number'),
			'createdAtUpperLimit?': type('number'),
		}),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	fees: {
		label: 'Fees',
		primitiveType: type({
			'admission?': type({
				amount: type('number'),
				unit: type('string'),
				'period?': type('number'),
				'kinds?': type('number').array(),
			}).array(),
			'subscription?': type({
				amount: type('number'),
				unit: type('string'),
				'period?': type('number'),
				'kinds?': type('number').array(),
			}).array(),
			'publication?': type({
				amount: type('number'),
				unit: type('string'),
				'period?': type('number'),
				'kinds?': type('number').array(),
			}).array(),
		}),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	paymentsUrl: {
		label: 'Payments URL',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	termsOfServiceUrl: {
		label: 'Terms of service URL',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	iconUrl: {
		label: 'Icon URL',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	bannerUrl: {
		label: 'Banner URL',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	pubkey: {
		label: 'Public key',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	contact: {
		label: 'Contact',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	isPaid: {
		label: 'Paid relay',
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	activeUsers: {
		label: 'Active users',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	eventsPerDay: {
		label: 'Events per day',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	rank: {
		label: 'Rank',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	reachable: {
		label: 'Reachable',
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	error: {
		label: 'Error',
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
