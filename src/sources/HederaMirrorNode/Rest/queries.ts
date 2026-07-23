import type { SourceBinding } from '$/sources/SourceBinding.ts'
import {
	firstHttpUrlForBinding,
	sourceGetJson,
	sourceGetText,
} from '$/sources/_runtime/http.ts'
import type {
	HederaMirrorNodeAccount,
	HederaMirrorNodeAccounts,
	HederaMirrorNodeAccountTokens,
	HederaMirrorNodeBlock,
	HederaMirrorNodeBlocks,
	HederaMirrorNodeCryptoAllowances,
	HederaMirrorNodeNftAllowances,
	HederaMirrorNodeNfts,
	HederaMirrorNodeNodes,
	HederaMirrorNodeTokenAllowances,
	HederaMirrorNodeTransactionResponse,
	HederaMirrorNodeTransactions,
} from '$/sources/HederaMirrorNode/Rest/types.ts'

const accountIdPattern = /^\d{1,10}\.\d{1,10}\.\d{1,10}$/
const bigintWireKeys = new Set([
	'amount',
	'amount_granted',
	'balance',
	'charged_tx_fee',
	'max_fee',
	'max_stake',
	'min_stake',
	'node_id',
	'pending_reward',
	'reward_rate_start',
	'serial_number',
	'stake',
	'stake_not_rewarded',
	'stake_rewarded',
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
	binding: SourceBinding,
	url: string
): Promise<_Response> => sourceGetText(binding, url).then((text) => JSON.parse(
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
	binding: SourceBinding,
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
	binding: SourceBinding,
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

	const url = paginatedUrl(binding, pathname, continuationToken)
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
	binding: SourceBinding,
	accountId: string
): Promise<HederaMirrorNodeAccount> => {
	if (!accountIdPattern.test(accountId))
		throw new Error('HederaMirrorNode_Rest: invalid account selector')

	const url = new URL(
		`/api/v1/accounts/${encodeURIComponent(accountId)}`,
		firstHttpUrlForBinding(binding)
	)
	url.searchParams.set('transactions', 'false')

	return sourceGetHederaJson<HederaMirrorNodeAccount>(binding, url.toString())
}

export const getAccounts = (
	binding: SourceBinding,
	limit: number,
	continuationToken?: string
): Promise<HederaMirrorNodeAccounts> => {
	if (!Number.isSafeInteger(limit) || limit < 1 || limit > 100)
		throw new Error('HederaMirrorNode_Rest: invalid account list limit')

	const url = paginatedUrl(binding, '/api/v1/accounts', continuationToken)
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

	return sourceGetHederaJson<HederaMirrorNodeAccounts>(binding, url.toString())
}

export const getAccountTransactions = (
	binding: SourceBinding,
	accountId: string,
	limit: number,
	continuationToken?: string
): Promise<HederaMirrorNodeTransactions> => {
	if (!accountIdPattern.test(accountId))
		throw new Error('HederaMirrorNode_Rest: invalid account selector')
	if (!Number.isSafeInteger(limit) || limit < 1 || limit > 100)
		throw new Error('HederaMirrorNode_Rest: invalid transaction list limit')

	const url = paginatedUrl(binding, '/api/v1/transactions', continuationToken)
	if (continuationToken == null) {
		url.searchParams.set('account.id', accountId)
		url.searchParams.set('limit', String(limit))
		url.searchParams.set('order', 'desc')
	} else if (url.searchParams.get('account.id') !== accountId)
		throw new Error('HederaMirrorNode_Rest: continuation account does not match request')
	else if (
		url.searchParams.getAll('account.id').length !== 1
		|| url.searchParams.getAll('limit').length !== 1
		|| url.searchParams.get('limit') !== String(limit)
		|| url.searchParams.getAll('order').length !== 1
		|| url.searchParams.get('order') !== 'desc'
		|| url.searchParams.getAll('timestamp').length === 0
		|| url.searchParams.getAll('timestamp').some((timestamp) => (
			!/^(?:(?:eq|gt|gte|lt|lte|ne):)?\d{1,10}(?:\.\d{1,9})?$/.test(timestamp)
		))
		|| [...url.searchParams.keys()].some((key) => ![
			'account.id',
			'limit',
			'order',
			'timestamp',
		].includes(key))
	)
		throw new Error('HederaMirrorNode_Rest: invalid account transaction continuation')

	return sourceGetHederaJson<HederaMirrorNodeTransactions>(binding, url.toString())
}

export const getTransactionByConsensusTimestamp = (
	binding: SourceBinding,
	consensusTimestamp: string
): Promise<HederaMirrorNodeTransactions> => {
	if (!/^\d{1,10}(?:\.\d{1,9})?$/.test(consensusTimestamp))
		throw new Error('HederaMirrorNode_Rest: invalid transaction consensus timestamp')

	const url = new URL('/api/v1/transactions', firstHttpUrlForBinding(binding))
	url.searchParams.set('limit', '2')
	url.searchParams.set('order', 'desc')
	url.searchParams.set('timestamp', `eq:${consensusTimestamp}`)

	return sourceGetHederaJson<HederaMirrorNodeTransactions>(binding, url.toString())
}

export const getTransactionByIdNonce = (
	binding: SourceBinding,
	transactionId: string,
	nonce: number
): Promise<HederaMirrorNodeTransactionResponse> => {
	if (!/^\d{1,10}\.\d{1,10}\.\d{1,10}-\d{1,10}-\d{1,9}$/.test(transactionId))
		throw new Error('HederaMirrorNode_Rest: invalid transaction ID')
	if (!Number.isSafeInteger(nonce) || nonce < 0)
		throw new Error('HederaMirrorNode_Rest: invalid transaction nonce')

	const url = new URL(
		`/api/v1/transactions/${encodeURIComponent(transactionId)}`,
		firstHttpUrlForBinding(binding)
	)
	url.searchParams.set('nonce', nonce.toString())

	return sourceGetHederaJson<HederaMirrorNodeTransactionResponse>(binding, url.toString())
}

export const getTransactions = (
	binding: SourceBinding,
	limit: number,
	continuationToken?: string
): Promise<HederaMirrorNodeTransactions> => {
	if (!Number.isSafeInteger(limit) || limit < 1 || limit > 100)
		throw new Error('HederaMirrorNode_Rest: invalid transaction list limit')

	const url = paginatedUrl(binding, '/api/v1/transactions', continuationToken)
	if (continuationToken == null) {
		url.searchParams.set('limit', String(limit))
		url.searchParams.set('order', 'desc')
	} else if (
		url.searchParams.getAll('limit').length !== 1
		|| url.searchParams.get('limit') !== String(limit)
		|| url.searchParams.getAll('order').length !== 1
		|| url.searchParams.get('order') !== 'desc'
		|| url.searchParams.getAll('timestamp').length === 0
		|| url.searchParams.getAll('timestamp').some((timestamp) => (
			!/^(?:(?:eq|gt|gte|lt|lte|ne):)?\d{1,10}(?:\.\d{1,9})?$/.test(timestamp)
		))
		|| [...url.searchParams.keys()].some((key) => ![
			'limit',
			'order',
			'timestamp',
		].includes(key))
	)
		throw new Error('HederaMirrorNode_Rest: invalid global transaction continuation')

	return sourceGetHederaJson<HederaMirrorNodeTransactions>(binding, url.toString())
}

export const getNodes = (
	binding: SourceBinding,
	limit: number,
	continuationToken?: string
): Promise<HederaMirrorNodeNodes> => {
	if (!Number.isSafeInteger(limit) || limit < 1 || limit > 100)
		throw new Error('HederaMirrorNode_Rest: invalid node list limit')

	const url = paginatedUrl(binding, '/api/v1/network/nodes', continuationToken)
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

	return sourceGetHederaJson<HederaMirrorNodeNodes>(binding, url.toString())
}

export const getAccountAllowances = async (
	binding: SourceBinding,
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
			allowanceKind: 'crypto' as const,
			page: await sourceGetHederaJson<HederaMirrorNodeCryptoAllowances>(
				binding,
				accountCollectionUrl(
					binding,
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
			allowanceKind: 'token' as const,
			page: await sourceGetHederaJson<HederaMirrorNodeTokenAllowances>(
				binding,
				accountCollectionUrl(
					binding,
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
			binding,
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
			allowanceKind: 'nft' as const,
			page: await sourceGetHederaJson<HederaMirrorNodeNftAllowances>(
				binding,
				url.toString()
			),
		}
	}

	throw new Error('HederaMirrorNode_Rest: invalid allowance continuation')
}

export const getAccountTokens = (
	binding: SourceBinding,
	accountId: string,
	limit: number,
	continuationToken?: string
): Promise<HederaMirrorNodeAccountTokens> => sourceGetHederaJson<HederaMirrorNodeAccountTokens>(
	binding,
	accountCollectionUrl(
		binding,
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
	binding: SourceBinding,
	accountId: string,
	limit: number,
	continuationToken?: string
): Promise<HederaMirrorNodeNfts> => sourceGetHederaJson<HederaMirrorNodeNfts>(
	binding,
	accountCollectionUrl(
		binding,
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
	binding: SourceBinding,
	limit: number
): Promise<HederaMirrorNodeBlocks> => {
	const url = new URL('/api/v1/blocks', firstHttpUrlForBinding(binding))
	url.searchParams.set('limit', String(limit))
	url.searchParams.set('order', 'desc')

	return sourceGetJson<HederaMirrorNodeBlocks>(binding, url.toString())
}

export const getBlock = (
	binding: SourceBinding,
	hashOrNumber: string
): Promise<HederaMirrorNodeBlock> => {
	if (!/^(?:\d{1,10}|(?:0x)?(?:[A-Fa-f0-9]{64}|[A-Fa-f0-9]{96}))$/.test(hashOrNumber))
		throw new Error('HederaMirrorNode_Rest: invalid block selector')

	return sourceGetJson<HederaMirrorNodeBlock>(
		binding,
		new URL(
			`/api/v1/blocks/${encodeURIComponent(hashOrNumber)}`,
			firstHttpUrlForBinding(binding)
		).toString()
	)
}
