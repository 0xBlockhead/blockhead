/**
 * Cardanoscan REST v1 wire envelopes (fail-closed arktype).
 * @see https://docs.cardanoscan.io/
 * @see https://github.com/StricaHQ/cardanoscan-js/blob/master/src/types/resTypes.ts
 */

import { type as arktype } from 'arktype'


const unsignedSafe = arktype('number.integer >= 0')
	.and(arktype(`number <= ${Number.MAX_SAFE_INTEGER}`))
const nonEmptyString = arktype('string > 0')
const lovelaceQuantity = arktype('/^(0|[1-9][0-9]*)$/')
const blake2b256Hex = arktype('/^[0-9a-fA-F]{64}$/')
const policyIdHex = arktype('/^[0-9a-fA-F]{56}$/')
const assetNameHex = arktype('/^[0-9a-fA-F]*$/')
const isoTimestamp = arktype('string > 0')


export const cardanoscanBlockWire = arktype({
	hash: blake2b256Hex,
	previousBlockHash: blake2b256Hex.or(arktype('null')),
	blockHeight: unsignedSafe,
	totalFees: lovelaceQuantity,
	slot: unsignedSafe,
	epoch: unsignedSafe,
	absSlot: unsignedSafe,
	timestamp: isoTimestamp,
	txCount: unsignedSafe,
	assetTxCount: unsignedSafe,
	totalOutput: lovelaceQuantity,
	slotLeader: nonEmptyString.or(arktype('null')),
	bodySize: unsignedSafe,
	'protocolVersion?': 'string',
	'vrfVKey?': 'string',
	'vrfResult?': arktype('string').array(),
	'operationalCert?': {
		hotVKey: nonEmptyString,
		sequenceNumber: unsignedSafe,
		kesPeriod: unsignedSafe,
		sigma: nonEmptyString,
	},
})

export type CardanoscanBlock = typeof cardanoscanBlockWire.infer


export const cardanoscanAddressBalanceWire = arktype({
	hash: nonEmptyString,
	balance: lovelaceQuantity,
})

export type CardanoscanAddressBalance = typeof cardanoscanAddressBalanceWire.infer


export const cardanoscanTokenWire = arktype({
	policyId: policyIdHex,
	assetName: assetNameHex,
	fingerprint: nonEmptyString,
	assetId: nonEmptyString,
	totalSupply: lovelaceQuantity,
	txCount: unsignedSafe,
	mintedOn: isoTimestamp,
})

export type CardanoscanToken = typeof cardanoscanTokenWire.infer


const cardanoscanTxAssetWire = arktype({
	policyId: policyIdHex,
	assetName: assetNameHex,
	fingerprint: nonEmptyString,
	assetId: nonEmptyString,
	value: lovelaceQuantity,
})

export const cardanoscanTransactionWire = arktype({
	hash: blake2b256Hex,
	blockHash: blake2b256Hex,
	fees: lovelaceQuantity,
	slot: unsignedSafe,
	epoch: unsignedSafe,
	blockHeight: unsignedSafe,
	absSlot: unsignedSafe,
	timestamp: isoTimestamp,
	index: unsignedSafe,
	status: 'boolean',
	'ttl?': {
		timestamp: isoTimestamp,
		slot: unsignedSafe,
	},
	'mint?': cardanoscanTxAssetWire.array(),
	'metadata?': 'unknown',
})

export type CardanoscanTransaction = typeof cardanoscanTransactionWire.infer


export const cardanoscanPoolWire = arktype({
	poolId: nonEmptyString,
	'vrfKeyHash?': blake2b256Hex,
	status: 'boolean',
	'name?': 'string | null | undefined',
	'ticker?': 'string | null | undefined',
	'website?': 'string | null | undefined',
	'description?': 'string | null | undefined',
	'margin?': 'string | undefined',
	'cost?': lovelaceQuantity,
	'declaredPledge?': lovelaceQuantity,
	'rewardAccount?': 'string | undefined',
	'owners?': arktype('string').array(),
	'metadata?': {
		url: 'string | null',
		metadataHash: 'string | null',
	},
})

export type CardanoscanPool = typeof cardanoscanPoolWire.infer


export const cardanoscanPoolStatsWire = arktype({
	poolId: nonEmptyString,
	lifetimeBlocks: unsignedSafe,
	currentEpochBlocks: unsignedSafe,
	lifetimeRewards: lovelaceQuantity,
	activePledge: lovelaceQuantity,
	interest: 'number',
	liveStake: lovelaceQuantity,
	saturationLevel: nonEmptyString,
})

export type CardanoscanPoolStats = typeof cardanoscanPoolStatsWire.infer


export const cardanoscanPaginatedPoolsWire = arktype({
	pageNo: unsignedSafe,
	limit: unsignedSafe,
	count: unsignedSafe,
	pools: cardanoscanPoolWire.array(),
})

export type CardanoscanPaginatedPools = typeof cardanoscanPaginatedPoolsWire.infer


export const cardanoscanStakeKeyWire = arktype({
	rewardAddress: nonEmptyString,
	'poolId?': 'string | null | undefined',
	'stake?': lovelaceQuantity,
	'status?': 'boolean | undefined',
	'rewardsAvailable?': lovelaceQuantity,
	'rewardsWithdrawn?': lovelaceQuantity,
})

export type CardanoscanStakeKey = typeof cardanoscanStakeKeyWire.infer


export const cardanoscanNetworkStateWire = arktype({
	circulatingSupply: lovelaceQuantity,
	reserves: lovelaceQuantity,
	treasury: lovelaceQuantity,
	liveCirculatingSupply: lovelaceQuantity,
})

export type CardanoscanNetworkState = typeof cardanoscanNetworkStateWire.infer


export const cardanoscanNetworkProtocolWire = arktype({
	minFeeA: lovelaceQuantity,
	minFeeB: lovelaceQuantity,
	stakeKeyDeposit: lovelaceQuantity,
	poolDeposit: lovelaceQuantity,
	maxTxSize: lovelaceQuantity,
	maxValueSize: lovelaceQuantity,
	utxoCostPerByte: lovelaceQuantity,
	collateralPercent: lovelaceQuantity,
	networkMagic: unsignedSafe,
	'lovelacePerUtxoWord?': lovelaceQuantity,
	'priceSteps?': 'string | undefined',
	'priceMem?': 'string | undefined',
	'maxTokenValue?': lovelaceQuantity,
	'languageView?': 'unknown',
})

export type CardanoscanNetworkProtocol = typeof cardanoscanNetworkProtocolWire.infer


export const assertCardanoscanEnvelope = <_Value>(
	wire: {
		assert: (value: unknown) => _Value
	},
	response: unknown,
	label: string
): _Value => {
	try {
		return wire.assert(response)
	} catch {
		throw new Error(`Cardanoscan_Rest: invalid ${label} envelope`)
	}
}
