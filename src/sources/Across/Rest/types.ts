import { type as arktype } from 'arktype'

export type AcrossDepositStatus =
	| 'pending'
	| 'received'
	| 'filled'
	| 'expired'
	| 'refunded'

export type AcrossDeposit = {
	id: number
	relayHash: string | null
	depositId: string | null
	originChainId: number
	destinationChainId: number
	depositor: string
	recipient: string
	exclusiveRelayer: string | null
	inputToken: string
	inputAmount: string
	outputToken: string
	outputAmount: string
	message: string
	messageHash: string | null
	exclusivityDeadline: string | null
	fillDeadline: string | null
	quoteTimestamp: string
	depositTxnRef: string
	depositBlockNumber: number
	depositBlockTimestamp: string
	status: AcrossDepositStatus
	depositRefundTxnRef: string | null
	bridgeFeeUsd: string | null
	fillGasFee: string | null
	fillGasFeeUsd: string | null
	relayer: string | null
	fillBlockNumber?: number | null
	fillBlockTimestamp: string | null
	fillTxnRef: string | null
	speedups: object[]
}

export type AcrossDepositResponse = {
	deposit: AcrossDeposit
	pagination: {
		currentIndex: number
		maxIndex: number
	}
}

export type AcrossDepositStatusResponse = {
	status: AcrossDepositStatus
	originChainId: number
	depositId: string
	depositTxnRef: string
	fillTxnRef: string | null
	destinationChainId: number
	depositRefundTxnRef: string | null
	actionsSucceeded: boolean | null
	originToken: string | null
	destinationToken: string | null
	pagination: {
		currentIndex: number
		maxIndex: number
	}
}

export type AcrossFeeComponent = {
	pct: string
	total: string
}

export type AcrossSuggestedFees = {
	estimatedFillTimeSec: number
	capitalFeePct: string
	capitalFeeTotal: string
	relayGasFeePct: string
	relayGasFeeTotal: string
	relayFeePct: string
	relayFeeTotal: string
	lpFeePct: string
	timestamp: string
	isAmountTooLow: boolean
	quoteBlock: string
	exclusiveRelayer: string
	exclusivityDeadline: number
	spokePoolAddress: string
	destinationSpokePoolAddress: string
	totalRelayFee: AcrossFeeComponent
	relayerCapitalFee: AcrossFeeComponent
	relayerGasFee: AcrossFeeComponent
	lpFee: AcrossFeeComponent
	limits: {
		minDeposit: string
		maxDeposit: string
		maxDepositInstant: string
		maxDepositShortDelay: string
		recommendedDepositInstant: string
	}
	fillDeadline: string
	outputAmount: string
	inputToken: {
		address: string
		symbol: string
		decimals: number
		chainId: number
	}
	outputToken: {
		address: string
		symbol: string
		decimals: number
		chainId: number
	}
	id: string
}


export const acrossDepositStatusEnvelope = arktype(
	"'pending' | 'received' | 'filled' | 'expired' | 'refunded'"
)

export const acrossDepositEnvelope = arktype({
	id: 'number',
	relayHash: 'string | null',
	depositId: 'string | null',
	originChainId: 'number',
	destinationChainId: 'number',
	depositor: 'string',
	recipient: 'string',
	exclusiveRelayer: 'string | null',
	inputToken: 'string',
	inputAmount: 'string',
	outputToken: 'string',
	outputAmount: 'string',
	message: 'string',
	messageHash: 'string | null',
	exclusivityDeadline: 'string | null',
	fillDeadline: 'string | null',
	quoteTimestamp: 'string',
	depositTxnRef: 'string',
	depositBlockNumber: 'number',
	depositBlockTimestamp: 'string',
	status: acrossDepositStatusEnvelope,
	depositRefundTxnRef: 'string | null',
	bridgeFeeUsd: 'string | null',
	fillGasFee: 'string | null',
	fillGasFeeUsd: 'string | null',
	relayer: 'string | null',
	'fillBlockNumber?': 'number | null',
	fillBlockTimestamp: 'string | null',
	fillTxnRef: 'string | null',
	speedups: 'object[]',
})

export const acrossDepositDetailResponseEnvelope = arktype({
	deposit: acrossDepositEnvelope.omit(
		'originChainId',
		'destinationChainId',
		'depositTxnRef',
		'fillTxnRef',
		'depositRefundTxnRef',
		'speedups'
	).and({
		originChainId: 'number | string',
		destinationChainId: 'number | string',
		'depositTxnRef?': 'string',
		'depositTxHash?': 'string',
		'fillTxnRef?': 'string | null',
		'fillTx?': 'string | null',
		'depositRefundTxnRef?': 'string | null',
		'depositRefundTxHash?': 'string | null',
		'speedups?': 'object[]',
	}),
	pagination: {
		currentIndex: 'number',
		maxIndex: 'number',
	},
})

export const acrossDepositResponseEnvelope = arktype({
	deposit: acrossDepositEnvelope,
	pagination: {
		currentIndex: 'number',
		maxIndex: 'number',
	},
})

export const acrossDepositStatusResponseEnvelope = arktype({
	status: acrossDepositStatusEnvelope,
	originChainId: 'number',
	depositId: 'string',
	depositTxnRef: 'string',
	fillTxnRef: 'string | null',
	destinationChainId: 'number',
	depositRefundTxnRef: 'string | null',
	actionsSucceeded: 'boolean | null',
	originToken: 'string | null',
	destinationToken: 'string | null',
	pagination: {
		currentIndex: 'number',
		maxIndex: 'number',
	},
})

export const acrossDepositsEnvelope = acrossDepositEnvelope.array()

const acrossFeeComponentEnvelope = arktype({
	pct: 'string',
	total: 'string',
})

const acrossSuggestedFeeTokenEnvelope = arktype({
	address: 'string',
	symbol: 'string',
	decimals: 'number',
	chainId: 'number',
})

export const acrossSuggestedFeesEnvelope = arktype({
	estimatedFillTimeSec: 'number',
	capitalFeePct: 'string',
	capitalFeeTotal: 'string',
	relayGasFeePct: 'string',
	relayGasFeeTotal: 'string',
	relayFeePct: 'string',
	relayFeeTotal: 'string',
	lpFeePct: 'string',
	timestamp: 'string',
	isAmountTooLow: 'boolean',
	quoteBlock: 'string',
	exclusiveRelayer: 'string',
	exclusivityDeadline: 'number',
	spokePoolAddress: 'string',
	destinationSpokePoolAddress: 'string',
	totalRelayFee: acrossFeeComponentEnvelope,
	relayerCapitalFee: acrossFeeComponentEnvelope,
	relayerGasFee: acrossFeeComponentEnvelope,
	lpFee: acrossFeeComponentEnvelope,
	limits: {
		minDeposit: 'string',
		maxDeposit: 'string',
		maxDepositInstant: 'string',
		maxDepositShortDelay: 'string',
		recommendedDepositInstant: 'string',
	},
	fillDeadline: 'string',
	outputAmount: 'string',
	inputToken: acrossSuggestedFeeTokenEnvelope,
	outputToken: acrossSuggestedFeeTokenEnvelope,
	id: 'string',
})
