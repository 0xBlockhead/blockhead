/**
 * Ogmios v6 JSON-RPC ledger/network query wires (fail-closed arktype).
 * @see https://ogmios.dev/mini-protocols/local-state-query/
 * @see https://github.com/CardanoSolutions/ogmios/blob/master/docs/static/ogmios.json
 * @see https://github.com/CardanoSolutions/ogmios/blob/master/docs/static/cardano.json
 */

import { type as arktype } from 'arktype'


const nonNegativeInteger = arktype('number.integer >= 0')
const blake2b256Hex = arktype('/^[0-9a-f]{64}$/')
const ratio = arktype('/^-?[0-9]+\\/[0-9]+$/')

const adaOnly = arktype({
	ada: {
		lovelace: 'number.integer >= 0',
	},
})

const numberOfBytes = arktype({
	bytes: nonNegativeInteger,
})


/** `Point` from `queryLedgerState/tip` / `queryNetwork/tip` (rejects `"origin"`). */
export const ogmiosPointWire = arktype({
	slot: nonNegativeInteger,
	id: blake2b256Hex,
})

export type OgmiosPoint = typeof ogmiosPointWire.infer


/** `queryNetwork/blockHeight` numeric tip (rejects `"origin"`). */
export const ogmiosBlockHeightWire = nonNegativeInteger

export type OgmiosBlockHeight = typeof ogmiosBlockHeightWire.infer


/** `queryLedgerState/epoch`. */
export const ogmiosEpochWire = nonNegativeInteger

export type OgmiosEpoch = typeof ogmiosEpochWire.infer


const executionUnits = arktype({
	memory: nonNegativeInteger,
	cpu: nonNegativeInteger,
})

const scriptExecutionPrices = arktype({
	memory: ratio,
	cpu: ratio,
})


/**
 * Conway-capable `queryLedgerState/protocolParameters` required core + optional Alonzo/Babbage leftovers.
 * Extra Conway governance keys are allowed via residual object properties on the transport assert.
 */
export const ogmiosProtocolParametersWire = arktype({
	minFeeCoefficient: nonNegativeInteger,
	minFeeConstant: adaOnly,
	minUtxoDepositCoefficient: nonNegativeInteger,
	minUtxoDepositConstant: adaOnly,
	maxBlockBodySize: numberOfBytes,
	maxBlockHeaderSize: numberOfBytes,
	'maxTransactionSize?': numberOfBytes,
	'maxValueSize?': numberOfBytes,
	stakeCredentialDeposit: adaOnly,
	stakePoolDeposit: adaOnly,
	stakePoolRetirementEpochBound: nonNegativeInteger,
	stakePoolPledgeInfluence: ratio,
	minStakePoolCost: adaOnly,
	monetaryExpansion: ratio,
	treasuryExpansion: ratio,
	desiredNumberOfStakePools: nonNegativeInteger,
	'federatedBlockProductionRatio?': ratio,
	'collateralPercentage?': nonNegativeInteger,
	'maxCollateralInputs?': nonNegativeInteger,
	'plutusCostModels?': 'unknown',
	'scriptExecutionPrices?': scriptExecutionPrices,
	'maxExecutionUnitsPerTransaction?': executionUnits,
	'maxExecutionUnitsPerBlock?': executionUnits,
	version: {
		major: nonNegativeInteger,
		minor: nonNegativeInteger,
		'patch?': nonNegativeInteger,
	},
})

export type OgmiosProtocolParameters = typeof ogmiosProtocolParametersWire.infer
