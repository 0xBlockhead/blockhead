import { throwHttpError } from '$/lib/http.ts'
import bindings from '$/sources/EigenExplorer/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { httpUrl } from '$/sources/_shared/wire/HttpRest/client.ts'
import { sourceFetch } from '$/sources/_runtime/http.ts'
import type {
	EigenExplorerDeposit,
	EigenExplorerOperatorRewardInfo,
	EigenExplorerPage,
	EigenExplorerStaker,
	EigenExplorerWithdrawal,
} from '$/sources/EigenExplorer/Rest/types.ts'

const binding = bindings[Source.EigenExplorer_Rest][0]

const evmAddressPattern = /^0x[0-9a-f]{40}$/i
const bytes32Pattern = /^0x[0-9a-f]{64}$/i
const unsignedIntegerPattern = /^(0|[1-9][0-9]*)$/

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
		throw new Error(`EigenExplorer returned invalid ${label}`)
}

const assertTimestamp = (
	timestamp: string,
	label: string
) => {
	if (!Number.isFinite(Date.parse(timestamp)))
		throw new Error(`EigenExplorer returned invalid ${label}`)
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
			throw new Error('EigenExplorer returned invalid strategy shares')

		const strategyAddress = value.strategyAddress.toLowerCase()

		if (strategyAddresses.has(strategyAddress))
			throw new Error('EigenExplorer returned duplicate strategy shares')

		strategyAddresses.add(strategyAddress)
	}
}

const paginationPath = ({
	path,
	skip,
	take,
}: {
	path: string
	skip: number
	take: number
}) => {
	if (!Number.isSafeInteger(skip) || skip < 0)
		throw new Error('EigenExplorer skip must be a nonnegative safe integer')

	if (!Number.isSafeInteger(take) || take < 1 || take > 100)
		throw new Error('EigenExplorer take must be between 1 and 100')

	return `${path}?${new URLSearchParams({
		skip: String(skip),
		take: String(take),
	})}`
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
	)
		throw new Error('EigenExplorer returned invalid pagination metadata')

	return page
}

export const getStaker = async (address: string) => {
	assertAddress(address, 'staker address')

	const staker = await fetchEigenExplorerJson<EigenExplorerStaker>(
		`/stakers/${encodeURIComponent(address)}`
	)

	if (staker.address.toLowerCase() !== address.toLowerCase())
		throw new Error('EigenExplorer returned a foreign staker')

	if (staker.operatorAddress !== null)
		assertAddress(staker.operatorAddress, 'operator address')

	if (
		!unsignedIntegerPattern.test(staker.createdAtBlock)
		|| !unsignedIntegerPattern.test(staker.updatedAtBlock)
	)
		throw new Error('EigenExplorer returned invalid staker block identity')

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

	const page = assertPage(
		await fetchEigenExplorerJson<EigenExplorerPage<EigenExplorerDeposit>>(
			paginationPath({
				path: `/stakers/${encodeURIComponent(address)}/deposits`,
				skip,
				take,
			})
		),
		skip,
		take
	)
	const identities = new Set<string>()

	for (const deposit of page.data) {
		if (deposit.stakerAddress.toLowerCase() !== address.toLowerCase())
			throw new Error('EigenExplorer returned a foreign deposit')

		if (!bytes32Pattern.test(deposit.transactionHash))
			throw new Error('EigenExplorer returned invalid deposit transaction hash')

		assertAddress(deposit.tokenAddress, 'deposit token address')
		assertAddress(deposit.strategyAddress, 'deposit strategy address')

		if (
			!unsignedIntegerPattern.test(deposit.shares)
			|| !Number.isSafeInteger(deposit.createdAtBlock)
			|| deposit.createdAtBlock < 0
		)
			throw new Error('EigenExplorer returned invalid deposit quantity')

		assertTimestamp(deposit.createdAt, 'deposit timestamp')

		const identity = `${deposit.transactionHash.toLowerCase()}:${deposit.strategyAddress.toLowerCase()}`

		if (identities.has(identity))
			throw new Error('EigenExplorer returned duplicate deposits')

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

	const page = assertPage(
		await fetchEigenExplorerJson<EigenExplorerPage<EigenExplorerWithdrawal>>(
			paginationPath({
				path: `/stakers/${encodeURIComponent(address)}/withdrawals`,
				skip,
				take,
			})
		),
		skip,
		take
	)
	const withdrawalRoots = new Set<string>()

	for (const withdrawal of page.data) {
		if (withdrawal.stakerAddress.toLowerCase() !== address.toLowerCase())
			throw new Error('EigenExplorer returned a foreign withdrawal')

		if (!bytes32Pattern.test(withdrawal.withdrawalRoot))
			throw new Error('EigenExplorer returned invalid withdrawal root')

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
			throw new Error('EigenExplorer returned invalid withdrawal identity')

		assertTimestamp(withdrawal.createdAt, 'withdrawal creation timestamp')
		assertTimestamp(withdrawal.updatedAt, 'withdrawal update timestamp')

		const withdrawalRoot = withdrawal.withdrawalRoot.toLowerCase()

		if (withdrawalRoots.has(withdrawalRoot))
			throw new Error('EigenExplorer returned duplicate withdrawals')

		withdrawalRoots.add(withdrawalRoot)
	}

	return page
}

export const getOperatorRewardInfo = async (address: string) => {
	assertAddress(address, 'operator address')

	const rewardInfo = await fetchEigenExplorerJson<EigenExplorerOperatorRewardInfo>(
		`/operators/${encodeURIComponent(address)}/rewards`
	)

	if (rewardInfo.address.toLowerCase() !== address.toLowerCase())
		throw new Error('EigenExplorer returned foreign operator reward information')

	for (const tokenAddress of rewardInfo.rewardTokens)
		assertAddress(tokenAddress, 'reward token address')

	for (const strategyAddress of rewardInfo.rewardStrategies)
		assertAddress(strategyAddress, 'reward strategy address')

	if (
		new Set(rewardInfo.rewardTokens.map((value) => value.toLowerCase())).size !== rewardInfo.rewardTokens.length
		|| new Set(rewardInfo.rewardStrategies.map((value) => value.toLowerCase())).size !== rewardInfo.rewardStrategies.length
	)
		throw new Error('EigenExplorer returned duplicate reward information')

	return rewardInfo
}
