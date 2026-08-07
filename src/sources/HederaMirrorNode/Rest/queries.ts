import bindings from '$/sources/HederaMirrorNode/bindings.ts'
import {
	firstHttpUrlForBinding,
	sourceFetch,
	sourceGetText,
} from '$/sources/_runtime/http.ts'
import type {
	HederaMirrorNodeAccount,
	HederaMirrorNodeAccounts,
	HederaMirrorNodeAccountTokens,
	HederaMirrorNodeBlock,
	HederaMirrorNodeBlocks,
	HederaMirrorNodeContractResult,
	HederaMirrorNodeCryptoAllowances,
	HederaMirrorNodeNetworkExchangeRate,
	HederaMirrorNodeNetworkFees,
	HederaMirrorNodeNetworkStake,
	HederaMirrorNodeNetworkSupply,
	HederaMirrorNodeNftAllowances,
	HederaMirrorNodeNfts,
	HederaMirrorNodeNodes,
	HederaMirrorNodeSchedule,
	HederaMirrorNodeTokenAllowances,
	HederaMirrorNodeTransactionResponse,
	HederaMirrorNodeTransactions,
} from '$/sources/HederaMirrorNode/Rest/types.ts'
import { Source } from '$/sources/Source.ts'

const binding = bindings[Source.HederaMirrorNode_Rest][0]

const accountIdPattern = /^\d{1,10}\.\d{1,10}\.\d{1,10}$/
const bigintWireKeys = new Set([
	'amount',
	'amount_granted',
	'balance',
	'charged_tx_fee',
	'max_fee',
	'max_stake',
	'max_stake_rewarded',
	'max_total_reward',
	'min_stake',
	'node_id',
	'pending_reward',
	'released_supply',
	'reserved_staking_rewards',
	'reward_balance_threshold',
	'reward_rate_start',
	'serial_number',
	'stake',
	'stake_not_rewarded',
	'stake_rewarded',
	'stake_total',
	'staking_reward_start_threshold',
	'total_supply',
	'unreserved_staking_reward_balance',
	'valid_duration_seconds',
])

const decimalIntegerFromJsonNumberSource = (source: string) => {
	const match = /^(-?)(\d+)(?:\.(\d*))?(?:[eE]([+-]?\d+))?$/.exec(source)
	if (match == null)
		return undefined

	const exponent = Number(match.at(4) ?? 0)
	if (!Number.isSafeInteger(exponent) || Math.abs(exponent) > 1_000)
		return undefined

	const fraction = match.at(3) ?? ''
	const digits = `${match[2]}${fraction}`
	const scale = exponent - fraction.length
	const integerDigits = scale >= 0 ?
		`${digits}${'0'.repeat(scale)}`
	:
		digits.slice(0, digits.length + scale)
	if (scale < 0 && digits.slice(digits.length + scale).replaceAll('0', '') !== '')
		return undefined

	const normalizedDigits = integerDigits.replace(/^0+(?=\d)/, '') || '0'
	return match[1] === '-' && normalizedDigits !== '0' ?
		`-${normalizedDigits}`
	:
		normalizedDigits
}

const sourceGetHederaJson = <_Response>(
	url: string
) => sourceGetText(binding, url).then((text) => JSON.parse(
	text,
	(key, value, context) => ((integer) => (
		key === 'associated_registered_nodes' ?
			value.map(String)
		: bigintWireKeys.has(key) && integer != null ?
			integer
		: integer != null && !Number.isSafeInteger(value) ?
			integer
		:
			value
	))(decimalIntegerFromJsonNumberSource(context.source))
) as _Response)

const paginatedUrl = (
	pathname: string,
	continuationToken?: string
) => {
	const baseUrl = new URL(firstHttpUrlForBinding(binding))
	const url = continuationToken == null ?
		new URL(pathname, baseUrl)
	:
		new URL(continuationToken, baseUrl)
	if (
		url.origin !== baseUrl.origin
		|| url.pathname !== pathname
		|| url.username !== ''
		|| url.password !== ''
		|| url.hash !== ''
	)
		throw new Error('HederaMirrorNode_Rest: invalid continuation')

	return url
}

const accountCollectionUrl = (
	accountId: string,
	pathname: string,
	limit: number,
	order: 'asc' | 'desc',
	continuationKeys: readonly string[],
	allowEmptyContinuation: boolean,
	continuationToken?: string
) => {
	if (!accountIdPattern.test(accountId))
		throw new Error('HederaMirrorNode_Rest: invalid account selector')
	if (!Number.isSafeInteger(limit) || limit < 1 || limit > 100)
		throw new Error('HederaMirrorNode_Rest: invalid account collection limit')

	const url = paginatedUrl(pathname, continuationToken)
	if (
		continuationToken == null
		|| (allowEmptyContinuation && url.search === '')
	) {
		url.searchParams.set('limit', String(limit))
		url.searchParams.set('order', order)
	} else if (
		url.searchParams.getAll('limit').length !== 1
		|| url.searchParams.get('limit') !== String(limit)
		|| url.searchParams.getAll('order').length !== 1
		|| url.searchParams.get('order') !== order
		|| !continuationKeys.some((key) => url.searchParams.has(key))
		|| continuationKeys.some((key) => url.searchParams.getAll(key).length > 1)
		|| continuationKeys.some((key) => url.searchParams.getAll(key).some((value) => (
			key === 'serialnumber' ?
				!/^(?:(?:eq|gt|gte|lt|lte):)?\d{1,19}$/.test(value)
			:
				!/^(?:(?:eq|gt|gte|lt|lte|ne):)?(?:\d{1,10}\.\d{1,10}\.)?\d{1,10}$/.test(value)
		)))
		|| (
			url.searchParams.has('owner')
			&& (
				url.searchParams.getAll('owner').length !== 1
				|| url.searchParams.get('owner') !== 'true'
			)
		)
		|| [...url.searchParams.keys()].some((key) => ![
			...continuationKeys,
			'limit',
			'order',
			'owner',
		].includes(key))
	)
		throw new Error('HederaMirrorNode_Rest: invalid account collection continuation')

	return url
}

export const getAccount = (
	accountId: string
) => {
	if (!accountIdPattern.test(accountId))
		throw new Error('HederaMirrorNode_Rest: invalid account selector')

	const url = new URL(
		`/api/v1/accounts/${encodeURIComponent(accountId)}`,
		firstHttpUrlForBinding(binding)
	)
	url.searchParams.set('transactions', 'false')

	return sourceGetHederaJson<HederaMirrorNodeAccount>(url.toString())
}

export const getAccounts = (
	limit: number,
	continuationToken?: string
) => {
	if (!Number.isSafeInteger(limit) || limit < 1 || limit > 100)
		throw new Error('HederaMirrorNode_Rest: invalid account list limit')

	const url = paginatedUrl('/api/v1/accounts', continuationToken)
	if (continuationToken == null) {
		url.searchParams.set('limit', String(limit))
		url.searchParams.set('order', 'desc')
	} else if (
		url.searchParams.getAll('limit').length !== 1
		|| url.searchParams.get('limit') !== String(limit)
		|| url.searchParams.getAll('order').length !== 1
		|| url.searchParams.get('order') !== 'desc'
		|| url.searchParams.getAll('account.id').length !== 1
		|| !/^(?:(?:eq|gt|gte|lt|lte|ne):)?(?:\d{1,10}\.\d{1,10}\.)?\d{1,10}$/.test(url.searchParams.get('account.id') ?? '')
		|| [...url.searchParams.keys()].some((key) => ![
			'account.id',
			'limit',
			'order',
		].includes(key))
	)
		throw new Error('HederaMirrorNode_Rest: invalid account list continuation')

	return sourceGetHederaJson<HederaMirrorNodeAccounts>(url.toString())
}

export const getTransactionByIdNonce = (
	transactionId: string,
	nonce: number,
	scheduled?: boolean
) => {
	if (!/^\d{1,10}\.\d{1,10}\.\d{1,10}-\d{1,10}-\d{1,9}$/.test(transactionId))
		throw new Error('HederaMirrorNode_Rest: invalid transaction ID')
	if (!Number.isSafeInteger(nonce) || nonce < 0)
		throw new Error('HederaMirrorNode_Rest: invalid transaction nonce')

	const url = new URL(
		`/api/v1/transactions/${encodeURIComponent(transactionId)}`,
		firstHttpUrlForBinding(binding)
	)
	url.searchParams.set('nonce', nonce.toString())
	if (scheduled != null)
		url.searchParams.set('scheduled', scheduled ? 'true' : 'false')

	return sourceGetHederaJson<HederaMirrorNodeTransactionResponse>(url.toString())
}

export const getTransactions = (
	query:
		| {
			accountId: string
			consensusTimestamp?: never
			continuationToken?: string
			limit: number
		}
		| {
			accountId?: never
			consensusTimestamp: string
			continuationToken?: never
			limit?: never
		}
		| {
			accountId?: never
			consensusTimestamp?: never
			continuationToken?: string
			limit: number
		}
) => {
	if (
		query.consensusTimestamp != null
		&& !/^\d{1,10}(?:\.\d{1,9})?$/.test(query.consensusTimestamp)
	)
		throw new Error('HederaMirrorNode_Rest: invalid transaction consensus timestamp')
	if (query.accountId != null && !accountIdPattern.test(query.accountId))
		throw new Error('HederaMirrorNode_Rest: invalid account selector')
	if (
		query.limit != null
		&& (!Number.isSafeInteger(query.limit) || query.limit < 1 || query.limit > 100)
	)
		throw new Error('HederaMirrorNode_Rest: invalid transaction list limit')

	const url = paginatedUrl('/api/v1/transactions', query.continuationToken)
	if (query.consensusTimestamp != null) {
		url.searchParams.set('limit', '2')
		url.searchParams.set('order', 'desc')
		url.searchParams.set('timestamp', `eq:${query.consensusTimestamp}`)
	} else if (query.continuationToken == null) {
		if (query.accountId != null)
			url.searchParams.set('account.id', query.accountId)

		url.searchParams.set('limit', String(query.limit))
		url.searchParams.set('order', 'desc')
	} else if (
		query.accountId != null
		&& url.searchParams.get('account.id') !== query.accountId
	)
		throw new Error('HederaMirrorNode_Rest: continuation account does not match request')
	else if (
		url.searchParams.getAll('account.id').length !== (query.accountId == null ? 0 : 1)
		|| url.searchParams.getAll('limit').length !== 1
		|| url.searchParams.get('limit') !== String(query.limit)
		|| url.searchParams.getAll('order').length !== 1
		|| url.searchParams.get('order') !== 'desc'
		|| url.searchParams.getAll('timestamp').length === 0
		|| url.searchParams.getAll('timestamp').some((timestamp) => (
			!/^(?:(?:eq|gt|gte|lt|lte|ne):)?\d{1,10}(?:\.\d{1,9})?$/.test(timestamp)
		))
		|| [...url.searchParams.keys()].some((key) => ![
			...(query.accountId == null ? [] : ['account.id']),
			'limit',
			'order',
			'timestamp',
		].includes(key))
	)
		throw new Error(
			`HederaMirrorNode_Rest: invalid ${query.accountId == null ? 'global' : 'account'} transaction continuation`
		)

	return sourceGetHederaJson<HederaMirrorNodeTransactions>(url.toString())
}

export const getNodes = (
	limit: number,
	continuationToken?: string
) => {
	if (!Number.isSafeInteger(limit) || limit < 1 || limit > 100)
		throw new Error('HederaMirrorNode_Rest: invalid node list limit')

	const url = paginatedUrl('/api/v1/network/nodes', continuationToken)
	if (continuationToken == null) {
		url.searchParams.set('limit', String(limit))
		url.searchParams.set('order', 'asc')
	} else if (
		url.searchParams.getAll('limit').length !== 1
		|| url.searchParams.get('limit') !== String(limit)
		|| url.searchParams.getAll('order').length !== 1
		|| url.searchParams.get('order') !== 'asc'
		|| url.searchParams.getAll('node.id').length !== 1
		|| !/^(?:(?:eq|gt|gte|lt|lte):)?\d{1,19}$/.test(url.searchParams.get('node.id') ?? '')
		|| [...url.searchParams.keys()].some((key) => ![
			'limit',
			'node.id',
			'order',
		].includes(key))
	)
		throw new Error('HederaMirrorNode_Rest: invalid node continuation')

	return sourceGetHederaJson<HederaMirrorNodeNodes>(url.toString())
}

export const getNode = (
	nodeId: number
) => {
	if (!Number.isSafeInteger(nodeId) || nodeId < 0)
		throw new Error('HederaMirrorNode_Rest: invalid node selector')

	const url = new URL('/api/v1/network/nodes', firstHttpUrlForBinding(binding))
	url.searchParams.set('limit', '1')
	url.searchParams.set('order', 'asc')
	url.searchParams.set('node.id', `eq:${String(nodeId)}`)

	return sourceGetHederaJson<HederaMirrorNodeNodes>(url.toString()).then((page) => {
		if (page.nodes.length !== 1)
			throw new Error('HederaMirrorNode_Rest: node not found')

		const node = page.nodes[0]
		if (node.node_id !== String(nodeId))
			throw new Error('HederaMirrorNode_Rest: response node does not match request')

		return node
	})
}

export const getNetworkSupply = () => (
	sourceGetHederaJson<HederaMirrorNodeNetworkSupply>(
		new URL(
			'/api/v1/network/supply',
			firstHttpUrlForBinding(binding)
		).toString()
	)
)

export const getNetworkStake = () => (
	sourceGetHederaJson<HederaMirrorNodeNetworkStake>(
		new URL(
			'/api/v1/network/stake',
			firstHttpUrlForBinding(binding)
		).toString()
	)
)

export const getNetworkExchangeRate = () => (
	sourceGetHederaJson<HederaMirrorNodeNetworkExchangeRate>(
		new URL(
			'/api/v1/network/exchangerate',
			firstHttpUrlForBinding(binding)
		).toString()
	)
)

export const getNetworkFees = () => (
	sourceGetHederaJson<HederaMirrorNodeNetworkFees>(
		new URL(
			'/api/v1/network/fees',
			firstHttpUrlForBinding(binding)
		).toString()
	)
)

export const getAccountAllowances = async (
	accountId: string,
	limit: number,
	continuationToken?: string
) => {
	const cryptoPathname = `/api/v1/accounts/${encodeURIComponent(accountId)}/allowances/crypto`
	const tokenPathname = `/api/v1/accounts/${encodeURIComponent(accountId)}/allowances/tokens`
	const nftPathname = `/api/v1/accounts/${encodeURIComponent(accountId)}/allowances/nfts`
	const continuationPathname = continuationToken == null ?
		cryptoPathname
	:
		new URL(
			continuationToken,
			firstHttpUrlForBinding(binding)
		).pathname

	if (continuationPathname === cryptoPathname)
		return {
			allowanceKind: 'crypto',
			page: await sourceGetHederaJson<HederaMirrorNodeCryptoAllowances>(
				accountCollectionUrl(
					accountId,
					cryptoPathname,
					limit,
					'asc',
					[
						'spender.id',
					],
					true,
					continuationToken
				).toString()
			),
		}
	if (continuationPathname === tokenPathname)
		return {
			allowanceKind: 'token',
			page: await sourceGetHederaJson<HederaMirrorNodeTokenAllowances>(
				accountCollectionUrl(
					accountId,
					tokenPathname,
					limit,
					'asc',
					[
						'spender.id',
						'token.id',
					],
					true,
					continuationToken
				).toString()
			),
		}
	if (continuationPathname === nftPathname) {
		const url = accountCollectionUrl(
			accountId,
			nftPathname,
			limit,
			'asc',
			[
				'account.id',
				'token.id',
			],
			true,
			continuationToken
		)
		url.searchParams.set('owner', 'true')

		return {
			allowanceKind: 'nft',
			page: await sourceGetHederaJson<HederaMirrorNodeNftAllowances>(
				url.toString()
			),
		}
	}

	throw new Error('HederaMirrorNode_Rest: invalid allowance continuation')
}

export const getAccountTokens = (
	accountId: string,
	limit: number,
	continuationToken?: string
) => sourceGetHederaJson<HederaMirrorNodeAccountTokens>(
	accountCollectionUrl(
		accountId,
		`/api/v1/accounts/${encodeURIComponent(accountId)}/tokens`,
		limit,
		'asc',
		[
			'token.id',
		],
		false,
		continuationToken
	).toString()
)

export const getAccountNfts = (
	accountId: string,
	limit: number,
	continuationToken?: string
) => sourceGetHederaJson<HederaMirrorNodeNfts>(
	accountCollectionUrl(
		accountId,
		`/api/v1/accounts/${encodeURIComponent(accountId)}/nfts`,
		limit,
		'desc',
		[
			'serialnumber',
			'spender.id',
			'token.id',
		],
		false,
		continuationToken
	).toString()
)

export const getBlocks = (
	limit: number
) => {
	if (!Number.isSafeInteger(limit) || limit < 1 || limit > 100)
		throw new Error('HederaMirrorNode_Rest: invalid block list limit')

	const url = new URL('/api/v1/blocks', firstHttpUrlForBinding(binding))
	url.searchParams.set('limit', String(limit))
	url.searchParams.set('order', 'desc')

	return sourceGetHederaJson<HederaMirrorNodeBlocks>(url.toString())
}

export const getBlock = (
	hashOrNumber: string
) => {
	if (!/^(?:\d{1,10}|(?:0x)?(?:[A-Fa-f0-9]{64}|[A-Fa-f0-9]{96}))$/.test(hashOrNumber))
		throw new Error('HederaMirrorNode_Rest: invalid block selector')

	return sourceGetHederaJson<HederaMirrorNodeBlock>(
		new URL(
			`/api/v1/blocks/${encodeURIComponent(hashOrNumber)}`,
			firstHttpUrlForBinding(binding)
		).toString()
	)
}

export const getBlockByConsensusTimestamp = (
	consensusTimestamp: string
) => {
	if (!/^\d{1,10}(?:\.\d{1,9})?$/.test(consensusTimestamp))
		throw new Error('HederaMirrorNode_Rest: invalid block consensus timestamp')

	const url = new URL('/api/v1/blocks', firstHttpUrlForBinding(binding))
	url.searchParams.set('limit', '1')
	url.searchParams.set('order', 'asc')
	url.searchParams.set('timestamp', `gte:${consensusTimestamp}`)

	return sourceGetHederaJson<HederaMirrorNodeBlocks>(url.toString()).then((page) => {
		if (page.blocks.length === 0)
			return undefined

		return page.blocks[0]
	})
}

export const getSchedule = (
	scheduleId: string
) => {
	if (!accountIdPattern.test(scheduleId))
		throw new Error('HederaMirrorNode_Rest: invalid schedule selector')

	return sourceGetHederaJson<HederaMirrorNodeSchedule>(
		new URL(
			`/api/v1/schedules/${encodeURIComponent(scheduleId)}`,
			firstHttpUrlForBinding(binding)
		).toString()
	)
}

export const getContractResultByTransactionIdNonce = async (
	transactionId: string,
	nonce: number
) => {
	if (!/^\d{1,10}\.\d{1,10}\.\d{1,10}-\d{1,10}-\d{1,9}$/.test(transactionId))
		throw new Error('HederaMirrorNode_Rest: invalid transaction ID')
	if (!Number.isSafeInteger(nonce) || nonce < 0)
		throw new Error('HederaMirrorNode_Rest: invalid transaction nonce')

	const url = new URL(
		`/api/v1/contracts/results/${encodeURIComponent(transactionId)}`,
		firstHttpUrlForBinding(binding)
	)
	url.searchParams.set('nonce', nonce.toString())

	const response = await sourceFetch(binding, url.toString())
	if (response.status === 404)
		return undefined
	if (!response.ok)
		throw new Error(`HederaMirrorNode_Rest: HTTP ${String(response.status)}`)

	const text = await response.text()
	return JSON.parse(
		text,
		(key, value, context) => ((integer) => (
			key === 'associated_registered_nodes' ?
				value.map(String)
			: bigintWireKeys.has(key) && integer != null ?
				integer
			: integer != null && !Number.isSafeInteger(value) ?
				integer
			:
				value
		))(decimalIntegerFromJsonNumberSource(context.source))
	) as HederaMirrorNodeContractResult
}
