import { getJson } from '$/lib/http.ts'
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

const cosmosSdkOrigins = [
	{
		origin: 'https://cosmos-rest.publicnode.com',
		corsEnabled: true,
	},
	{
		origin: 'https://rest.cosmos.directory',
		corsEnabled: true,
	},
] as const

const base = (restBaseUrl: string) => restBaseUrl.replace(/\/$/, '')

export const getBlock = ({
	restBaseUrl,
	height,
}: {
	restBaseUrl: string
	height: bigint
}) => (
	getJson<CosmosSdkBlockResponse>(
		`${base(restBaseUrl)}/cosmos/base/tendermint/v1beta1/blocks/${height.toString()}`,
		{ origins: cosmosSdkOrigins }
	)
)

export const getLatestBlock = ({
	restBaseUrl,
}: {
	restBaseUrl: string
}) => (
	getJson<CosmosSdkBlockResponse>(
		`${base(restBaseUrl)}/cosmos/base/tendermint/v1beta1/blocks/latest`,
		{ origins: cosmosSdkOrigins }
	)
)

export const getNodeInfo = ({ restBaseUrl }: { restBaseUrl: string }) => (
	getJson<CosmosSdkNodeInfoResponse>(
		`${base(restBaseUrl)}/cosmos/base/tendermint/v1beta1/node_info`,
		{ origins: cosmosSdkOrigins }
	)
)

export const getSyncing = ({ restBaseUrl }: { restBaseUrl: string }) => (
	getJson<CosmosSdkSyncingResponse>(
		`${base(restBaseUrl)}/cosmos/base/tendermint/v1beta1/syncing`,
		{ origins: cosmosSdkOrigins }
	)
)

export const getTx = ({
	restBaseUrl,
	txHash,
}: {
	restBaseUrl: string
	txHash: string
}) => (
	getJson<CosmosSdkTxResponse>(
		`${base(restBaseUrl)}/cosmos/tx/v1beta1/txs/${encodeURIComponent(txHash)}`,
		{ origins: cosmosSdkOrigins }
	)
)

export const getTransactionsByEvent = ({
	restBaseUrl,
	event,
	page = 1,
	limit = 24,
}: {
	restBaseUrl: string
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
		`${base(restBaseUrl)}/cosmos/tx/v1beta1/txs?${parameters}`,
		{ origins: cosmosSdkOrigins }
	)
}

export const getValidators = ({
	restBaseUrl,
	limit = 24,
	status,
}: {
	restBaseUrl: string
	limit?: number
	status?: string
}) => {
	const parameters = new URLSearchParams({
		'pagination.limit': String(limit),
		'pagination.count_total': 'true',
		...(status != null && { status }),
	})

	return getJson<CosmosSdkValidatorsResponse>(
		`${base(restBaseUrl)}/cosmos/staking/v1beta1/validators?${parameters}`,
		{ origins: cosmosSdkOrigins }
	)
}

export const getStakingPool = ({ restBaseUrl }: { restBaseUrl: string }) => (
	getJson<CosmosSdkStakingPoolResponse>(
		`${base(restBaseUrl)}/cosmos/staking/v1beta1/pool`,
		{ origins: cosmosSdkOrigins }
	)
)

export const getValidator = ({
	restBaseUrl,
	operatorAddress,
}: {
	restBaseUrl: string
	operatorAddress: string
}) => (
	getJson<CosmosSdkValidatorResponse>(
		`${base(restBaseUrl)}/cosmos/staking/v1beta1/validators/${operatorAddress}`,
		{ origins: cosmosSdkOrigins }
	)
)

export const getAccount = ({
	restBaseUrl,
	address,
}: {
	restBaseUrl: string
	address: string
}) => (
	getJson<CosmosSdkAccountResponse>(
		`${base(restBaseUrl)}/cosmos/auth/v1beta1/accounts/${encodeURIComponent(address)}`,
		{ origins: cosmosSdkOrigins }
	)
)

export const getAccounts = ({
	restBaseUrl,
	limit = 24,
}: {
	restBaseUrl: string
	limit?: number
}) => {
	const parameters = new URLSearchParams({
		'pagination.limit': String(limit),
		'pagination.count_total': 'true',
	})

	return getJson<CosmosSdkAccountsResponse>(
		`${base(restBaseUrl)}/cosmos/auth/v1beta1/accounts?${parameters}`,
		{ origins: cosmosSdkOrigins }
	)
}

export const getProposal = ({
	restBaseUrl,
	proposalId,
}: {
	restBaseUrl: string
	proposalId: string
}) => (
	getJson<CosmosSdkProposalResponse>(
		`${base(restBaseUrl)}/cosmos/gov/v1/proposals/${encodeURIComponent(proposalId)}`,
		{ origins: cosmosSdkOrigins }
	)
)

export const getProposals = ({
	restBaseUrl,
	limit = 12,
	paginationKey,
}: {
	restBaseUrl: string
	limit?: number
	paginationKey?: string
}) => {
	const parameters = new URLSearchParams({
		'pagination.limit': String(limit),
		'pagination.count_total': 'true',
		...(paginationKey != null && { 'pagination.key': paginationKey }),
	})

	return getJson<CosmosSdkProposalsResponse>(
		`${base(restBaseUrl)}/cosmos/gov/v1/proposals?${parameters}`,
		{ origins: cosmosSdkOrigins }
	)
}

export const getProposalVotes = ({
	restBaseUrl,
	proposalId,
	limit = 24,
	paginationKey,
}: {
	restBaseUrl: string
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
		`${base(restBaseUrl)}/cosmos/gov/v1/proposals/${encodeURIComponent(proposalId)}/votes?${parameters}`,
		{ origins: cosmosSdkOrigins }
	)
}

export const getProposalVote = ({
	restBaseUrl,
	proposalId,
	voter,
}: {
	restBaseUrl: string
	proposalId: string
	voter: string
}) => (
	getJson<CosmosSdkVoteResponse>(
		`${base(restBaseUrl)}/cosmos/gov/v1/proposals/${encodeURIComponent(proposalId)}/votes/${encodeURIComponent(voter)}`,
		{ origins: cosmosSdkOrigins }
	)
)

export const getProposalDeposits = ({
	restBaseUrl,
	proposalId,
	limit = 24,
	paginationKey,
}: {
	restBaseUrl: string
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
		`${base(restBaseUrl)}/cosmos/gov/v1/proposals/${encodeURIComponent(proposalId)}/deposits?${parameters}`,
		{ origins: cosmosSdkOrigins }
	)
}

export const getProposalDeposit = ({
	restBaseUrl,
	proposalId,
	depositor,
}: {
	restBaseUrl: string
	proposalId: string
	depositor: string
}) => (
	getJson<CosmosSdkDepositResponse>(
		`${base(restBaseUrl)}/cosmos/gov/v1/proposals/${encodeURIComponent(proposalId)}/deposits/${encodeURIComponent(depositor)}`,
		{ origins: cosmosSdkOrigins }
	)
)

export const getProposalTally = ({
	restBaseUrl,
	proposalId,
}: {
	restBaseUrl: string
	proposalId: string
}) => (
	getJson<CosmosSdkTallyResponse>(
		`${base(restBaseUrl)}/cosmos/gov/v1/proposals/${encodeURIComponent(proposalId)}/tally`,
		{ origins: cosmosSdkOrigins }
	)
)

export const getDenomMetadata = async ({
	restBaseUrl,
	denom,
	blockHeight,
}: {
	restBaseUrl: string
	denom: string
	blockHeight?: bigint
}) => {
	if (denom.length === 0)
		throw new Error('CosmosSdk_Rest: denom metadata subject is empty')
	if (blockHeight != null && blockHeight < 1n)
		throw new Error('CosmosSdk_Rest: denom metadata block height must be positive')

	const response = cosmosSdkDenomMetadataWire.assert(await getJson<JsonValue>(
		`${base(restBaseUrl)}/cosmos/bank/v1beta1/denoms_metadata/${encodeURIComponent(denom)}`,
		{
			origins: cosmosSdkOrigins,
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
	restBaseUrl,
	moduleName,
}: {
	restBaseUrl: string
	moduleName: string
}) => (
	getJson<CosmosSdkModuleAccountResponse>(
		`${base(restBaseUrl)}/cosmos/auth/v1beta1/module_accounts/${moduleName}`,
		{ origins: cosmosSdkOrigins }
	)
)

export const getBalances = async ({
	restBaseUrl,
	network,
	address,
	blockHeight,
	limit = 100,
	continuationToken,
}: {
	restBaseUrl: string
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

	const normalizedRestBaseUrl = base(restBaseUrl)
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
			origins: cosmosSdkOrigins,
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
	restBaseUrl,
	delegatorAddress,
	limit = 100,
	paginationKey,
}: {
	restBaseUrl: string
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
		`${base(restBaseUrl)}/cosmos/staking/v1beta1/delegations/${encodeURIComponent(delegatorAddress)}?${parameters}`,
		{ origins: cosmosSdkOrigins }
	)
}

export const getDelegationRewards = ({
	restBaseUrl,
	delegatorAddress,
}: {
	restBaseUrl: string
	delegatorAddress: string
}) => (
	getJson<CosmosSdkDelegationRewardsResponse>(
		`${base(restBaseUrl)}/cosmos/distribution/v1beta1/delegators/${encodeURIComponent(delegatorAddress)}/rewards`,
		{ origins: cosmosSdkOrigins }
	)
)

export const getContractInfo = ({
	restBaseUrl,
	address,
}: {
	restBaseUrl: string
	address: string
}) => (
	getJson<CosmosSdkContractInfoResponse>(
		`${base(restBaseUrl)}/cosmwasm/wasm/v1/contract/${address}`,
		{ origins: cosmosSdkOrigins }
	)
)
