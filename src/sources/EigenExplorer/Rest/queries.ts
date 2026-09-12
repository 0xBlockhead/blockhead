/**
 * EigenExplorer REST named operations (api.eigenexplorer.com).
 * @see https://docs.eigenexplorer.com/api-reference/introduction
 * @see https://docs.eigenexplorer.com/api-reference/quickstart/api-key
 * @see https://docs.eigenexplorer.com/api-reference/openapi.json
 */
import { throwHttpError } from '$/lib/http.ts'
import bindings from '$/sources/EigenExplorer/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { httpUrl } from '$/sources/_shared/wire/HttpRest/client.ts'
import { sourceFetch } from '$/sources/_runtime/http.ts'
import type {
	EigenExplorerAllocation,
	EigenExplorerAvs,
	EigenExplorerDeposit,
	EigenExplorerOperator,
	EigenExplorerOperatorAllocationDelay,
	EigenExplorerOperatorMagnitude,
	EigenExplorerOperatorRewardInfo,
	EigenExplorerPage,
	EigenExplorerRewardStrategy,
	EigenExplorerSlash,
	EigenExplorerStaker,
	EigenExplorerStrategyTvl,
	EigenExplorerWithdrawal,
} from '$/sources/EigenExplorer/Rest/types.ts'
import {
	eigenExplorerAllocationPageEnvelope,
	eigenExplorerAvsEnvelope,
	eigenExplorerAvsPageEnvelope,
	eigenExplorerDepositPageEnvelope,
	eigenExplorerOperatorAllocationDelayEnvelope,
	eigenExplorerOperatorEnvelope,
	eigenExplorerOperatorMagnitudeEnvelope,
	eigenExplorerOperatorPageEnvelope,
	eigenExplorerOperatorRewardInfoEnvelope,
	eigenExplorerRewardStrategiesEnvelope,
	eigenExplorerSlashPageEnvelope,
	eigenExplorerStakerEnvelope,
	eigenExplorerStrategyTvlEnvelope,
	eigenExplorerWithdrawalPageEnvelope,
} from '$/sources/EigenExplorer/Rest/types.ts'

const binding = bindings[Source.EigenExplorer_Rest][0]

const evmAddressPattern = /^0x[0-9a-f]{40}$/i
const bytes32Pattern = /^0x[0-9a-f]{64}$/i
const unsignedIntegerPattern = /^(0|[1-9][0-9]*)$/

const assertEnvelope = <_Value>(
	envelope: {
		assert: (value: unknown) => _Value
	},
	value: unknown,
	label: string
) => {
	try {
		return envelope.assert(value)
	} catch {
		throw new Error(`${Source.EigenExplorer_Rest}: invalid ${label} response envelope`)
	}
}

const fetchEigenExplorerJson = <_Json>(path: string) => (
	sourceFetch(binding, httpUrl(binding, path), {
		headers: {
			accept: 'application/json',
		},
	}).then(async (response) => {
		if (!response.ok)
			await throwHttpError(`${binding.source} ${path}`, response)

		return response.json<_Json>()
	})
)

const assertAddress = (
	address: string,
	label: string
) => {
	if (!evmAddressPattern.test(address))
		throw new Error(`${Source.EigenExplorer_Rest}: invalid ${label}`)
}

const assertTimestamp = (
	timestamp: string,
	label: string
) => {
	if (!Number.isFinite(Date.parse(timestamp)))
		throw new Error(`${Source.EigenExplorer_Rest}: invalid ${label}`)
}

const assertOptionalHttpUrl = (
	value: string | null,
	label: string
) => {
	if (value == null)
		return

	try {
		new URL(value)
	} catch {
		throw new Error(`${Source.EigenExplorer_Rest}: invalid ${label}`)
	}
}

const assertNonNegativeSafeInteger = (
	value: number,
	label: string
) => {
	if (!Number.isSafeInteger(value) || value < 0)
		throw new Error(`${Source.EigenExplorer_Rest}: invalid ${label}`)
}

const assertStrategyShares = (
	strategyShares: {
		strategyAddress: string
		shares: string
	}[]
) => {
	const strategyAddresses = new Set<string>()

	for (const value of strategyShares) {
		assertAddress(value.strategyAddress, 'strategy address')

		if (!unsignedIntegerPattern.test(value.shares))
			throw new Error(`${Source.EigenExplorer_Rest}: invalid strategy shares`)

		const strategyAddress = value.strategyAddress.toLowerCase()

		if (strategyAddresses.has(strategyAddress))
			throw new Error(`${Source.EigenExplorer_Rest}: duplicate strategy shares`)

		strategyAddresses.add(strategyAddress)
	}
}

const paginationPath = ({
	path,
	skip,
	take,
	filters = {},
}: {
	path: string
	skip: number
	take: number
	filters?: Record<string, string>
}) => {
	if (!Number.isSafeInteger(skip) || skip < 0)
		throw new Error(`${Source.EigenExplorer_Rest}: skip must be a nonnegative safe integer`)

	if (!Number.isSafeInteger(take) || take < 1 || take > 100)
		throw new Error(`${Source.EigenExplorer_Rest}: take must be between 1 and 100`)

	return `${path}?${new URLSearchParams({
		skip: String(skip),
		take: String(take),
		...filters,
	})}`
}

const allocationListFilters = ({
	avsAddress,
	operatorAddress,
	strategyAddress,
	operatorSetId,
}: {
	avsAddress?: string
	operatorAddress?: string
	strategyAddress?: string
	operatorSetId?: number
}) => {
	if (avsAddress != null)
		assertAddress(avsAddress, 'allocation AVS address filter')

	if (operatorAddress != null)
		assertAddress(operatorAddress, 'allocation operator address filter')

	if (strategyAddress != null)
		assertAddress(strategyAddress, 'allocation strategy address filter')

	if (
		operatorSetId != null
		&& (
			!Number.isSafeInteger(operatorSetId)
			|| operatorSetId < 0
		)
	)
		throw new Error(`${Source.EigenExplorer_Rest}: invalid operator set id filter`)

	return {
		...(avsAddress != null && {
			avsAddress,
		}),
		...(operatorAddress != null && {
			operatorAddress,
		}),
		...(strategyAddress != null && {
			strategyAddress,
		}),
		...(operatorSetId != null && {
			operatorSetId: String(operatorSetId),
		}),
	}
}

const assertPage = <_Row>(
	page: EigenExplorerPage<_Row>,
	skip: number,
	take: number
) => {
	if (
		!Number.isSafeInteger(page.meta.total)
		|| page.meta.total < 0
		|| page.meta.skip !== skip
		|| page.meta.take !== take
		|| page.data.length > take
		|| page.meta.total < skip + page.data.length
	)
		throw new Error(`${Source.EigenExplorer_Rest}: invalid pagination metadata`)

	return page
}

export const getStaker = async (address: string) => {
	assertAddress(address, 'staker address')

	const wire = await fetchEigenExplorerJson<EigenExplorerStaker>(
		`/stakers/${encodeURIComponent(address)}`
	)
	const staker = assertEnvelope(eigenExplorerStakerEnvelope, wire, 'staker')

	if (staker.address.toLowerCase() !== address.toLowerCase())
		throw new Error(`${Source.EigenExplorer_Rest}: foreign staker`)

	if (staker.operatorAddress !== null)
		assertAddress(staker.operatorAddress, 'operator address')

	if (
		!unsignedIntegerPattern.test(staker.createdAtBlock)
		|| !unsignedIntegerPattern.test(staker.updatedAtBlock)
	)
		throw new Error(`${Source.EigenExplorer_Rest}: invalid staker block identity`)

	assertTimestamp(staker.createdAt, 'staker creation timestamp')
	assertTimestamp(staker.updatedAt, 'staker update timestamp')
	assertStrategyShares(staker.shares)

	return staker
}

export const getStakerDeposits = async (
	address: string,
	{
		skip = 0,
		take = 100,
	}: {
		skip?: number
		take?: number
	} = {}
) => {
	assertAddress(address, 'staker address')

	const wire = await fetchEigenExplorerJson<EigenExplorerPage<EigenExplorerDeposit>>(
		paginationPath({
			path: `/stakers/${encodeURIComponent(address)}/deposits`,
			skip,
			take,
		})
	)
	const page = assertPage(
		assertEnvelope(eigenExplorerDepositPageEnvelope, wire, 'staker deposits'),
		skip,
		take
	)
	const identities = new Set<string>()

	for (const deposit of page.data) {
		if (deposit.stakerAddress.toLowerCase() !== address.toLowerCase())
			throw new Error(`${Source.EigenExplorer_Rest}: foreign deposit`)

		if (!bytes32Pattern.test(deposit.transactionHash))
			throw new Error(`${Source.EigenExplorer_Rest}: invalid deposit transaction hash`)

		assertAddress(deposit.tokenAddress, 'deposit token address')
		assertAddress(deposit.strategyAddress, 'deposit strategy address')

		if (
			!unsignedIntegerPattern.test(deposit.shares)
			|| !Number.isSafeInteger(deposit.createdAtBlock)
			|| deposit.createdAtBlock < 0
		)
			throw new Error(`${Source.EigenExplorer_Rest}: invalid deposit quantity`)

		assertTimestamp(deposit.createdAt, 'deposit timestamp')

		const identity = `${deposit.transactionHash.toLowerCase()}:${deposit.strategyAddress.toLowerCase()}`

		if (identities.has(identity))
			throw new Error(`${Source.EigenExplorer_Rest}: duplicate deposits`)

		identities.add(identity)
	}

	return page
}

export const getStakerWithdrawals = async (
	address: string,
	{
		skip = 0,
		take = 100,
	}: {
		skip?: number
		take?: number
	} = {}
) => {
	assertAddress(address, 'staker address')

	const wire = await fetchEigenExplorerJson<EigenExplorerPage<EigenExplorerWithdrawal>>(
		paginationPath({
			path: `/stakers/${encodeURIComponent(address)}/withdrawals`,
			skip,
			take,
		})
	)
	const page = assertPage(
		assertEnvelope(eigenExplorerWithdrawalPageEnvelope, wire, 'staker withdrawals'),
		skip,
		take
	)
	const withdrawalRoots = new Set<string>()

	for (const withdrawal of page.data) {
		if (withdrawal.stakerAddress.toLowerCase() !== address.toLowerCase())
			throw new Error(`${Source.EigenExplorer_Rest}: foreign withdrawal`)

		if (!bytes32Pattern.test(withdrawal.withdrawalRoot))
			throw new Error(`${Source.EigenExplorer_Rest}: invalid withdrawal root`)

		assertAddress(withdrawal.delegatedTo, 'withdrawal operator address')
		assertAddress(withdrawal.withdrawerAddress, 'withdrawer address')
		assertStrategyShares(withdrawal.shares)

		if (
			!Number.isSafeInteger(withdrawal.nonce)
			|| withdrawal.nonce < 0
			|| !Number.isSafeInteger(withdrawal.createdAtBlock)
			|| withdrawal.createdAtBlock < 0
			|| !Number.isSafeInteger(withdrawal.updatedAtBlock)
			|| withdrawal.updatedAtBlock < 0
		)
			throw new Error(`${Source.EigenExplorer_Rest}: invalid withdrawal identity`)

		assertTimestamp(withdrawal.createdAt, 'withdrawal creation timestamp')
		assertTimestamp(withdrawal.updatedAt, 'withdrawal update timestamp')

		const withdrawalRoot = withdrawal.withdrawalRoot.toLowerCase()

		if (withdrawalRoots.has(withdrawalRoot))
			throw new Error(`${Source.EigenExplorer_Rest}: duplicate withdrawals`)

		withdrawalRoots.add(withdrawalRoot)
	}

	return page
}

const assertOperatorRecord = (
	operator: EigenExplorerOperator
) => {
	assertAddress(operator.address, 'operator address')

	if (
		!unsignedIntegerPattern.test(operator.createdAtBlock)
		|| !unsignedIntegerPattern.test(operator.updatedAtBlock)
	)
		throw new Error(`${Source.EigenExplorer_Rest}: invalid operator block identity`)

	assertTimestamp(operator.createdAt, 'operator creation timestamp')
	assertTimestamp(operator.updatedAt, 'operator update timestamp')
	assertStrategyShares(operator.shares)

	if (operator.metadataName.trim() === '')
		throw new Error(`${Source.EigenExplorer_Rest}: empty operator name`)

	assertOptionalHttpUrl(operator.metadataWebsite, 'operator website')
	assertOptionalHttpUrl(operator.metadataLogo, 'operator logo')
}

const assertAvsRecord = (
	avs: EigenExplorerAvs
) => {
	assertAddress(avs.address, 'AVS address')

	if (
		!unsignedIntegerPattern.test(avs.createdAtBlock)
		|| !unsignedIntegerPattern.test(avs.updatedAtBlock)
	)
		throw new Error(`${Source.EigenExplorer_Rest}: invalid AVS block identity`)

	assertTimestamp(avs.createdAt, 'AVS creation timestamp')
	assertTimestamp(avs.updatedAt, 'AVS update timestamp')
	assertNonNegativeSafeInteger(avs.totalStakers, 'AVS staker count')
	assertNonNegativeSafeInteger(avs.totalOperators, 'AVS operator count')
	assertStrategyShares(avs.shares)

	if (avs.metadataName.trim() === '')
		throw new Error(`${Source.EigenExplorer_Rest}: empty AVS name`)

	assertOptionalHttpUrl(avs.metadataWebsite, 'AVS website')
	assertOptionalHttpUrl(avs.metadataLogo, 'AVS logo')
}

export const getAvs = async (address: string) => {
	assertAddress(address, 'AVS address')

	const wire = await fetchEigenExplorerJson<EigenExplorerAvs>(
		`/avs/${encodeURIComponent(address)}`
	)
	const avs = assertEnvelope(eigenExplorerAvsEnvelope, wire, 'AVS')
	assertAvsRecord(avs)

	if (avs.address.toLowerCase() !== address.toLowerCase())
		throw new Error(`${Source.EigenExplorer_Rest}: foreign AVS`)

	return avs
}

export const listOperators = async (
	{
		skip = 0,
		take = 100,
	}: {
		skip?: number
		take?: number
	} = {}
) => {
	const wire = await fetchEigenExplorerJson<EigenExplorerPage<EigenExplorerOperator>>(
		paginationPath({
			path: '/operators',
			skip,
			take,
		})
	)
	const page = assertPage(
		assertEnvelope(eigenExplorerOperatorPageEnvelope, wire, 'operators'),
		skip,
		take
	)
	const operatorAddresses = new Set<string>()

	for (const operator of page.data) {
		assertOperatorRecord(operator)

		const normalizedAddress = operator.address.toLowerCase()

		if (operatorAddresses.has(normalizedAddress))
			throw new Error(`${Source.EigenExplorer_Rest}: duplicate operators`)

		operatorAddresses.add(normalizedAddress)
	}

	return page
}

export const listAvss = async (
	{
		skip = 0,
		take = 100,
	}: {
		skip?: number
		take?: number
	} = {}
) => {
	const wire = await fetchEigenExplorerJson<EigenExplorerPage<EigenExplorerAvs>>(
		paginationPath({
			path: '/avs',
			skip,
			take,
		})
	)
	const page = assertPage(
		assertEnvelope(eigenExplorerAvsPageEnvelope, wire, 'AVSs'),
		skip,
		take
	)
	const avsAddresses = new Set<string>()

	for (const avs of page.data) {
		assertAvsRecord(avs)

		const normalizedAddress = avs.address.toLowerCase()

		if (avsAddresses.has(normalizedAddress))
			throw new Error(`${Source.EigenExplorer_Rest}: duplicate AVSs`)

		avsAddresses.add(normalizedAddress)
	}

	return page
}

export const listStrategies = async (
	{
		skip = 0,
		take = 100,
	}: {
		skip?: number
		take?: number
	} = {}
) => {
	if (!Number.isSafeInteger(skip) || skip < 0)
		throw new Error(`${Source.EigenExplorer_Rest}: skip must be a nonnegative safe integer`)

	if (!Number.isSafeInteger(take) || take < 1 || take > 100)
		throw new Error(`${Source.EigenExplorer_Rest}: take must be between 1 and 100`)

	const wire = await fetchEigenExplorerJson<{
		strategies: EigenExplorerRewardStrategy[]
		total: number
	}>(
		'/rewards/strategies'
	)
	const strategiesWire = assertEnvelope(eigenExplorerRewardStrategiesEnvelope, wire, 'strategies')

	if (
		!Number.isSafeInteger(strategiesWire.total)
		|| strategiesWire.total < 0
		|| strategiesWire.strategies.length !== strategiesWire.total
	)
		throw new Error(`${Source.EigenExplorer_Rest}: invalid strategies total`)

	const strategyAddresses = new Set<string>()

	for (const strategy of strategiesWire.strategies) {
		assertAddress(strategy.strategyAddress, 'strategy address')

		for (const tokenAddress of strategy.tokens)
			assertAddress(tokenAddress, 'reward token address')

		if (
			new Set(strategy.tokens.map((value) => value.toLowerCase())).size !== strategy.tokens.length
		)
			throw new Error(`${Source.EigenExplorer_Rest}: duplicate reward tokens`)

		const normalizedAddress = strategy.strategyAddress.toLowerCase()

		if (strategyAddresses.has(normalizedAddress))
			throw new Error(`${Source.EigenExplorer_Rest}: duplicate strategies`)

		strategyAddresses.add(normalizedAddress)
	}

	return {
		data: strategiesWire.strategies.slice(skip, skip + take),
		meta: {
			total: strategiesWire.total,
			skip,
			take,
		},
	} satisfies EigenExplorerPage<EigenExplorerRewardStrategy>
}

export const listAvsOperators = async (
	address: string,
	{
		skip = 0,
		take = 100,
	}: {
		skip?: number
		take?: number
	} = {}
) => {
	assertAddress(address, 'AVS address')

	const wire = await fetchEigenExplorerJson<EigenExplorerPage<EigenExplorerOperator>>(
		paginationPath({
			path: `/avs/${encodeURIComponent(address)}/operators`,
			skip,
			take,
		})
	)
	const page = assertPage(
		assertEnvelope(eigenExplorerOperatorPageEnvelope, wire, 'AVS operators'),
		skip,
		take
	)
	const operatorAddresses = new Set<string>()

	for (const operator of page.data) {
		assertOperatorRecord(operator)

		const normalizedAddress = operator.address.toLowerCase()

		if (operatorAddresses.has(normalizedAddress))
			throw new Error(`${Source.EigenExplorer_Rest}: duplicate operators`)

		operatorAddresses.add(normalizedAddress)
	}

	return page
}

export const getOperatorRewardInfo = async (address: string) => {
	assertAddress(address, 'operator address')

	const wire = await fetchEigenExplorerJson<EigenExplorerOperatorRewardInfo>(
		`/operators/${encodeURIComponent(address)}/rewards`
	)
	const rewardInfo = assertEnvelope(eigenExplorerOperatorRewardInfoEnvelope, wire, 'operator rewards')

	if (rewardInfo.address.toLowerCase() !== address.toLowerCase())
		throw new Error(`${Source.EigenExplorer_Rest}: foreign operator reward information`)

	for (const tokenAddress of rewardInfo.rewardTokens)
		assertAddress(tokenAddress, 'reward token address')

	for (const strategyAddress of rewardInfo.rewardStrategies)
		assertAddress(strategyAddress, 'reward strategy address')

	if (
		new Set(rewardInfo.rewardTokens.map((value) => value.toLowerCase())).size !== rewardInfo.rewardTokens.length
		|| new Set(rewardInfo.rewardStrategies.map((value) => value.toLowerCase())).size !== rewardInfo.rewardStrategies.length
	)
		throw new Error(`${Source.EigenExplorer_Rest}: duplicate reward information`)

	return rewardInfo
}

export const getOperator = async (
	address: string,
	{
		withAvsData = false,
	}: {
		withAvsData?: boolean
	} = {}
) => {
	assertAddress(address, 'operator address')

	const path = (
		withAvsData ?
			`/operators/${encodeURIComponent(address)}?${new URLSearchParams({
				withAvsData: 'true',
			})}`
		:
			`/operators/${encodeURIComponent(address)}`
	)
	const wire = await fetchEigenExplorerJson<EigenExplorerOperator>(path)
	const operator = assertEnvelope(eigenExplorerOperatorEnvelope, wire, 'operator')
	assertOperatorRecord(operator)

	if (operator.address.toLowerCase() !== address.toLowerCase())
		throw new Error(`${Source.EigenExplorer_Rest}: foreign operator`)

	if (operator.totalStakers != null)
		assertNonNegativeSafeInteger(operator.totalStakers, 'operator staker count')

	if (operator.totalAvs != null)
		assertNonNegativeSafeInteger(operator.totalAvs, 'operator AVS count')

	if (operator.avsRegistrations != null) {
		const avsAddresses = new Set<string>()

		for (const registration of operator.avsRegistrations) {
			assertAddress(registration.avsAddress, 'operator AVS registration address')

			const normalizedAddress = registration.avsAddress.toLowerCase()

			if (avsAddresses.has(normalizedAddress))
				throw new Error(`${Source.EigenExplorer_Rest}: duplicate operator AVS registrations`)

			avsAddresses.add(normalizedAddress)
		}
	}

	return operator
}

const assertAllocationPage = (
	page: EigenExplorerPage<EigenExplorerAllocation>,
	{
		skip,
		take,
		operatorAddress,
		avsAddress,
		strategyAddress,
	}: {
		skip: number
		take: number
		operatorAddress?: string
		avsAddress?: string
		strategyAddress?: string
	}
) => {
	assertPage(page, skip, take)
	const identities = new Set<string>()
	const observationIdentities = new Set<string>()

	for (const allocation of page.data) {
		assertAddress(allocation.avsAddress, 'allocation AVS address')
		assertAddress(allocation.operatorAddress, 'allocation operator address')
		assertAddress(allocation.strategyAddress, 'allocation strategy address')

		if (
			!unsignedIntegerPattern.test(allocation.magnitude)
			|| !Number.isSafeInteger(allocation.operatorSetId)
			|| allocation.operatorSetId < 0
			|| !Number.isSafeInteger(allocation.effectBlock)
			|| allocation.effectBlock < 0
			|| !Number.isSafeInteger(allocation.createdAtBlock)
			|| allocation.createdAtBlock < 0
			|| !Number.isSafeInteger(allocation.updatedAtBlock)
			|| allocation.updatedAtBlock < 0
		)
			throw new Error(`${Source.EigenExplorer_Rest}: invalid allocation identity`)

		assertTimestamp(allocation.createdAt, 'allocation creation timestamp')
		assertTimestamp(allocation.updatedAt, 'allocation update timestamp')

		if (
			operatorAddress != null
			&& allocation.operatorAddress.toLowerCase() !== operatorAddress.toLowerCase()
		)
			throw new Error(`${Source.EigenExplorer_Rest}: foreign allocation operator`)

		if (
			avsAddress != null
			&& allocation.avsAddress.toLowerCase() !== avsAddress.toLowerCase()
		)
			throw new Error(`${Source.EigenExplorer_Rest}: foreign allocation AVS`)

		if (
			strategyAddress != null
			&& allocation.strategyAddress.toLowerCase() !== strategyAddress.toLowerCase()
		)
			throw new Error(`${Source.EigenExplorer_Rest}: foreign allocation strategy`)

		const identity = [
			allocation.operatorAddress.toLowerCase(),
			allocation.avsAddress.toLowerCase(),
			String(allocation.operatorSetId),
			allocation.strategyAddress.toLowerCase(),
			String(allocation.effectBlock),
		].join(':')

		if (identities.has(identity))
			throw new Error(`${Source.EigenExplorer_Rest}: duplicate allocations`)

		identities.add(identity)

		const observationIdentity = [
			allocation.operatorAddress.toLowerCase(),
			allocation.avsAddress.toLowerCase(),
			allocation.strategyAddress.toLowerCase(),
			String(Date.parse(allocation.updatedAt)),
		].join(':')

		if (observationIdentities.has(observationIdentity))
			throw new Error(`${Source.EigenExplorer_Rest}: allocations collapse onto one observation identity`)

		observationIdentities.add(observationIdentity)
	}

	return page
}

const assertSlashPage = (
	page: EigenExplorerPage<EigenExplorerSlash>,
	{
		skip,
		take,
		operatorAddress,
		avsAddress,
	}: {
		skip: number
		take: number
		operatorAddress?: string
		avsAddress?: string
	}
) => {
	assertPage(page, skip, take)
	const identities = new Set<string>()

	for (const slash of page.data) {
		assertAddress(slash.avsAddress, 'slash AVS address')
		assertAddress(slash.operatorAddress, 'slash operator address')

		if (
			!Number.isSafeInteger(slash.operatorSetId)
			|| slash.operatorSetId < 0
			|| !Number.isSafeInteger(slash.createdAtBlock)
			|| slash.createdAtBlock < 0
			|| !Number.isSafeInteger(slash.updatedAtBlock)
			|| slash.updatedAtBlock < 0
			|| slash.strategies.length === 0
			|| slash.strategies.length !== slash.wadSlashed.length
		)
			throw new Error(`${Source.EigenExplorer_Rest}: invalid slash identity`)

		for (const strategyAddress of slash.strategies)
			assertAddress(strategyAddress, 'slash strategy address')

		if (
			new Set(slash.strategies.map((strategyAddress) => strategyAddress.toLowerCase())).size
			!== slash.strategies.length
		)
			throw new Error(`${Source.EigenExplorer_Rest}: duplicate slash strategies`)

		for (const wad of slash.wadSlashed) {
			if (!unsignedIntegerPattern.test(wad))
				throw new Error(`${Source.EigenExplorer_Rest}: invalid slash wad`)
		}

		if (slash.description.trim() === '')
			throw new Error(`${Source.EigenExplorer_Rest}: empty slash description`)

		assertTimestamp(slash.createdAt, 'slash creation timestamp')
		assertTimestamp(slash.updatedAt, 'slash update timestamp')
		if (
			slash.updatedAtBlock < slash.createdAtBlock
			|| Date.parse(slash.updatedAt) < Date.parse(slash.createdAt)
		)
			throw new Error(`${Source.EigenExplorer_Rest}: reversed slash lifecycle`)

		if (
			operatorAddress != null
			&& slash.operatorAddress.toLowerCase() !== operatorAddress.toLowerCase()
		)
			throw new Error(`${Source.EigenExplorer_Rest}: foreign slash operator`)

		if (
			avsAddress != null
			&& slash.avsAddress.toLowerCase() !== avsAddress.toLowerCase()
		)
			throw new Error(`${Source.EigenExplorer_Rest}: foreign slash AVS`)

		const identity = [
			slash.operatorAddress.toLowerCase(),
			slash.avsAddress.toLowerCase(),
			String(slash.operatorSetId),
			String(slash.createdAtBlock),
			slash.strategies.map((value) => value.toLowerCase()).join(','),
		].join(':')

		if (identities.has(identity))
			throw new Error(`${Source.EigenExplorer_Rest}: duplicate slashes`)

		identities.add(identity)
	}

	return page
}

export const listOperatorAllocations = async (
	address: string,
	{
		skip = 0,
		take = 100,
		avsAddress,
		strategyAddress,
		operatorSetId,
	}: {
		skip?: number
		take?: number
		avsAddress?: string
		strategyAddress?: string
		operatorSetId?: number
	} = {}
) => {
	assertAddress(address, 'operator address')
	const filters = allocationListFilters({
		avsAddress,
		strategyAddress,
		operatorSetId,
	})

	const wire = await fetchEigenExplorerJson<EigenExplorerPage<EigenExplorerAllocation>>(
		paginationPath({
			path: `/operators/${encodeURIComponent(address)}/allocations`,
			skip,
			take,
			filters,
		})
	)
	return assertAllocationPage(
		assertEnvelope(eigenExplorerAllocationPageEnvelope, wire, 'operator allocations'),
		{
			skip,
			take,
			operatorAddress: address,
			avsAddress,
			strategyAddress,
		}
	)
}

export const listAvsAllocations = async (
	address: string,
	{
		skip = 0,
		take = 100,
		operatorAddress,
		strategyAddress,
		operatorSetId,
	}: {
		skip?: number
		take?: number
		operatorAddress?: string
		strategyAddress?: string
		operatorSetId?: number
	} = {}
) => {
	assertAddress(address, 'AVS address')
	const filters = allocationListFilters({
		operatorAddress,
		strategyAddress,
		operatorSetId,
	})

	const wire = await fetchEigenExplorerJson<EigenExplorerPage<EigenExplorerAllocation>>(
		paginationPath({
			path: `/avs/${encodeURIComponent(address)}/allocations`,
			skip,
			take,
			filters,
		})
	)
	return assertAllocationPage(
		assertEnvelope(eigenExplorerAllocationPageEnvelope, wire, 'AVS allocations'),
		{
			skip,
			take,
			avsAddress: address,
			operatorAddress,
			strategyAddress,
		}
	)
}

export const listOperatorSlashes = async (
	address: string,
	{
		skip = 0,
		take = 100,
	}: {
		skip?: number
		take?: number
	} = {}
) => {
	assertAddress(address, 'operator address')

	const wire = await fetchEigenExplorerJson<EigenExplorerPage<EigenExplorerSlash>>(
		paginationPath({
			path: `/operators/${encodeURIComponent(address)}/slashed`,
			skip,
			take,
		})
	)
	return assertSlashPage(
		assertEnvelope(eigenExplorerSlashPageEnvelope, wire, 'operator slashes'),
		{
			skip,
			take,
			operatorAddress: address,
		}
	)
}

export const listAvsSlashes = async (
	address: string,
	{
		skip = 0,
		take = 100,
	}: {
		skip?: number
		take?: number
	} = {}
) => {
	assertAddress(address, 'AVS address')

	const wire = await fetchEigenExplorerJson<EigenExplorerPage<EigenExplorerSlash>>(
		paginationPath({
			path: `/avs/${encodeURIComponent(address)}/slashed`,
			skip,
			take,
		})
	)
	return assertSlashPage(
		assertEnvelope(eigenExplorerSlashPageEnvelope, wire, 'AVS slashes'),
		{
			skip,
			take,
			avsAddress: address,
		}
	)
}

export const getStrategyTvl = async (strategyAddress: string) => {
	assertAddress(strategyAddress, 'strategy address')

	const wire = await fetchEigenExplorerJson<EigenExplorerStrategyTvl>(
		`/metrics/tvl/restaking/${encodeURIComponent(strategyAddress)}`
	)
	const tvl = assertEnvelope(eigenExplorerStrategyTvlEnvelope, wire, 'strategy TVL')

	if (
		!Number.isFinite(tvl.tvl)
		|| tvl.tvl < 0
		|| !Number.isFinite(tvl.tvlEth)
		|| tvl.tvlEth < 0
	)
		throw new Error(`${Source.EigenExplorer_Rest}: invalid strategy TVL`)

	return tvl
}

export const getOperatorMagnitudes = async (
	address: string,
	{
		strategyAddress,
	}: {
		strategyAddress?: string
	} = {}
) => {
	assertAddress(address, 'operator address')
	if (strategyAddress != null)
		assertAddress(strategyAddress, 'strategy address')

	const path = (
		strategyAddress == null ?
			`/operators/${encodeURIComponent(address)}/magnitudes`
		:
			`/operators/${encodeURIComponent(address)}/magnitudes?${new URLSearchParams({
				strategyAddress,
			})}`
	)
	const wire = await fetchEigenExplorerJson<EigenExplorerOperatorMagnitude>(path)
	const magnitude = assertEnvelope(eigenExplorerOperatorMagnitudeEnvelope, wire, 'operator magnitudes')

	if (magnitude.operatorAddress.toLowerCase() !== address.toLowerCase())
		throw new Error(`${Source.EigenExplorer_Rest}: foreign operator magnitude`)

	assertAddress(magnitude.strategyAddress, 'magnitude strategy address')

	if (
		strategyAddress != null
		&& magnitude.strategyAddress.toLowerCase() !== strategyAddress.toLowerCase()
	)
		throw new Error(`${Source.EigenExplorer_Rest}: foreign magnitude strategy`)

	if (
		!unsignedIntegerPattern.test(magnitude.maxMagnitude)
		|| !unsignedIntegerPattern.test(magnitude.encumberedMagnitude)
		|| !Number.isSafeInteger(magnitude.createdAtBlock)
		|| magnitude.createdAtBlock < 0
		|| !Number.isSafeInteger(magnitude.updatedAtBlock)
		|| magnitude.updatedAtBlock < 0
	)
		throw new Error(`${Source.EigenExplorer_Rest}: invalid operator magnitude identity`)

	assertTimestamp(magnitude.createdAt, 'operator magnitude creation timestamp')
	assertTimestamp(magnitude.updatedAt, 'operator magnitude update timestamp')

	return magnitude
}

export const getOperatorAllocationDelay = async (address: string) => {
	assertAddress(address, 'operator address')

	const wire = await fetchEigenExplorerJson<EigenExplorerOperatorAllocationDelay>(
		`/operators/${encodeURIComponent(address)}/allocation-delay`
	)
	const delay = assertEnvelope(eigenExplorerOperatorAllocationDelayEnvelope, wire, 'operator allocation delay')

	if (delay.operatorAddress.toLowerCase() !== address.toLowerCase())
		throw new Error(`${Source.EigenExplorer_Rest}: foreign operator allocation delay`)

	if (
		!Number.isSafeInteger(delay.delay)
		|| delay.delay < 0
		|| !Number.isSafeInteger(delay.effectBlock)
		|| delay.effectBlock < 0
		|| !Number.isSafeInteger(delay.createdAtBlock)
		|| delay.createdAtBlock < 0
		|| !Number.isSafeInteger(delay.updatedAtBlock)
		|| delay.updatedAtBlock < 0
	)
		throw new Error(`${Source.EigenExplorer_Rest}: invalid operator allocation delay identity`)

	assertTimestamp(delay.createdAt, 'operator allocation delay creation timestamp')
	assertTimestamp(delay.updatedAt, 'operator allocation delay update timestamp')

	return delay
}
