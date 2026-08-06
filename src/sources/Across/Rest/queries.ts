import { sourceGetJson } from '$/sources/_runtime/http.ts'
import { httpUrl } from '$/sources/_shared/wire/HttpRest/client.ts'
import bindings from '$/sources/Across/bindings.ts'
import {
	acrossChainByChainId,
	acrossDepositStatusByStatus,
} from '$/sources/Across/Rest/constants.ts'
import type {
	AcrossDeposit,
	AcrossDepositResponse,
	AcrossDepositStatus,
	AcrossDepositStatusResponse,
	AcrossSuggestedFees,
} from '$/sources/Across/Rest/types.ts'
import {
	acrossDepositResponseEnvelope,
	acrossDepositStatusResponseEnvelope,
	acrossDepositsEnvelope,
	acrossSuggestedFeesEnvelope,
} from '$/sources/Across/Rest/types.ts'
import { Source } from '$/sources/Source.ts'

const binding = bindings[Source.Across_Rest][0]
const integerStringPattern = /^(?:0|[1-9]\d*)$/
const decimalStringPattern = /^-?(?:0|[1-9]\d*)(?:\.\d+)?$/

const fetchAcrossJson = <_Json>(path: string) => (
	sourceGetJson<_Json>(binding, httpUrl(binding, path))
)

const assertEnvelope = (
	envelope: {
		assert: (value: unknown) => unknown
	},
	value: unknown,
	label: string
) => {
	try {
		envelope.assert(value)
	} catch {
		throw new Error(`Across_Rest: invalid ${label} response envelope`)
	}
}

const assertChainId = (chainId: number) => {
	if (!Number.isSafeInteger(chainId) || chainId < 1)
		throw new Error(`Across_Rest: invalid chain id ${chainId}`)
	if (acrossChainByChainId[chainId] == null)
		throw new Error(`Across_Rest: unsupported chain id ${chainId}`)
}

const assertDepositLifecycle = ({
	status,
	fillTxnRef,
	depositRefundTxnRef,
}: {
	status: AcrossDepositStatus
	fillTxnRef: string | null
	depositRefundTxnRef: string | null
}) => {
	if (acrossDepositStatusByStatus[status] == null)
		throw new Error(`Across_Rest: unknown deposit status ${status}`)
	if (status === 'filled') {
		if (fillTxnRef == null)
			throw new Error('Across_Rest: filled deposit missing fill transaction')
	} else if (fillTxnRef != null)
		throw new Error(`Across_Rest: fill transaction present for ${status} deposit`)
	if (status === 'refunded') {
		if (depositRefundTxnRef == null)
			throw new Error('Across_Rest: refunded deposit missing refund transaction')
	} else if (depositRefundTxnRef != null)
		throw new Error(`Across_Rest: refund transaction present for ${status} deposit`)
}

const assertIntegerString = (value: string, name: string) => {
	if (!integerStringPattern.test(value))
		throw new Error(`Across_Rest: invalid ${name}`)
}

const assertOpaqueIdentity = (value: string, name: string) => {
	if (value.length < 1 || value.length > 512 || value.includes('/') || value.includes('\\'))
		throw new Error(`Across_Rest: invalid ${name}`)
}

const assertTimestamp = (value: string, name: string) => {
	if (!Number.isFinite(Date.parse(value)))
		throw new Error(`Across_Rest: invalid ${name}`)
}

const assertDeposit = (deposit: AcrossDeposit) => {
	assertChainId(deposit.originChainId)
	assertChainId(deposit.destinationChainId)
	if (deposit.depositId != null)
		assertIntegerString(deposit.depositId, 'deposit id')
	for (const [name, value] of Object.entries({
		'input amount': deposit.inputAmount,
		'output amount': deposit.outputAmount,
		...(deposit.fillGasFee != null && { 'fill gas fee': deposit.fillGasFee }),
	}))
		assertIntegerString(value, name)
	for (const [name, value] of Object.entries({
		...(deposit.bridgeFeeUsd != null && { 'bridge fee USD': deposit.bridgeFeeUsd }),
		...(deposit.fillGasFeeUsd != null && { 'fill gas fee USD': deposit.fillGasFeeUsd }),
	}))
		if (!decimalStringPattern.test(value))
			throw new Error(`Across_Rest: invalid ${name}`)
	for (const [name, value] of Object.entries({
		depositor: deposit.depositor,
		recipient: deposit.recipient,
		inputToken: deposit.inputToken,
		outputToken: deposit.outputToken,
		depositTxnRef: deposit.depositTxnRef,
		...(deposit.relayHash != null && { relayHash: deposit.relayHash }),
		...(deposit.fillTxnRef != null && { fillTxnRef: deposit.fillTxnRef }),
	}))
		assertOpaqueIdentity(value, name)
	assertTimestamp(deposit.quoteTimestamp, 'quote timestamp')
	assertTimestamp(deposit.depositBlockTimestamp, 'deposit block timestamp')
	if (deposit.fillDeadline != null)
		assertTimestamp(deposit.fillDeadline, 'fill deadline')
	if (deposit.fillBlockTimestamp != null) {
		assertTimestamp(deposit.fillBlockTimestamp, 'fill block timestamp')
		if (Date.parse(deposit.fillBlockTimestamp) < Date.parse(deposit.depositBlockTimestamp))
			throw new Error('Across_Rest: fill predates deposit')
	}
	assertDepositLifecycle({
		status: deposit.status,
		fillTxnRef: deposit.fillTxnRef,
		depositRefundTxnRef: deposit.depositRefundTxnRef,
	})
	if (deposit.status === 'filled' && deposit.fillBlockTimestamp == null)
		throw new Error('Across_Rest: filled deposit missing fill block timestamp')
}

const assertDepositResponse = (
	response: AcrossDepositResponse
) => {
	assertEnvelope(acrossDepositResponseEnvelope, response, 'deposit')
	if (
		!Number.isSafeInteger(response.pagination.currentIndex)
		|| !Number.isSafeInteger(response.pagination.maxIndex)
		|| response.pagination.currentIndex < 0
		|| response.pagination.maxIndex < response.pagination.currentIndex
	)
		throw new Error('Across_Rest: invalid deposit pagination envelope')
	return response
}

export const getDeposit = async (query: (
	| {
		depositId: string
		depositTxnRef?: never
		index?: number
		originChainId: number
	}
	| {
		depositId?: never
		depositTxnRef: string
		index?: number
		originChainId?: never
	}
)) => {
	const index = query.index ?? 0
	if (!Number.isSafeInteger(index) || index < 0)
		throw new Error(`Across_Rest: invalid deposit index ${index}`)
	if (query.depositTxnRef == null) {
		assertChainId(query.originChainId)
		assertIntegerString(query.depositId, 'deposit id')
	} else
		assertOpaqueIdentity(query.depositTxnRef, 'deposit transaction reference')

	const response = assertDepositResponse(
		await fetchAcrossJson<AcrossDepositResponse>(
			`/api/deposit?${new URLSearchParams({
				...(query.depositTxnRef == null ? {
					originChainId: String(query.originChainId),
					depositId: query.depositId,
				} : {
					depositTxnRef: query.depositTxnRef,
				}),
				index: String(index),
			})}`
		)
	)
	assertDeposit(response.deposit)
	if (query.depositTxnRef == null) {
		if (
			response.deposit.originChainId !== query.originChainId
			|| response.deposit.depositId !== query.depositId
			|| response.pagination.currentIndex !== index
		)
			throw new Error('Across_Rest: mismatched deposit identity')
	} else if (
		response.deposit.depositTxnRef !== query.depositTxnRef
		|| response.pagination.currentIndex !== index
	)
		throw new Error('Across_Rest: mismatched deposit transaction identity')
	return response
}

export const getDepositStatus = async ({
	originChainId,
	depositId,
}: {
	originChainId: number
	depositId: string
}) => {
	assertChainId(originChainId)
	assertIntegerString(depositId, 'deposit id')
	const status = await fetchAcrossJson<AcrossDepositStatusResponse>(
		`/api/deposit/status?${new URLSearchParams({
			originChainId: String(originChainId),
			depositId,
		})}`
	)
	assertEnvelope(acrossDepositStatusResponseEnvelope, status, 'deposit status')
	if (status.originChainId !== originChainId || status.depositId !== depositId)
		throw new Error('Across_Rest: mismatched deposit status identity')
	assertChainId(status.originChainId)
	assertChainId(status.destinationChainId)
	assertOpaqueIdentity(status.depositTxnRef, 'deposit transaction reference')
	if (status.fillTxnRef != null)
		assertOpaqueIdentity(status.fillTxnRef, 'fill transaction reference')
	if (status.depositRefundTxnRef != null)
		assertOpaqueIdentity(status.depositRefundTxnRef, 'deposit refund transaction reference')
	assertDepositLifecycle({
		status: status.status,
		fillTxnRef: status.fillTxnRef,
		depositRefundTxnRef: status.depositRefundTxnRef,
	})
	return status
}

export const getDeposits = async ({
	depositor,
	limit = 50,
	skip = 0,
}: {
	depositor: string
	limit?: number
	skip?: number
}) => {
	assertOpaqueIdentity(depositor, 'depositor')
	if (!Number.isSafeInteger(limit) || limit < 1 || limit > 100)
		throw new Error(`Across_Rest: invalid page limit ${limit}`)
	if (!Number.isSafeInteger(skip) || skip < 0 || skip > 100_000)
		throw new Error(`Across_Rest: invalid page offset ${skip}`)
	const deposits = await fetchAcrossJson<AcrossDeposit[]>(
		`/api/deposits?${new URLSearchParams({
			depositor,
			limit: String(limit),
			skip: String(skip),
		})}`
	)
	assertEnvelope(acrossDepositsEnvelope, deposits, 'deposits')
	if (deposits.length > limit)
		throw new Error('Across_Rest: deposit response exceeds requested limit')
	for (const deposit of deposits) {
		assertDeposit(deposit)
		if (deposit.depositor.toLowerCase() !== depositor.toLowerCase())
			throw new Error('Across_Rest: foreign depositor deposit')
	}
	return deposits
}

export const getSuggestedFees = async ({
	inputToken,
	outputToken,
	originChainId,
	destinationChainId,
	amount,
}: {
	inputToken: string
	outputToken: string
	originChainId: number
	destinationChainId: number
	amount: string
}) => {
	assertOpaqueIdentity(inputToken, 'input token')
	assertOpaqueIdentity(outputToken, 'output token')
	assertChainId(originChainId)
	assertChainId(destinationChainId)
	assertIntegerString(amount, 'quote amount')
	const fees = await fetchAcrossJson<AcrossSuggestedFees>(
		`/api/suggested-fees?${new URLSearchParams({
			inputToken,
			outputToken,
			originChainId: String(originChainId),
			destinationChainId: String(destinationChainId),
			amount,
		})}`
	)
	assertEnvelope(acrossSuggestedFeesEnvelope, fees, 'suggested fees')
	if (
		fees.inputToken.chainId !== originChainId
		|| fees.outputToken.chainId !== destinationChainId
		|| fees.inputToken.address.toLowerCase() !== inputToken.toLowerCase()
		|| fees.outputToken.address.toLowerCase() !== outputToken.toLowerCase()
	)
		throw new Error('Across_Rest: mismatched quote route identity')
	for (const [name, value] of Object.entries({
		'quote timestamp': fees.timestamp,
		'quote block': fees.quoteBlock,
		'fill deadline': fees.fillDeadline,
		'output amount': fees.outputAmount,
		'total relay fee': fees.totalRelayFee.total,
		'total relay fee percentage': fees.totalRelayFee.pct,
		'LP fee': fees.lpFee.total,
		'minimum deposit': fees.limits.minDeposit,
		'maximum deposit': fees.limits.maxDeposit,
	}))
		assertIntegerString(value, name)
	if (BigInt(fees.outputAmount) > BigInt(amount))
		throw new Error('Across_Rest: quote output exceeds input')
	return fees
}
