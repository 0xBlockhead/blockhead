/**
 * EigenExplorer REST envelopes (fail-closed arktype).
 * @see https://docs.eigenexplorer.com/llms.txt
 */

import { type as arktype } from 'arktype'


const eigenExplorerPageMetaEnvelope = arktype({
	total: 'number',
	skip: 'number',
	take: 'number',
}).onUndeclaredKey('delete')

export const eigenExplorerStrategySharesEnvelope = arktype({
	strategyAddress: 'string',
	shares: 'string',
}).onUndeclaredKey('delete')

export type EigenExplorerStrategyShares = typeof eigenExplorerStrategySharesEnvelope.infer

export const eigenExplorerStakerEnvelope = arktype({
	address: 'string',
	operatorAddress: 'string | null',
	createdAtBlock: 'string',
	updatedAtBlock: 'string',
	createdAt: 'string',
	updatedAt: 'string',
	shares: eigenExplorerStrategySharesEnvelope.array(),
}).onUndeclaredKey('delete')

export type EigenExplorerStaker = typeof eigenExplorerStakerEnvelope.infer

export const eigenExplorerDepositEnvelope = arktype({
	transactionHash: 'string',
	stakerAddress: 'string',
	tokenAddress: 'string',
	strategyAddress: 'string',
	shares: 'string',
	createdAtBlock: 'number',
	createdAt: 'string',
}).onUndeclaredKey('delete')

export type EigenExplorerDeposit = typeof eigenExplorerDepositEnvelope.infer

export const eigenExplorerWithdrawalEnvelope = arktype({
	withdrawalRoot: 'string',
	nonce: 'number',
	stakerAddress: 'string',
	delegatedTo: 'string',
	withdrawerAddress: 'string',
	shares: eigenExplorerStrategySharesEnvelope.array(),
	createdAtBlock: 'number',
	createdAt: 'string',
	updatedAtBlock: 'number',
	updatedAt: 'string',
	isCompleted: 'boolean',
}).onUndeclaredKey('delete')

export type EigenExplorerWithdrawal = typeof eigenExplorerWithdrawalEnvelope.infer

export const eigenExplorerOperatorRewardInfoEnvelope = arktype({
	address: 'string',
	rewardTokens: 'string[]',
	rewardStrategies: 'string[]',
}).onUndeclaredKey('delete')

export type EigenExplorerOperatorRewardInfo = typeof eigenExplorerOperatorRewardInfoEnvelope.infer

export const eigenExplorerAvsRegistrationEnvelope = arktype({
	avsAddress: 'string',
	isActive: 'boolean',
}).onUndeclaredKey('delete')

export type EigenExplorerAvsRegistration = typeof eigenExplorerAvsRegistrationEnvelope.infer

export const eigenExplorerOperatorEnvelope = arktype({
	address: 'string',
	metadataName: 'string',
	metadataDescription: 'string | null',
	metadataWebsite: 'string | null',
	metadataLogo: 'string | null',
	createdAtBlock: 'string',
	updatedAtBlock: 'string',
	createdAt: 'string',
	updatedAt: 'string',
	shares: eigenExplorerStrategySharesEnvelope.array(),
	'totalStakers?': 'number',
	'totalAvs?': 'number',
	'avsRegistrations?': eigenExplorerAvsRegistrationEnvelope.array(),
}).onUndeclaredKey('delete')

export type EigenExplorerOperator = typeof eigenExplorerOperatorEnvelope.infer

export const eigenExplorerAvsEnvelope = arktype({
	address: 'string',
	metadataName: 'string',
	metadataDescription: 'string | null',
	metadataWebsite: 'string | null',
	metadataLogo: 'string | null',
	totalStakers: 'number',
	totalOperators: 'number',
	createdAtBlock: 'string',
	updatedAtBlock: 'string',
	createdAt: 'string',
	updatedAt: 'string',
	shares: eigenExplorerStrategySharesEnvelope.array(),
}).onUndeclaredKey('delete')

export type EigenExplorerAvs = typeof eigenExplorerAvsEnvelope.infer

export const eigenExplorerAllocationEnvelope = arktype({
	avsAddress: 'string',
	operatorSetId: 'number',
	operatorAddress: 'string',
	strategyAddress: 'string',
	magnitude: 'string',
	effectBlock: 'number',
	createdAt: 'string',
	createdAtBlock: 'number',
	updatedAt: 'string',
	updatedAtBlock: 'number',
}).onUndeclaredKey('delete')

export type EigenExplorerAllocation = typeof eigenExplorerAllocationEnvelope.infer

export const eigenExplorerSlashEnvelope = arktype({
	avsAddress: 'string',
	operatorSetId: 'number',
	operatorAddress: 'string',
	strategies: 'string[]',
	wadSlashed: 'string[]',
	description: 'string',
	createdAt: 'string',
	createdAtBlock: 'number',
	updatedAt: 'string',
	updatedAtBlock: 'number',
}).onUndeclaredKey('delete')

export type EigenExplorerSlash = typeof eigenExplorerSlashEnvelope.infer

export const eigenExplorerRewardStrategyEnvelope = arktype({
	strategyAddress: 'string',
	tokens: 'string[]',
}).onUndeclaredKey('delete')

export type EigenExplorerRewardStrategy = typeof eigenExplorerRewardStrategyEnvelope.infer

export type EigenExplorerPage<_Row> = {
	data: _Row[]
	meta: {
		total: number
		skip: number
		take: number
	}
}

export const eigenExplorerDepositPageEnvelope = arktype({
	data: eigenExplorerDepositEnvelope.array(),
	meta: eigenExplorerPageMetaEnvelope,
}).onUndeclaredKey('delete')

export const eigenExplorerWithdrawalPageEnvelope = arktype({
	data: eigenExplorerWithdrawalEnvelope.array(),
	meta: eigenExplorerPageMetaEnvelope,
}).onUndeclaredKey('delete')

export const eigenExplorerOperatorPageEnvelope = arktype({
	data: eigenExplorerOperatorEnvelope.array(),
	meta: eigenExplorerPageMetaEnvelope,
}).onUndeclaredKey('delete')

export const eigenExplorerAvsPageEnvelope = arktype({
	data: eigenExplorerAvsEnvelope.array(),
	meta: eigenExplorerPageMetaEnvelope,
}).onUndeclaredKey('delete')

export const eigenExplorerAllocationPageEnvelope = arktype({
	data: eigenExplorerAllocationEnvelope.array(),
	meta: eigenExplorerPageMetaEnvelope,
}).onUndeclaredKey('delete')

export const eigenExplorerSlashPageEnvelope = arktype({
	data: eigenExplorerSlashEnvelope.array(),
	meta: eigenExplorerPageMetaEnvelope,
}).onUndeclaredKey('delete')

export const eigenExplorerRewardStrategiesEnvelope = arktype({
	strategies: eigenExplorerRewardStrategyEnvelope.array(),
	total: 'number',
}).onUndeclaredKey('delete')

export const eigenExplorerStrategyTvlEnvelope = arktype({
	tvl: 'number',
	tvlEth: 'number',
	'change24h?': {
		value: 'number',
		percent: 'number',
	},
	'change7d?': {
		value: 'number',
		percent: 'number',
	},
}).onUndeclaredKey('delete')

export type EigenExplorerStrategyTvl = typeof eigenExplorerStrategyTvlEnvelope.infer

export const eigenExplorerOperatorMagnitudeEnvelope = arktype({
	operatorAddress: 'string',
	strategyAddress: 'string',
	maxMagnitude: 'string',
	encumberedMagnitude: 'string',
	createdAt: 'string',
	createdAtBlock: 'number',
	updatedAt: 'string',
	updatedAtBlock: 'number',
}).onUndeclaredKey('delete')

export type EigenExplorerOperatorMagnitude = typeof eigenExplorerOperatorMagnitudeEnvelope.infer

export const eigenExplorerOperatorAllocationDelayEnvelope = arktype({
	operatorAddress: 'string',
	delay: 'number',
	effectBlock: 'number',
	createdAt: 'string',
	createdAtBlock: 'number',
	updatedAt: 'string',
	updatedAtBlock: 'number',
}).onUndeclaredKey('delete')

export type EigenExplorerOperatorAllocationDelay = typeof eigenExplorerOperatorAllocationDelayEnvelope.infer
