import { type as arktype } from 'arktype'


const nostrRelayFeeEnvelope = arktype({
	amount: 'number',
	unit: 'string',
	'period?': 'number',
	'kinds?': 'number[]',
})

export const nostrRelayLimitationEnvelope = arktype({
	'max_message_length?': 'number',
	'max_subscriptions?': 'number',
	'max_filters?': 'number',
	'max_limit?': 'number',
	'max_subid_length?': 'number',
	'max_event_tags?': 'number',
	'max_content_length?': 'number',
	'min_pow_difficulty?': 'number',
	'auth_required?': 'boolean',
	'payment_required?': 'boolean',
	'restricted_writes?': 'boolean',
	'created_at_lower_limit?': 'number',
	'created_at_upper_limit?': 'number',
})

export const nostrRelayFeesEnvelope = arktype({
	'admission?': nostrRelayFeeEnvelope.array(),
	'subscription?': nostrRelayFeeEnvelope.array(),
	'publication?': nostrRelayFeeEnvelope.array(),
})

/** NIP-11 relay information document — all keys optional; present values fail-closed. */
export const nostrRelayInformationDocumentEnvelope = arktype({
	'name?': 'string',
	'description?': 'string',
	'pubkey?': 'string',
	'contact?': 'string',
	'supported_nips?': 'number[]',
	'software?': 'string',
	'version?': 'string',
	'limitation?': nostrRelayLimitationEnvelope,
	'fees?': nostrRelayFeesEnvelope,
	'payments_url?': 'string',
	'terms_of_service?': 'string',
	'icon?': 'string',
	'banner?': 'string',
	'language_tags?': 'string[]',
	'relay_countries?': 'string[]',
	'tags?': 'string[]',
})

export type NostrRelayLimitation = typeof nostrRelayLimitationEnvelope.infer
export type NostrRelayFees = typeof nostrRelayFeesEnvelope.infer
export type NostrRelayFee = typeof nostrRelayFeeEnvelope.infer
export type NostrRelayInformationDocument = typeof nostrRelayInformationDocumentEnvelope.infer
