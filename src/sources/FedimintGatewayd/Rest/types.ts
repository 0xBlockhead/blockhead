/**
 * Fedimint gatewayd REST envelopes (fail-closed arktype).
 * @see https://docs.fedimint.org/fedimint_gateway_common/index.html
 * @see https://docs.fedimint.org/src/fedimint_gateway_common/lib.rs.html — `/info`, `/balances`, `/list_channels`, `/payment_summary`
 */

import { type as arktype } from 'arktype'


const nonEmptyString = arktype('string > 0')
const nonNegativeInteger = arktype('number.integer >= 0')
/** Amount is `#[serde(transparent)]` over `msats: u64`. */
const amountMsatWire = nonNegativeInteger
const federationIdWire = nonEmptyString
const publicKeyWire = nonEmptyString

export const fedimintPaymentFeeWire = arktype({
	base: amountMsatWire,
	parts_per_million: nonNegativeInteger,
}).onUndeclaredKey('delete')

export const fedimintFederationConfigWire = arktype({
	invite_code: nonEmptyString,
	federation_index: nonNegativeInteger,
	lightning_fee: fedimintPaymentFeeWire,
	transaction_fee: fedimintPaymentFeeWire,
}).onUndeclaredKey('delete')

export const fedimintFederationInfoWire = arktype({
	federation_id: federationIdWire,
	'federation_name?': nonEmptyString.or(arktype('null')),
	balance_msat: amountMsatWire,
	config: fedimintFederationConfigWire,
	'last_backup_time?': 'unknown',
}).onUndeclaredKey('delete')

export type FedimintFederationInfoWire = typeof fedimintFederationInfoWire.infer

export const fedimintLightningInfoConnectedWire = arktype({
	public_key: publicKeyWire,
	alias: 'string',
	network: nonEmptyString,
	block_height: nonNegativeInteger,
	synced_to_chain: 'boolean',
})

/** No `onUndeclaredKey` morphs here — arktype rejects morph∪object overlap as indeterminate. */
export const fedimintLightningInfoWire = arktype({
	connected: fedimintLightningInfoConnectedWire,
}).or({
	not_connected: 'unknown',
}).or('"not_connected"')

export const fedimintGatewayInfoWire = arktype({
	version_hash: nonEmptyString,
	federations: fedimintFederationInfoWire.array(),
	'federation_fake_scids?': 'Record<string, string>',
	'channels?': 'Record<string, string>',
	gateway_state: nonEmptyString,
	lightning_info: fedimintLightningInfoWire,
	lightning_mode: 'unknown',
	registrations: 'Record<string, unknown>',
}).onUndeclaredKey('delete')

export type FedimintGatewayInfoWire = typeof fedimintGatewayInfoWire.infer

export const fedimintFederationBalanceInfoWire = arktype({
	federation_id: federationIdWire,
	ecash_balance_msats: amountMsatWire,
}).onUndeclaredKey('delete')

export const fedimintGatewayBalancesWire = arktype({
	onchain_balance_sats: nonNegativeInteger,
	lightning_balance_msats: nonNegativeInteger,
	ecash_balances: fedimintFederationBalanceInfoWire.array(),
	inbound_lightning_liquidity_msats: nonNegativeInteger,
}).onUndeclaredKey('delete')

export type FedimintGatewayBalancesWire = typeof fedimintGatewayBalancesWire.infer

export const fedimintChannelInfoWire = arktype({
	remote_pubkey: publicKeyWire,
	channel_size_sats: nonNegativeInteger,
	outbound_liquidity_sats: nonNegativeInteger,
	inbound_liquidity_sats: nonNegativeInteger,
	is_active: 'boolean',
	'funding_outpoint?': 'unknown',
	'remote_node_alias?': 'string | null',
	'remote_address?': 'string | null',
	'base_fee_msat?': nonNegativeInteger.or(arktype('null')),
	'parts_per_million?': nonNegativeInteger.or(arktype('null')),
}).onUndeclaredKey('delete')

export const fedimintListChannelsWire = fedimintChannelInfoWire.array()

export type FedimintListChannelsWire = typeof fedimintListChannelsWire.infer

export const fedimintPaymentStatsWire = arktype({
	'average_latency?': 'unknown',
	'median_latency?': 'unknown',
	total_fees: amountMsatWire,
	total_success: nonNegativeInteger,
	total_failure: nonNegativeInteger,
}).onUndeclaredKey('delete')

export const fedimintPaymentSummaryWire = arktype({
	outgoing: fedimintPaymentStatsWire,
	incoming: fedimintPaymentStatsWire,
}).onUndeclaredKey('delete')

export type FedimintPaymentSummaryWire = typeof fedimintPaymentSummaryWire.infer
