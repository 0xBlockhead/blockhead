import { getJson } from '$/lib/http.ts'
import type { SourceBinding } from '$/sources/SourceBinding.ts'
import {
	firstHttpUrlForBinding,
	httpOriginsForBinding,
} from '$/sources/_runtime/http.ts'
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
			exponent: 'number.integer >= 0 <= 4294967295',
			aliases: 'string[]',
		}).array(),
	},
})

const base = (binding: SourceBinding) => firstHttpUrlForBinding(binding).replace(/\/$/, '')

export const getBlock = ({
	binding,
	height,
}: {
	binding: SourceBinding
	height: bigint
}) => (
	getJson<CosmosSdkBlockResponse>(
		`${base(binding)}/cosmos/base/tendermint/v1beta1/blocks/${height.toString()}`,
		{ origins: httpOriginsForBinding(binding) }
	)
)

export const getLatestBlock = ({
	binding,
}: {
	binding: SourceBinding
}) => (
	getJson<CosmosSdkBlockResponse>(
		`${base(binding)}/cosmos/base/tendermint/v1beta1/blocks/latest`,
		{ origins: httpOriginsForBinding(binding) }
	)
)

export const getNodeInfo = ({ binding }: { binding: SourceBinding }) => (
	getJson<CosmosSdkNodeInfoResponse>(
		`${base(binding)}/cosmos/base/tendermint/v1beta1/node_info`,
		{ origins: httpOriginsForBinding(binding) }
	)
)

export const getSyncing = ({ binding }: { binding: SourceBinding }) => (
	getJson<CosmosSdkSyncingResponse>(
		`${base(binding)}/cosmos/base/tendermint/v1beta1/syncing`,
		{ origins: httpOriginsForBinding(binding) }
	)
)

export const getTx = ({
	binding,
	txHash,
}: {
	binding: SourceBinding
	txHash: string
}) => (
	getJson<CosmosSdkTxResponse>(
		`${base(binding)}/cosmos/tx/v1beta1/txs/${encodeURIComponent(txHash)}`,
		{ origins: httpOriginsForBinding(binding) }
	)
)

export const getTransactionsByEvent = ({
	binding,
	event,
	page = 1,
	limit = 24,
}: {
	binding: SourceBinding
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

	return getJson<CosmosSdkTxsEventResponse>(
		`${base(binding)}/cosmos/tx/v1beta1/txs?${parameters}`,
		{ origins: httpOriginsForBinding(binding) }
	)
}

export const getValidators = ({
	binding,
	limit = 24,
	status,
}: {
	binding: SourceBinding
	limit?: number
	status?: string
}) => {
	const parameters = new URLSearchParams({
		'pagination.limit': String(limit),
		'pagination.count_total': 'true',
		...(status != null && { status }),
	})

	return getJson<CosmosSdkValidatorsResponse>(
		`${base(binding)}/cosmos/staking/v1beta1/validators?${parameters}`,
		{ origins: httpOriginsForBinding(binding) }
	)
}

export const getStakingPool = ({ binding }: { binding: SourceBinding }) => (
	getJson<CosmosSdkStakingPoolResponse>(
		`${base(binding)}/cosmos/staking/v1beta1/pool`,
		{ origins: httpOriginsForBinding(binding) }
	)
)

export const getValidator = ({
	binding,
	operatorAddress,
}: {
	binding: SourceBinding
	operatorAddress: string
}) => (
	getJson<CosmosSdkValidatorResponse>(
		`${base(binding)}/cosmos/staking/v1beta1/validators/${operatorAddress}`,
		{ origins: httpOriginsForBinding(binding) }
	)
)

export const getAccount = ({
	binding,
	address,
}: {
	binding: SourceBinding
	address: string
}) => (
	getJson<CosmosSdkAccountResponse>(
		`${base(binding)}/cosmos/auth/v1beta1/accounts/${encodeURIComponent(address)}`,
		{ origins: httpOriginsForBinding(binding) }
	)
)

export const getAccounts = ({
	binding,
	limit = 24,
}: {
	binding: SourceBinding
	limit?: number
}) => {
	const parameters = new URLSearchParams({
		'pagination.limit': String(limit),
		'pagination.count_total': 'true',
	})

	return getJson<CosmosSdkAccountsResponse>(
		`${base(binding)}/cosmos/auth/v1beta1/accounts?${parameters}`,
		{ origins: httpOriginsForBinding(binding) }
	)
}

export const getProposal = ({
	binding,
	proposalId,
}: {
	binding: SourceBinding
	proposalId: string
}) => (
	getJson<CosmosSdkProposalResponse>(
		`${base(binding)}/cosmos/gov/v1/proposals/${encodeURIComponent(proposalId)}`,
		{ origins: httpOriginsForBinding(binding) }
	)
)

export const getProposals = ({
	binding,
	limit = 12,
	paginationKey,
}: {
	binding: SourceBinding
	limit?: number
	paginationKey?: string
}) => {
	const parameters = new URLSearchParams({
		'pagination.limit': String(limit),
		'pagination.count_total': 'true',
		...(paginationKey != null && { 'pagination.key': paginationKey }),
	})

	return getJson<CosmosSdkProposalsResponse>(
		`${base(binding)}/cosmos/gov/v1/proposals?${parameters}`,
		{ origins: httpOriginsForBinding(binding) }
	)
}

export const getProposalVotes = ({
	binding,
	proposalId,
	limit = 24,
	paginationKey,
}: {
	binding: SourceBinding
	proposalId: string
	limit?: number
	paginationKey?: string
}) => {
	const parameters = new URLSearchParams({
		'pagination.limit': String(limit),
		'pagination.count_total': 'true',
		...(paginationKey != null && { 'pagination.key': paginationKey }),
	})

	return getJson<CosmosSdkVotesResponse>(
		`${base(binding)}/cosmos/gov/v1/proposals/${encodeURIComponent(proposalId)}/votes?${parameters}`,
		{ origins: httpOriginsForBinding(binding) }
	)
}

export const getProposalVote = ({
	binding,
	proposalId,
	voter,
}: {
	binding: SourceBinding
	proposalId: string
	voter: string
}) => (
	getJson<CosmosSdkVoteResponse>(
		`${base(binding)}/cosmos/gov/v1/proposals/${encodeURIComponent(proposalId)}/votes/${encodeURIComponent(voter)}`,
		{ origins: httpOriginsForBinding(binding) }
	)
)

export const getProposalDeposits = ({
	binding,
	proposalId,
	limit = 24,
	paginationKey,
}: {
	binding: SourceBinding
	proposalId: string
	limit?: number
	paginationKey?: string
}) => {
	const parameters = new URLSearchParams({
		'pagination.limit': String(limit),
		'pagination.count_total': 'true',
		...(paginationKey != null && { 'pagination.key': paginationKey }),
	})

	return getJson<CosmosSdkDepositsResponse>(
		`${base(binding)}/cosmos/gov/v1/proposals/${encodeURIComponent(proposalId)}/deposits?${parameters}`,
		{ origins: httpOriginsForBinding(binding) }
	)
}

export const getProposalDeposit = ({
	binding,
	proposalId,
	depositor,
}: {
	binding: SourceBinding
	proposalId: string
	depositor: string
}) => (
	getJson<CosmosSdkDepositResponse>(
		`${base(binding)}/cosmos/gov/v1/proposals/${encodeURIComponent(proposalId)}/deposits/${encodeURIComponent(depositor)}`,
		{ origins: httpOriginsForBinding(binding) }
	)
)

export const getProposalTally = ({
	binding,
	proposalId,
}: {
	binding: SourceBinding
	proposalId: string
}) => (
	getJson<CosmosSdkTallyResponse>(
		`${base(binding)}/cosmos/gov/v1/proposals/${encodeURIComponent(proposalId)}/tally`,
		{ origins: httpOriginsForBinding(binding) }
	)
)

export const getDenomMetadata = async ({
	binding,
	denom,
	blockHeight,
}: {
	binding: SourceBinding
	denom: string
	blockHeight?: bigint
}) => {
	if (denom.length === 0)
		throw new Error('CosmosSdk_Rest: denom metadata subject is empty')
	if (blockHeight != null && blockHeight < 1n)
		throw new Error('CosmosSdk_Rest: denom metadata block height must be positive')

	const response = cosmosSdkDenomMetadataWire.assert(await getJson<JsonValue>(
		`${base(binding)}/cosmos/bank/v1beta1/denoms_metadata/${encodeURIComponent(denom)}`,
		{
			origins: httpOriginsForBinding(binding),
			...(blockHeight != null && {
				init: {
					headers: {
						'x-cosmos-block-height': blockHeight.toString(),
					},
				},
			}),
		}
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
	binding,
	moduleName,
}: {
	binding: SourceBinding
	moduleName: string
}) => (
	getJson<CosmosSdkModuleAccountResponse>(
		`${base(binding)}/cosmos/auth/v1beta1/module_accounts/${moduleName}`,
		{ origins: httpOriginsForBinding(binding) }
	)
)

export const getBalances = async ({
	binding,
	network,
	address,
	blockHeight,
	limit = 100,
	continuationToken,
}: {
	binding: SourceBinding
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

	const normalizedRestBaseUrl = base(binding)
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

	const response = cosmosSdkBalancesWire.assert(await getJson<JsonValue>(
		`${normalizedRestBaseUrl}/cosmos/bank/v1beta1/balances/${encodeURIComponent(address)}?${parameters}`,
		{
			origins: httpOriginsForBinding(binding),
			init: {
				headers: {
					'x-cosmos-block-height': blockHeight.toString(),
				},
			},
		}
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
	binding,
	delegatorAddress,
	limit = 100,
	paginationKey,
}: {
	binding: SourceBinding
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

	return getJson<CosmosSdkDelegationsResponse>(
		`${base(binding)}/cosmos/staking/v1beta1/delegations/${encodeURIComponent(delegatorAddress)}?${parameters}`,
		{ origins: httpOriginsForBinding(binding) }
	)
}

export const getDelegationRewards = ({
	binding,
	delegatorAddress,
}: {
	binding: SourceBinding
	delegatorAddress: string
}) => (
	getJson<CosmosSdkDelegationRewardsResponse>(
		`${base(binding)}/cosmos/distribution/v1beta1/delegators/${encodeURIComponent(delegatorAddress)}/rewards`,
		{ origins: httpOriginsForBinding(binding) }
	)
)

export const getContractInfo = ({
	binding,
	address,
}: {
	binding: SourceBinding
	address: string
}) => (
	getJson<CosmosSdkContractInfoResponse>(
		`${base(binding)}/cosmwasm/wasm/v1/contract/${address}`,
		{ origins: httpOriginsForBinding(binding) }
	)
)
