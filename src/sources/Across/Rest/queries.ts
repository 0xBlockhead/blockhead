import { Source } from '$/sources/Source.ts'
import type { SourceBinding } from '$/sources/SourceBinding.ts'
import { getJson } from '$/sources/_shared/wire/HttpRest/client.ts'
import type {
	AcrossDeposit,
	AcrossDepositResponse,
	AcrossDepositStatusResponse,
	AcrossObservation,
	AcrossSuggestedFees,
} from '$/sources/Across/Rest/types.ts'

const integerStringPattern = /^(?:0|[1-9]\d*)$/
const decimalStringPattern = /^-?(?:0|[1-9]\d*)(?:\.\d+)?$/

const assertBinding = (binding: SourceBinding) => {
	if (binding.source !== Source.Across_Rest)
		throw new Error('Across_Rest: incorrect source binding')
}

const assertChainId = (chainId: number) => {
	if (!Number.isSafeInteger(chainId) || chainId < 1)
		throw new Error(`Across_Rest: invalid chain id ${chainId}`)
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
}

const observe = <_Value>(value: _Value): AcrossObservation<_Value> => ({
	value,
	observedBy: 'Across_Rest',
	resolvedAtMs: Date.now(),
})

const depositIdentityQuery = ({
	originChainId,
	depositId,
}: {
	originChainId: number
	depositId: string
}) => {
	assertChainId(originChainId)
	assertIntegerString(depositId, 'deposit id')
	return new URLSearchParams({
		originChainId: String(originChainId),
		depositId,
	})
}

export const getDeposit = async ({
	binding,
	originChainId,
	depositId,
	index = 0,
}: {
	binding: SourceBinding
	originChainId: number
	depositId: string
	index?: number
}) => {
	assertBinding(binding)
	if (!Number.isSafeInteger(index) || index < 0)
		throw new Error(`Across_Rest: invalid deposit index ${index}`)
	const query = depositIdentityQuery({
		originChainId,
		depositId,
	})
	query.set('index', String(index))
	const response = await getJson<AcrossDepositResponse>(binding, `/api/deposit?${query}`)
	assertDeposit(response.deposit)
	if (
		response.deposit.originChainId !== originChainId
		|| response.deposit.depositId !== depositId
		|| response.pagination.currentIndex !== index
	)
		throw new Error('Across_Rest: mismatched deposit identity')
	return observe(response)
}

export const getDepositByTransaction = async ({
	binding,
	depositTxnRef,
	index = 0,
}: {
	binding: SourceBinding
	depositTxnRef: string
	index?: number
}) => {
	assertBinding(binding)
	assertOpaqueIdentity(depositTxnRef, 'deposit transaction reference')
	if (!Number.isSafeInteger(index) || index < 0)
		throw new Error(`Across_Rest: invalid deposit index ${index}`)
	const response = await getJson<AcrossDepositResponse>(
		binding,
		`/api/deposit?${new URLSearchParams({
			depositTxnRef,
			index: String(index),
		})}`
	)
	assertDeposit(response.deposit)
	if (
		response.deposit.depositTxnRef !== depositTxnRef
		|| response.pagination.currentIndex !== index
	)
		throw new Error('Across_Rest: mismatched deposit transaction identity')
	return observe(response)
}

export const getDepositStatus = async ({
	binding,
	originChainId,
	depositId,
}: {
	binding: SourceBinding
	originChainId: number
	depositId: string
}) => {
	assertBinding(binding)
	const query = depositIdentityQuery({
		originChainId,
		depositId,
	})
	const status = await getJson<AcrossDepositStatusResponse>(
		binding,
		`/api/deposit/status?${query}`
	)
	if (status.originChainId !== originChainId || status.depositId !== depositId)
		throw new Error('Across_Rest: mismatched deposit status identity')
	assertChainId(status.destinationChainId)
	assertOpaqueIdentity(status.depositTxnRef, 'deposit transaction reference')
	if (status.fillTxnRef != null)
		assertOpaqueIdentity(status.fillTxnRef, 'fill transaction reference')
	return observe(status)
}

export const getDeposits = async ({
	binding,
	depositor,
	limit = 50,
	skip = 0,
}: {
	binding: SourceBinding
	depositor: string
	limit?: number
	skip?: number
}) => {
	assertBinding(binding)
	assertOpaqueIdentity(depositor, 'depositor')
	if (!Number.isSafeInteger(limit) || limit < 1 || limit > 100)
		throw new Error(`Across_Rest: invalid page limit ${limit}`)
	if (!Number.isSafeInteger(skip) || skip < 0 || skip > 100_000)
		throw new Error(`Across_Rest: invalid page offset ${skip}`)
	const deposits = await getJson<AcrossDeposit[]>(
		binding,
		`/api/deposits?${new URLSearchParams({
			depositor,
			limit: String(limit),
			skip: String(skip),
		})}`
	)
	if (deposits.length > limit)
		throw new Error('Across_Rest: deposit response exceeds requested limit')
	for (const deposit of deposits) {
		assertDeposit(deposit)
		if (deposit.depositor.toLowerCase() !== depositor.toLowerCase())
			throw new Error('Across_Rest: foreign depositor deposit')
	}
	return observe(deposits)
}

export const getSuggestedFees = async ({
	binding,
	inputToken,
	outputToken,
	originChainId,
	destinationChainId,
	amount,
}: {
	binding: SourceBinding
	inputToken: string
	outputToken: string
	originChainId: number
	destinationChainId: number
	amount: string
}) => {
	assertBinding(binding)
	assertOpaqueIdentity(inputToken, 'input token')
	assertOpaqueIdentity(outputToken, 'output token')
	assertChainId(originChainId)
	assertChainId(destinationChainId)
	assertIntegerString(amount, 'quote amount')
	const fees = await getJson<AcrossSuggestedFees>(
		binding,
		`/api/suggested-fees?${new URLSearchParams({
			inputToken,
			outputToken,
			originChainId: String(originChainId),
			destinationChainId: String(destinationChainId),
			amount,
		})}`
	)
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
	return observe(fees)
}
