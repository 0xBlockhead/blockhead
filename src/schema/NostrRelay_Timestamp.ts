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
		entityType: EntityType.NostrRelay,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	name: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	description: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	software: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	version: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	supportedNips: {
		primitiveType: type('number').array(),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	limitation: {
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
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	termsOfServiceUrl: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	iconUrl: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	bannerUrl: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	pubkey: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	contact: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	isPaid: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	reachable: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	error: {
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
