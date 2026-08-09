import { fetchFailedMessage } from '$/lib/http.ts'
import { TransportType } from '$/constants/TransportType.ts'
import { Source } from '$/sources/Source.ts'
import {
	firstHttpUrlForBinding,
	sourceFetch,
	sourceGetJson,
} from '$/sources/_runtime/http.ts'
import {
	sourceBindingId,
	type SourceBinding,
	type SourceEndpoint,
} from '$/sources/SourceBinding.ts'
import type {
	CosmosSdkAccountsResponse,
	CosmosSdkAccountResponse,
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

type CosmosSdkRestBinding = SourceBinding<Source.CosmosSdk_Rest> & {
	readonly endpoints: readonly SourceEndpoint[]
}

const base = (binding: CosmosSdkRestBinding) => (
	firstHttpUrlForBinding(binding).replace(/\/$/, '')
)

export const cosmosSdkRestEndpoints = (binding: CosmosSdkRestBinding) => binding.endpoints.map(({ locator: url }) => ({
	url,
	transportType: TransportType.Http,
	providerName: 'Cosmos Directory',
}))

const getJsonAtBlockHeight = <_Json>(
	binding: CosmosSdkRestBinding,
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
	binding,
	height,
}: {
	binding: CosmosSdkRestBinding
	height: bigint
}) => (
	sourceGetJson<CosmosSdkBlockResponse>(
		binding,
		`${base(binding)}/cosmos/base/tendermint/v1beta1/blocks/${height.toString()}`
	)
)

export const getLatestBlock = (binding: CosmosSdkRestBinding) => (
	sourceGetJson<CosmosSdkBlockResponse>(
		binding,
		`${base(binding)}/cosmos/base/tendermint/v1beta1/blocks/latest`
	)
)

export const getNodeInfo = (binding: CosmosSdkRestBinding) => (
	sourceGetJson<CosmosSdkNodeInfoResponse>(
		binding,
		`${base(binding)}/cosmos/base/tendermint/v1beta1/node_info`
	)
)

export const getSyncing = (binding: CosmosSdkRestBinding) => (
	sourceGetJson<CosmosSdkSyncingResponse>(
		binding,
		`${base(binding)}/cosmos/base/tendermint/v1beta1/syncing`
	)
)

export const getTx = ({
	binding,
	txHash,
}: {
	binding: CosmosSdkRestBinding
	txHash: string
}) => (
	sourceGetJson<CosmosSdkTxResponse>(
		binding,
		`${base(binding)}/cosmos/tx/v1beta1/txs/${encodeURIComponent(txHash)}`
	)
)

export const getTransactionsByEvent = ({
	binding,
	event,
	page = 1,
	limit = 24,
}: {
	binding: CosmosSdkRestBinding
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
		`${base(binding)}/cosmos/tx/v1beta1/txs?${parameters}`
	)
}

export const getValidators = ({
	binding,
	limit = 24,
	status,
}: {
	binding: CosmosSdkRestBinding
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
		`${base(binding)}/cosmos/staking/v1beta1/validators?${parameters}`
	)
}

export const getStakingPool = (binding: CosmosSdkRestBinding) => (
	sourceGetJson<CosmosSdkStakingPoolResponse>(
		binding,
		`${base(binding)}/cosmos/staking/v1beta1/pool`
	)
)

export const getValidator = ({
	binding,
	operatorAddress,
}: {
	binding: CosmosSdkRestBinding
	operatorAddress: string
}) => (
	sourceGetJson<CosmosSdkValidatorResponse>(
		binding,
		`${base(binding)}/cosmos/staking/v1beta1/validators/${operatorAddress}`
	)
)

export const getAccount = ({
	binding,
	address,
}: {
	binding: CosmosSdkRestBinding
	address: string
}) => (
	sourceGetJson<CosmosSdkAccountResponse>(
		binding,
		`${base(binding)}/cosmos/auth/v1beta1/accounts/${encodeURIComponent(address)}`
	)
)

export const getAccounts = ({
	binding,
	limit = 24,
}: {
	binding: CosmosSdkRestBinding
	limit?: number
}) => {
	const parameters = new URLSearchParams({
		'pagination.limit': String(limit),
		'pagination.count_total': 'true',
	})

	return sourceGetJson<CosmosSdkAccountsResponse>(
		binding,
		`${base(binding)}/cosmos/auth/v1beta1/accounts?${parameters}`
	)
}

export const getProposal = ({
	binding,
	proposalId,
}: {
	binding: CosmosSdkRestBinding
	proposalId: string
}) => (
	sourceGetJson<CosmosSdkProposalResponse>(
		binding,
		`${base(binding)}/cosmos/gov/v1/proposals/${encodeURIComponent(proposalId)}`
	)
)

export const getProposals = ({
	binding,
	limit = 12,
	paginationKey,
}: {
	binding: CosmosSdkRestBinding
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
		`${base(binding)}/cosmos/gov/v1/proposals?${parameters}`
	)
}

export const getProposalVotes = ({
	binding,
	proposalId,
	limit = 24,
	paginationKey,
}: {
	binding: CosmosSdkRestBinding
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
		`${base(binding)}/cosmos/gov/v1/proposals/${encodeURIComponent(proposalId)}/votes?${parameters}`
	)
}

export const getProposalVote = ({
	binding,
	proposalId,
	voter,
}: {
	binding: CosmosSdkRestBinding
	proposalId: string
	voter: string
}) => (
	sourceGetJson<CosmosSdkVoteResponse>(
		binding,
		`${base(binding)}/cosmos/gov/v1/proposals/${encodeURIComponent(proposalId)}/votes/${encodeURIComponent(voter)}`
	)
)

export const getProposalDeposits = ({
	binding,
	proposalId,
	limit = 24,
	paginationKey,
}: {
	binding: CosmosSdkRestBinding
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
		`${base(binding)}/cosmos/gov/v1/proposals/${encodeURIComponent(proposalId)}/deposits?${parameters}`
	)
}

export const getProposalDeposit = ({
	binding,
	proposalId,
	depositor,
}: {
	binding: CosmosSdkRestBinding
	proposalId: string
	depositor: string
}) => (
	sourceGetJson<CosmosSdkDepositResponse>(
		binding,
		`${base(binding)}/cosmos/gov/v1/proposals/${encodeURIComponent(proposalId)}/deposits/${encodeURIComponent(depositor)}`
	)
)

export const getProposalTally = ({
	binding,
	proposalId,
}: {
	binding: CosmosSdkRestBinding
	proposalId: string
}) => (
	sourceGetJson<CosmosSdkTallyResponse>(
		binding,
		`${base(binding)}/cosmos/gov/v1/proposals/${encodeURIComponent(proposalId)}/tally`
	)
)

export const getDenomMetadata = async ({
	binding,
	denom,
	blockHeight,
}: {
	binding: CosmosSdkRestBinding
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
				`${base(binding)}/cosmos/bank/v1beta1/denoms_metadata/${encodeURIComponent(denom)}`
			)
		:
			getJsonAtBlockHeight<JsonValue>(
				binding,
				`${base(binding)}/cosmos/bank/v1beta1/denoms_metadata/${encodeURIComponent(denom)}`,
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
	binding,
	moduleName,
}: {
	binding: CosmosSdkRestBinding
	moduleName: string
}) => (
	sourceGetJson<CosmosSdkModuleAccountResponse>(
		binding,
		`${base(binding)}/cosmos/auth/v1beta1/module_accounts/${moduleName}`
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
	binding: CosmosSdkRestBinding
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
			|| continuation.get('binding') !== sourceBindingId(binding)
			|| continuation.get('network') !== network
			|| continuation.get('address') !== address
			|| continuation.get('height') !== blockHeight.toString()
			|| continuation.get('key') == null
			|| continuation.get('key') === ''
			|| continuation.getAll('v').length !== 1
			|| continuation.getAll('binding').length !== 1
			|| continuation.getAll('network').length !== 1
			|| continuation.getAll('address').length !== 1
			|| continuation.getAll('height').length !== 1
			|| continuation.getAll('key').length !== 1
			|| [...continuation.keys()].some((key) => (
				key !== 'v'
					&& key !== 'binding'
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
		binding,
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
				binding: sourceBindingId(binding),
				network,
				address,
				height: blockHeight.toString(),
				key: response.pagination.next_key,
			}).toString(),
		}),
	}
}

export const getDelegations = ({
	binding,
	delegatorAddress,
	limit = 100,
	paginationKey,
}: {
	binding: CosmosSdkRestBinding
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
		`${base(binding)}/cosmos/staking/v1beta1/delegations/${encodeURIComponent(delegatorAddress)}?${parameters}`
	)
}

export const getDelegationRewards = ({
	binding,
	delegatorAddress,
}: {
	binding: CosmosSdkRestBinding
	delegatorAddress: string
}) => (
	sourceGetJson<CosmosSdkDelegationRewardsResponse>(
		binding,
		`${base(binding)}/cosmos/distribution/v1beta1/delegators/${encodeURIComponent(delegatorAddress)}/rewards`
	)
)

export const getContractInfo = ({
	binding,
	address,
}: {
	binding: CosmosSdkRestBinding
	address: string
}) => (
	sourceGetJson<CosmosSdkContractInfoResponse>(
		binding,
		`${base(binding)}/cosmwasm/wasm/v1/contract/${address}`
	)
)

const cosmosSdkIbcPagination = {
	'next_key?': 'string | null',
	'total?': '/^(0|[1-9][0-9]*)$/',
} as const

const cosmosSdkIbcChannelWire = arktype({
	state: 'string > 0',
	ordering: 'string > 0',
	counterparty: {
		port_id: 'string > 0',
		channel_id: 'string',
	},
	connection_hops: arktype('string > 0').array(),
	version: 'string',
	'port_id?': 'string > 0',
	'channel_id?': 'string > 0',
})

const cosmosSdkIbcChannelResponseWire = arktype({
	channel: cosmosSdkIbcChannelWire,
})

const cosmosSdkIbcChannelsResponseWire = arktype({
	channels: cosmosSdkIbcChannelWire.array(),
	'pagination?': cosmosSdkIbcPagination,
})

const cosmosSdkIbcConnectionWire = arktype({
	client_id: 'string > 0',
	state: 'string > 0',
	counterparty: {
		client_id: 'string > 0',
		connection_id: 'string',
	},
	delay_period: '/^(0|[1-9][0-9]*)$/',
})

const cosmosSdkIbcConnectionResponseWire = arktype({
	connection: cosmosSdkIbcConnectionWire,
})

const cosmosSdkIbcConnectionsResponseWire = arktype({
	connections: arktype({
		id: 'string > 0',
		client_id: 'string > 0',
		state: 'string > 0',
		counterparty: {
			client_id: 'string > 0',
			connection_id: 'string',
		},
		delay_period: '/^(0|[1-9][0-9]*)$/',
	}).array(),
	'pagination?': cosmosSdkIbcPagination,
})

const cosmosSdkIbcHeightWire = arktype({
	revision_number: '/^(0|[1-9][0-9]*)$/',
	revision_height: '/^(0|[1-9][0-9]*)$/',
})

const cosmosSdkIbcClientStateBody = arktype({
	'@type': 'string > 0',
	chain_id: 'string > 0',
	trust_level: {
		numerator: '/^(0|[1-9][0-9]*)$/',
		denominator: '/^[1-9][0-9]*$/',
	},
	trusting_period: 'string > 0',
	unbonding_period: 'string > 0',
	max_clock_drift: 'string > 0',
	frozen_height: cosmosSdkIbcHeightWire,
	latest_height: cosmosSdkIbcHeightWire,
	'proof_specs?': 'unknown[]',
	'upgrade_path?': 'string[]',
	'allow_update_after_expiry?': 'boolean',
	'allow_update_after_misbehaviour?': 'boolean',
})

const cosmosSdkIbcClientStateResponseWire = arktype({
	client_state: cosmosSdkIbcClientStateBody,
})

const cosmosSdkIbcClientStatesResponseWire = arktype({
	client_states: arktype({
		client_id: 'string > 0',
		client_state: cosmosSdkIbcClientStateBody,
	}).array(),
	'pagination?': cosmosSdkIbcPagination,
})

const cosmosSdkIbcDenomTraceResponseWire = arktype({
	denom_trace: {
		path: 'string > 0',
		base_denom: 'string > 0',
	},
})

const cosmosSdkIbcNextSequenceSendResponseWire = arktype({
	next_sequence_send: '/^(0|[1-9][0-9]*)$/',
})

const cosmosSdkIbcNextSequenceReceiveResponseWire = arktype({
	next_sequence_receive: '/^(0|[1-9][0-9]*)$/',
})

const assertIbcIdentity = (
	value: string,
	name: string
) => {
	if (value.length === 0 || value.includes('/') || value.includes('\\'))
		throw new Error(`CosmosSdk_Rest: invalid ${name}`)
}

export const getIbcChannel = ({
	binding,
	portId,
	channelId,
}: {
	binding: CosmosSdkRestBinding
	portId: string
	channelId: string
}) => {
	assertIbcIdentity(portId, 'port id')
	assertIbcIdentity(channelId, 'channel id')
	return sourceGetJson(
		binding,
		`${base(binding)}/ibc/core/channel/v1/channels/${encodeURIComponent(channelId)}/ports/${encodeURIComponent(portId)}`
	).then((response) => (
		cosmosSdkIbcChannelResponseWire.assert(response)
	))
}

export const getIbcChannels = ({
	binding,
	limit = 24,
	paginationKey,
}: {
	binding: CosmosSdkRestBinding
	limit?: number
	paginationKey?: string
}) => {
	if (!Number.isSafeInteger(limit) || limit < 1 || limit > 100)
		throw new Error(`CosmosSdk_Rest: invalid IBC channel page limit ${limit}`)

	const parameters = new URLSearchParams({
		'pagination.limit': String(limit),
		'pagination.count_total': 'true',
		...(paginationKey != null && { 'pagination.key': paginationKey }),
	})

	return sourceGetJson(
		binding,
		`${base(binding)}/ibc/core/channel/v1/channels?${parameters}`
	).then((response) => (
		cosmosSdkIbcChannelsResponseWire.assert(response)
	))
}

export const getIbcConnectionChannels = ({
	binding,
	connectionId,
	limit = 24,
	paginationKey,
}: {
	binding: CosmosSdkRestBinding
	connectionId: string
	limit?: number
	paginationKey?: string
}) => {
	assertIbcIdentity(connectionId, 'connection id')
	if (!Number.isSafeInteger(limit) || limit < 1 || limit > 100)
		throw new Error(`CosmosSdk_Rest: invalid IBC connection channel page limit ${limit}`)

	const parameters = new URLSearchParams({
		'pagination.limit': String(limit),
		'pagination.count_total': 'true',
		...(paginationKey != null && { 'pagination.key': paginationKey }),
	})

	return sourceGetJson(
		binding,
		`${base(binding)}/ibc/core/channel/v1/connections/${encodeURIComponent(connectionId)}/channels?${parameters}`
	).then((response) => (
		cosmosSdkIbcChannelsResponseWire.assert(response)
	))
}

export const getIbcConnection = ({
	binding,
	connectionId,
}: {
	binding: CosmosSdkRestBinding
	connectionId: string
}) => {
	assertIbcIdentity(connectionId, 'connection id')
	return sourceGetJson(
		binding,
		`${base(binding)}/ibc/core/connection/v1/connections/${encodeURIComponent(connectionId)}`
	).then((response) => (
		cosmosSdkIbcConnectionResponseWire.assert(response)
	))
}

export const getIbcConnections = ({
	binding,
	limit = 24,
	paginationKey,
}: {
	binding: CosmosSdkRestBinding
	limit?: number
	paginationKey?: string
}) => {
	if (!Number.isSafeInteger(limit) || limit < 1 || limit > 100)
		throw new Error(`CosmosSdk_Rest: invalid IBC connection page limit ${limit}`)

	const parameters = new URLSearchParams({
		'pagination.limit': String(limit),
		'pagination.count_total': 'true',
		...(paginationKey != null && { 'pagination.key': paginationKey }),
	})

	return sourceGetJson(
		binding,
		`${base(binding)}/ibc/core/connection/v1/connections?${parameters}`
	).then((response) => (
		cosmosSdkIbcConnectionsResponseWire.assert(response)
	))
}

export const getIbcClientState = ({
	binding,
	clientId,
}: {
	binding: CosmosSdkRestBinding
	clientId: string
}) => {
	assertIbcIdentity(clientId, 'client id')
	return sourceGetJson(
		binding,
		`${base(binding)}/ibc/core/client/v1/client_states/${encodeURIComponent(clientId)}`
	).then((response) => (
		cosmosSdkIbcClientStateResponseWire.assert(response)
	))
}

const cosmosSdkIbcClientConnectionsResponseWire = arktype({
	connection_paths: arktype('string > 0').array(),
})

export const getIbcClientConnections = ({
	binding,
	clientId,
}: {
	binding: CosmosSdkRestBinding
	clientId: string
}) => {
	assertIbcIdentity(clientId, 'client id')
	return sourceGetJson(
		binding,
		`${base(binding)}/ibc/core/connection/v1/client_connections/${encodeURIComponent(clientId)}`
	).then((response) => (
		cosmosSdkIbcClientConnectionsResponseWire.assert(response)
	))
}

export const getIbcClientStates = ({
	binding,
	limit = 24,
	paginationKey,
}: {
	binding: CosmosSdkRestBinding
	limit?: number
	paginationKey?: string
}) => {
	if (!Number.isSafeInteger(limit) || limit < 1 || limit > 100)
		throw new Error(`CosmosSdk_Rest: invalid IBC client page limit ${limit}`)

	const parameters = new URLSearchParams({
		'pagination.limit': String(limit),
		'pagination.count_total': 'true',
		...(paginationKey != null && { 'pagination.key': paginationKey }),
	})

	return sourceGetJson(
		binding,
		`${base(binding)}/ibc/core/client/v1/client_states?${parameters}`
	).then((response) => (
		cosmosSdkIbcClientStatesResponseWire.assert(response)
	))
}

export const getIbcDenomTrace = ({
	binding,
	hash,
}: {
	binding: CosmosSdkRestBinding
	hash: string
}) => {
	const normalized = (
		hash.startsWith('ibc/') ?
			hash.slice('ibc/'.length)
		: hash.startsWith('hash:') ?
			hash.slice('hash:'.length)
		:
			hash
	)
	if (!/^[0-9A-Fa-f]{64}$/.test(normalized))
		throw new Error(`CosmosSdk_Rest: invalid denom hash ${hash}`)

	return sourceGetJson(
		binding,
		`${base(binding)}/ibc/apps/transfer/v1/denom_traces/${normalized}`
	).then((response) => (
		cosmosSdkIbcDenomTraceResponseWire.assert(response)
	))
}

export const getIbcNextSequenceSend = ({
	binding,
	portId,
	channelId,
}: {
	binding: CosmosSdkRestBinding
	portId: string
	channelId: string
}) => {
	assertIbcIdentity(portId, 'port id')
	assertIbcIdentity(channelId, 'channel id')
	return sourceGetJson(
		binding,
		`${base(binding)}/ibc/core/channel/v1/channels/${encodeURIComponent(channelId)}/ports/${encodeURIComponent(portId)}/next_sequence_send`
	).then((response) => (
		cosmosSdkIbcNextSequenceSendResponseWire.assert(response)
	))
}

export const getIbcNextSequenceReceive = ({
	binding,
	portId,
	channelId,
}: {
	binding: CosmosSdkRestBinding
	portId: string
	channelId: string
}) => {
	assertIbcIdentity(portId, 'port id')
	assertIbcIdentity(channelId, 'channel id')
	return sourceGetJson(
		binding,
		`${base(binding)}/ibc/core/channel/v1/channels/${encodeURIComponent(channelId)}/ports/${encodeURIComponent(portId)}/next_sequence`
	).then((response) => (
		cosmosSdkIbcNextSequenceReceiveResponseWire.assert(response)
	))
}
