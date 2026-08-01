import { fetchFailedMessage } from '$/lib/http.ts'
import { TransportType } from '$/constants/TransportType.ts'
import { Source } from '$/sources/Source.ts'
import {
	firstHttpUrlForBinding,
	sourceFetch,
	sourceGetJson,
} from '$/sources/_runtime/http.ts'
import bindings from '$/sources/CosmosSdk/bindings.ts'
import type {
	CosmosSdkAccountsResponse,
	CosmosSdkAccountResponse,
	CosmosSdkBalancesResponse,
	CosmosSdkBlockResponse,
	CosmosSdkContractInfoResponse,
	CosmosSdkDelegationRewardsResponse,
	CosmosSdkDelegationsResponse,
	CosmosSdkDepositResponse,
	CosmosSdkDepositsResponse,
	CosmosSdkModuleAccountResponse,
	CosmosSdkNodeInfoResponse,
	CosmosSdkProposalResponse,
	CosmosSdkProposalsResponse,
	CosmosSdkStakingPoolResponse,
	CosmosSdkSyncingResponse,
	CosmosSdkTallyResponse,
	CosmosSdkTxResponse,
	CosmosSdkTxsEventResponse,
	CosmosSdkValidatorResponse,
	CosmosSdkValidatorsResponse,
	CosmosSdkVoteResponse,
	CosmosSdkVotesResponse,
} from '$/sources/CosmosSdk/Rest/types.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'
import { type as arktype } from 'arktype'

const cosmosSdkBalancesWire = arktype({
	balances: arktype({
		denom: 'string > 0',
		amount: '/^(0|[1-9][0-9]*)$/',
	}).array(),
	'pagination?': {
		'next_key?': 'string | null',
		'total?': '/^(0|[1-9][0-9]*)$/',
	},
})

const cosmosSdkDenomMetadataWire = arktype({
	metadata: {
		name: 'string',
		description: 'string',
		base: 'string > 0',
		display: 'string > 0',
		symbol: 'string',
		denom_units: arktype({
			denom: 'string > 0',
			exponent: 'number.integer >= 0 & number <= 4294967295',
			aliases: 'string[]',
		}).array(),
	},
})

const binding = bindings[Source.CosmosSdk_Rest]
const base = firstHttpUrlForBinding(binding).replace(/\/$/, '')

export const cosmosSdkRestEndpoints = binding.endpoints.map(({ locator: url }) => ({
	url,
	transportType: TransportType.Http,
	providerName: 'Cosmos Directory',
}))

const getJsonAtBlockHeight = <_Json>(
	url: string,
	blockHeight: bigint
) => sourceFetch(binding, url, {
		headers: {
			'x-cosmos-block-height': blockHeight.toString(),
		},
	})
	.then(async (response) => {
		if (!response.ok)
			throw new Error(await fetchFailedMessage(url, response))

		return response.json<_Json>()
	})

export const getBlock = ({
	height,
}: {
	height: bigint
}) => (
	sourceGetJson<CosmosSdkBlockResponse>(
		binding,
		`${base}/cosmos/base/tendermint/v1beta1/blocks/${height.toString()}`
	)
)

export const getLatestBlock = () => (
	sourceGetJson<CosmosSdkBlockResponse>(
		binding,
		`${base}/cosmos/base/tendermint/v1beta1/blocks/latest`
	)
)

export const getNodeInfo = () => (
	sourceGetJson<CosmosSdkNodeInfoResponse>(
		binding,
		`${base}/cosmos/base/tendermint/v1beta1/node_info`
	)
)

export const getSyncing = () => (
	sourceGetJson<CosmosSdkSyncingResponse>(
		binding,
		`${base}/cosmos/base/tendermint/v1beta1/syncing`
	)
)

export const getTx = ({
	txHash,
}: {
	txHash: string
}) => (
	sourceGetJson<CosmosSdkTxResponse>(
		binding,
		`${base}/cosmos/tx/v1beta1/txs/${encodeURIComponent(txHash)}`
	)
)

export const getTransactionsByEvent = ({
	event,
	page = 1,
	limit = 24,
}: {
	event: string
	page?: number
	limit?: number
}) => {
	if (!Number.isSafeInteger(page) || page < 1)
		throw new Error(`CosmosSdk_Rest: invalid transaction page ${page}`)

	if (!Number.isSafeInteger(limit) || limit < 1 || limit > 100)
		throw new Error(`CosmosSdk_Rest: invalid transaction page limit ${limit}`)

	if (event.length === 0)
		throw new Error('CosmosSdk_Rest: transaction event is empty')

	const parameters = new URLSearchParams({
		events: event,
		order_by: 'ORDER_BY_DESC',
		page: String(page),
		limit: String(limit),
	})

	return sourceGetJson<CosmosSdkTxsEventResponse>(
		binding,
		`${base}/cosmos/tx/v1beta1/txs?${parameters}`
	)
}

export const getValidators = ({
	limit = 24,
	status,
}: {
	limit?: number
	status?: string
}) => {
	const parameters = new URLSearchParams({
		'pagination.limit': String(limit),
		'pagination.count_total': 'true',
		...(status != null && { status }),
	})

	return sourceGetJson<CosmosSdkValidatorsResponse>(
		binding,
		`${base}/cosmos/staking/v1beta1/validators?${parameters}`
	)
}

export const getStakingPool = () => (
	sourceGetJson<CosmosSdkStakingPoolResponse>(
		binding,
		`${base}/cosmos/staking/v1beta1/pool`
	)
)

export const getValidator = ({
	operatorAddress,
}: {
	operatorAddress: string
}) => (
	sourceGetJson<CosmosSdkValidatorResponse>(
		binding,
		`${base}/cosmos/staking/v1beta1/validators/${operatorAddress}`
	)
)

export const getAccount = ({
	address,
}: {
	address: string
}) => (
	sourceGetJson<CosmosSdkAccountResponse>(
		binding,
		`${base}/cosmos/auth/v1beta1/accounts/${encodeURIComponent(address)}`
	)
)

export const getAccounts = ({
	limit = 24,
}: {
	limit?: number
}) => {
	const parameters = new URLSearchParams({
		'pagination.limit': String(limit),
		'pagination.count_total': 'true',
	})

	return sourceGetJson<CosmosSdkAccountsResponse>(
		binding,
		`${base}/cosmos/auth/v1beta1/accounts?${parameters}`
	)
}

export const getProposal = ({
	proposalId,
}: {
	proposalId: string
}) => (
	sourceGetJson<CosmosSdkProposalResponse>(
		binding,
		`${base}/cosmos/gov/v1/proposals/${encodeURIComponent(proposalId)}`
	)
)

export const getProposals = ({
	limit = 12,
	paginationKey,
}: {
	limit?: number
	paginationKey?: string
}) => {
	const parameters = new URLSearchParams({
		'pagination.limit': String(limit),
		'pagination.count_total': 'true',
		...(paginationKey != null && { 'pagination.key': paginationKey }),
	})

	return sourceGetJson<CosmosSdkProposalsResponse>(
		binding,
		`${base}/cosmos/gov/v1/proposals?${parameters}`
	)
}

export const getProposalVotes = ({
	proposalId,
	limit = 24,
	paginationKey,
}: {
	proposalId: string
	limit?: number
	paginationKey?: string
}) => {
	const parameters = new URLSearchParams({
		'pagination.limit': String(limit),
		'pagination.count_total': 'true',
		...(paginationKey != null && { 'pagination.key': paginationKey }),
	})

	return sourceGetJson<CosmosSdkVotesResponse>(
		binding,
		`${base}/cosmos/gov/v1/proposals/${encodeURIComponent(proposalId)}/votes?${parameters}`
	)
}

export const getProposalVote = ({
	proposalId,
	voter,
}: {
	proposalId: string
	voter: string
}) => (
	sourceGetJson<CosmosSdkVoteResponse>(
		binding,
		`${base}/cosmos/gov/v1/proposals/${encodeURIComponent(proposalId)}/votes/${encodeURIComponent(voter)}`
	)
)

export const getProposalDeposits = ({
	proposalId,
	limit = 24,
	paginationKey,
}: {
	proposalId: string
	limit?: number
	paginationKey?: string
}) => {
	const parameters = new URLSearchParams({
		'pagination.limit': String(limit),
		'pagination.count_total': 'true',
		...(paginationKey != null && { 'pagination.key': paginationKey }),
	})

	return sourceGetJson<CosmosSdkDepositsResponse>(
		binding,
		`${base}/cosmos/gov/v1/proposals/${encodeURIComponent(proposalId)}/deposits?${parameters}`
	)
}

export const getProposalDeposit = ({
	proposalId,
	depositor,
}: {
	proposalId: string
	depositor: string
}) => (
	sourceGetJson<CosmosSdkDepositResponse>(
		binding,
		`${base}/cosmos/gov/v1/proposals/${encodeURIComponent(proposalId)}/deposits/${encodeURIComponent(depositor)}`
	)
)

export const getProposalTally = ({
	proposalId,
}: {
	proposalId: string
}) => (
	sourceGetJson<CosmosSdkTallyResponse>(
		binding,
		`${base}/cosmos/gov/v1/proposals/${encodeURIComponent(proposalId)}/tally`
	)
)

export const getDenomMetadata = async ({
	denom,
	blockHeight,
}: {
	denom: string
	blockHeight?: bigint
}) => {
	if (denom.length === 0)
		throw new Error('CosmosSdk_Rest: denom metadata subject is empty')
	if (blockHeight != null && blockHeight < 1n)
		throw new Error('CosmosSdk_Rest: denom metadata block height must be positive')

	const response = cosmosSdkDenomMetadataWire.assert(await (
		blockHeight == null ?
			sourceGetJson<JsonValue>(
				binding,
				`${base}/cosmos/bank/v1beta1/denoms_metadata/${encodeURIComponent(denom)}`
			)
		:
			getJsonAtBlockHeight<JsonValue>(
				`${base}/cosmos/bank/v1beta1/denoms_metadata/${encodeURIComponent(denom)}`,
				blockHeight
			)
	))
	if (new Set(response.metadata.denom_units.map(({ denom: unit }) => unit)).size !== response.metadata.denom_units.length)
		throw new Error('CosmosSdk_Rest: denom metadata contains duplicate units')
	if (response.metadata.denom_units.some(({ aliases }) => new Set(aliases).size !== aliases.length))
		throw new Error('CosmosSdk_Rest: denom metadata contains duplicate aliases')
	if (!response.metadata.denom_units.some(({ denom: unit, exponent }) => unit === response.metadata.base && exponent === 0))
		throw new Error('CosmosSdk_Rest: denom metadata base unit is missing or has a nonzero exponent')
	if (!response.metadata.denom_units.some(({ denom: unit }) => unit === response.metadata.display))
		throw new Error('CosmosSdk_Rest: denom metadata display unit is missing')

	return response
}

export const getModuleAccount = ({
	moduleName,
}: {
	moduleName: string
}) => (
	sourceGetJson<CosmosSdkModuleAccountResponse>(
		binding,
		`${base}/cosmos/auth/v1beta1/module_accounts/${moduleName}`
	)
)

export const getBalances = async ({
	network,
	address,
	blockHeight,
	limit = 100,
	continuationToken,
}: {
	network: string
	address: string
	blockHeight: bigint
	limit?: number
	continuationToken?: string
}) => {
	if (!Number.isSafeInteger(limit) || limit < 1 || limit > 100)
		throw new Error(`CosmosSdk_Rest: invalid balance page limit ${limit}`)
	if (network.length === 0)
		throw new Error('CosmosSdk_Rest: balance network is empty')
	if (address.length === 0)
		throw new Error('CosmosSdk_Rest: balance account is empty')
	if (blockHeight < 1n)
		throw new Error('CosmosSdk_Rest: balance block height must be positive')

	const normalizedRestBaseUrl = base
	const continuation = continuationToken == null ?
		undefined
	:
		new URLSearchParams(continuationToken)
	if (
		continuation != null
		&& (
			continuation.get('v') !== '1'
			|| continuation.get('endpoint') !== normalizedRestBaseUrl
			|| continuation.get('network') !== network
			|| continuation.get('address') !== address
			|| continuation.get('height') !== blockHeight.toString()
			|| continuation.get('key') == null
			|| continuation.get('key') === ''
			|| continuation.getAll('v').length !== 1
			|| continuation.getAll('endpoint').length !== 1
			|| continuation.getAll('network').length !== 1
			|| continuation.getAll('address').length !== 1
			|| continuation.getAll('height').length !== 1
			|| continuation.getAll('key').length !== 1
			|| [...continuation.keys()].some((key) => (
				key !== 'v'
					&& key !== 'endpoint'
					&& key !== 'network'
					&& key !== 'address'
					&& key !== 'height'
					&& key !== 'key'
			))
		)
	)
		throw new Error('CosmosSdk_Rest: invalid or foreign balance continuation')

	const paginationKey = continuation?.get('key') ?? undefined

	const parameters = new URLSearchParams({
		'pagination.limit': String(limit),
		'pagination.count_total': 'true',
		...(paginationKey != null && { 'pagination.key': paginationKey }),
	})

	const response = cosmosSdkBalancesWire.assert(await getJsonAtBlockHeight<JsonValue>(
		`${normalizedRestBaseUrl}/cosmos/bank/v1beta1/balances/${encodeURIComponent(address)}?${parameters}`,
		blockHeight
	))
	if (response.balances.length > limit)
		throw new Error('CosmosSdk_Rest: balance page exceeds its requested limit')
	if (new Set(response.balances.map(({ denom }) => denom)).size !== response.balances.length)
		throw new Error('CosmosSdk_Rest: balance page contains duplicate denoms')
	if (response.pagination?.next_key != null && response.pagination.next_key === paginationKey)
		throw new Error('CosmosSdk_Rest: balance continuation did not advance')

	return {
		balances: response.balances.map(({ denom, amount }) => ({
			denom,
			amount: BigInt(amount),
		})),
		blockHeight,
		...(response.pagination?.total != null && {
			total: BigInt(response.pagination.total),
		}),
		...(response.pagination?.next_key != null && response.pagination.next_key !== '' && {
			continuationToken: new URLSearchParams({
				v: '1',
				endpoint: normalizedRestBaseUrl,
				network,
				address,
				height: blockHeight.toString(),
				key: response.pagination.next_key,
			}).toString(),
		}),
	} satisfies CosmosSdkBalancesResponse
}

export const getDelegations = ({
	delegatorAddress,
	limit = 100,
	paginationKey,
}: {
	delegatorAddress: string
	limit?: number
	paginationKey?: string
}) => {
	if (!Number.isSafeInteger(limit) || limit < 1 || limit > 100)
		throw new Error(`CosmosSdk_Rest: invalid delegation page limit ${limit}`)

	const parameters = new URLSearchParams({
		'pagination.limit': String(limit),
		'pagination.count_total': 'true',
		...(paginationKey != null && { 'pagination.key': paginationKey }),
	})

	return sourceGetJson<CosmosSdkDelegationsResponse>(
		binding,
		`${base}/cosmos/staking/v1beta1/delegations/${encodeURIComponent(delegatorAddress)}?${parameters}`
	)
}

export const getDelegationRewards = ({
	delegatorAddress,
}: {
	delegatorAddress: string
}) => (
	sourceGetJson<CosmosSdkDelegationRewardsResponse>(
		binding,
		`${base}/cosmos/distribution/v1beta1/delegators/${encodeURIComponent(delegatorAddress)}/rewards`
	)
)

export const getContractInfo = ({
	address,
}: {
	address: string
}) => (
	sourceGetJson<CosmosSdkContractInfoResponse>(
		binding,
		`${base}/cosmwasm/wasm/v1/contract/${address}`
	)
)
