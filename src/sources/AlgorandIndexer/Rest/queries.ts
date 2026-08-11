import { getJson } from '$/sources/_shared/wire/HttpRest/client.ts'
import { Source } from '$/sources/Source.ts'
import { ApiFamily } from '$/sources/SourceBinding.ts'
import bindings from '$/sources/Nodely/bindings.ts'
import type {
	AlgorandIndexerAccountResponse,
	AlgorandIndexerApplicationBoxesPage,
	AlgorandIndexerApplicationLocalStatesPage,
	AlgorandIndexerApplicationResponse,
	AlgorandIndexerAssetBalancesPage,
	AlgorandIndexerAssetHoldingsPage,
	AlgorandIndexerAssetResponse,
	AlgorandIndexerBlock,
	AlgorandIndexerHealth,
	AlgorandIndexerTransaction,
	AlgorandIndexerTransactionResponse,
	AlgorandIndexerTransactionsPage,
} from '$/sources/AlgorandIndexer/Rest/types.ts'
import { type as arktype } from 'arktype'

const binding = bindings[Source.Nodely].find(({ apiFamily }) => (
	apiFamily === ApiFamily.AlgorandIndexerRestApi
))

if (binding == null)
	throw new Error('AlgorandIndexer_Rest: binding is missing')

const unsigned = arktype(`number.integer >= 0 <= ${Number.MAX_SAFE_INTEGER}`)
const addressWire = arktype('/^[A-Z2-7]{57}[AEIMQUY4]$/')
const nonEmptyString = arktype('string > 0')

const paymentWire = arktype({
	amount: unsigned,
	receiver: addressWire,
	'close-amount?': unsigned,
	'close-remainder-to?': addressWire,
})

const assetTransferWire = arktype({
	amount: unsigned,
	'asset-id': unsigned,
	receiver: addressWire,
	'sender?': addressWire,
	'close-amount?': unsigned,
	'close-to?': addressWire,
})

const transactionWire: arktype.Any = arktype({
	id: nonEmptyString,
	sender: addressWire,
	fee: unsigned,
	'tx-type': nonEmptyString,
	'confirmed-round?': unsigned,
	'group?': 'string',
	'logs?': 'string[]',
	'payment-transaction?': paymentWire,
	'asset-transfer-transaction?': assetTransferWire,
	'application-transaction?': {
		'accounts?': addressWire.array(),
		'application-id?': unsigned,
	},
	'heartbeat-transaction?': {
		'hb-address': addressWire,
	},
	'inner-txns?': arktype('unknown[]'),
})

const transactionsPageWire = arktype({
	'current-round': unsigned,
	'next-token?': 'string',
	transactions: transactionWire.array(),
})

const transactionResponseWire = arktype({
	'current-round': unsigned,
	transaction: transactionWire,
})

const assetHoldingWire = arktype({
	amount: unsigned,
	'asset-id': unsigned,
	'deleted?': 'boolean',
	'is-frozen': 'boolean',
	'opted-in-at-round?': unsigned,
	'opted-out-at-round?': unsigned,
})

const assetHoldingsPageWire = arktype({
	assets: assetHoldingWire.array(),
	'current-round': unsigned,
	'next-token?': 'string',
})

const accountResponseWire = arktype({
	account: {
		address: addressWire,
		amount: unsigned,
		'pending-rewards?': unsigned,
		'reward-base?': unsigned,
		'status?': 'string',
	},
	'current-round': unsigned,
})

const assetResponseWire = arktype({
	asset: {
		index: unsigned,
		'deleted?': 'boolean',
		'created-at-round?': unsigned,
		params: {
			creator: addressWire,
			decimals: unsigned,
			// Indexer may emit uint64 totals outside JSON-safe integer range.
			total: 'number >= 0',
			'default-frozen?': 'boolean',
			'unit-name?': 'string',
			'name?': 'string',
			'url?': 'string',
			'metadata-hash?': 'string',
			'manager?': addressWire,
			'reserve?': addressWire,
			'freeze?': addressWire,
			'clawback?': addressWire,
		},
	},
	'current-round': unsigned,
})

const applicationResponseWire = arktype({
	application: {
		id: unsigned,
		'deleted?': 'boolean',
		'created-at-round?': unsigned,
		params: {
			creator: addressWire,
			'approval-program?': 'string',
			'clear-state-program?': 'string',
			'global-state?': 'unknown',
			'global-state-schema?': 'unknown',
			'local-state-schema?': 'unknown',
		},
	},
	'current-round': unsigned,
})

const applicationLocalStatesPageWire = arktype({
	'apps-local-states': arktype({
		id: unsigned,
		'deleted?': 'boolean',
		'key-value?': 'unknown',
		'schema?': 'unknown',
		'opted-in-at-round?': unsigned,
	}).array(),
	'current-round': unsigned,
	'next-token?': 'string',
})

const applicationBoxesPageWire = arktype({
	'application-id': unsigned,
	boxes: arktype({
		name: nonEmptyString,
	}).array(),
	'next-token?': 'string',
})

const blockWire = arktype({
	round: unsigned,
	timestamp: unsigned,
	'genesis-hash?': 'string',
	'previous-block-hash?': 'string',
	'proposer?': addressWire,
	'transactions?': transactionWire.array(),
})

const healthWire = arktype({
	'round?': unsigned,
	'message?': 'string',
	'version?': 'string',
	'db-available?': 'boolean',
	'data?': {
		'round?': unsigned,
	},
})

const assetBalancesPageWire = arktype({
	balances: arktype({
		address: addressWire,
		amount: unsigned,
		'deleted?': 'boolean',
		'is-frozen': 'boolean',
		'opted-in-at-round?': unsigned,
		'opted-out-at-round?': unsigned,
	}).array(),
	'current-round': unsigned,
	'next-token?': 'string',
})

const assertEnvelope = <_Value>(
	wire: {
		assert: (value: unknown) => _Value
	},
	response: unknown,
	label: string
): _Value => {
	try {
		return wire.assert(response)
	} catch {
		throw new Error(`AlgorandIndexer_Rest: invalid ${label} envelope`)
	}
}

const assertAddress = (
	address: string,
	label: string
) => {
	if (!addressWire.allows(address))
		throw new Error(`AlgorandIndexer_Rest: invalid ${label}`)
}

const assertSafeUnsigned = (
	value: number,
	label: string
) => {
	if (!Number.isSafeInteger(value) || value < 0)
		throw new Error(`AlgorandIndexer_Rest: ${label} exceeds lossless JSON integer range`)
}

const touchesAccount = (
	transaction: AlgorandIndexerTransaction,
	address: string
): boolean => (
	transaction.sender === address
	|| transaction['payment-transaction']?.receiver === address
	|| transaction['payment-transaction']?.['close-remainder-to'] === address
	|| transaction['asset-transfer-transaction']?.receiver === address
	|| transaction['asset-transfer-transaction']?.sender === address
	|| transaction['asset-transfer-transaction']?.['close-to'] === address
	|| transaction['application-transaction']?.accounts?.includes(address) === true
	|| transaction['heartbeat-transaction']?.['hb-address'] === address
	|| transaction['inner-txns']?.some((innerTransaction) => (
		touchesAccount(innerTransaction, address)
	)) === true
)

const query = (
	path: string
) => (
	getJson<unknown>(binding, path)
)

const pageParameters = (
	limit: number,
	next?: string
) => {
	if (!Number.isSafeInteger(limit) || limit < 0 || limit > 1_000)
		throw new Error('AlgorandIndexer_Rest: page limit must be an integer from 0 through 1000')
	if (next === '')
		throw new Error('AlgorandIndexer_Rest: continuation token must not be empty')
	const parameters = new URLSearchParams({
		limit: limit.toString(),
	})
	if (next != null)
		parameters.set('next', next)
	return parameters
}

const assertPageContinuation = (
	page: {
		'next-token'?: string
	},
	next: string | undefined,
	label: string
) => {
	if (page['next-token'] === '')
		throw new Error('AlgorandIndexer_Rest: continuation token must not be empty')
	if (page['next-token'] != null && page['next-token'] === next)
		throw new Error(`AlgorandIndexer_Rest: ${label} continuation did not advance`)
}

const assertTransactionRow = (
	transaction: AlgorandIndexerTransaction
) => {
	assertAddress(transaction.sender, 'transaction sender')
	assertSafeUnsigned(transaction.fee, 'transaction fee')
	if (transaction['confirmed-round'] != null)
		assertSafeUnsigned(transaction['confirmed-round'], 'confirmed round')
	if (transaction['payment-transaction'] != null) {
		assertAddress(transaction['payment-transaction'].receiver, 'payment receiver')
		assertSafeUnsigned(transaction['payment-transaction'].amount, 'payment amount')
	}
	if (transaction['asset-transfer-transaction'] != null) {
		assertAddress(transaction['asset-transfer-transaction'].receiver, 'asset receiver')
		assertSafeUnsigned(transaction['asset-transfer-transaction'].amount, 'asset transfer amount')
		assertSafeUnsigned(transaction['asset-transfer-transaction']['asset-id'], 'asset transfer ID')
	}
	for (const innerTransaction of transaction['inner-txns'] ?? [])
		assertTransactionRow(innerTransaction)
}

export const getAccountAssets = async (
	{
		address,
		limit,
		next,
	}: {
		address: string
		limit: number
		next?: string
	}
): Promise<AlgorandIndexerAssetHoldingsPage> => {
	assertAddress(address, 'account address')
	const parameters = pageParameters(limit, next)
	parameters.set('include-all', 'true')
	if (limit === 0)
		return {
			assets: [],
			'current-round': 0,
		}
	const page = assertEnvelope(
		assetHoldingsPageWire,
		await query(`/v2/accounts/${encodeURIComponent(address)}/assets?${parameters.toString()}`),
		'asset holdings page'
	)
	if (page.assets.length > limit)
		throw new Error('AlgorandIndexer_Rest: asset page exceeds requested limit')

	const assetIds = new Set<number>()
	for (const asset of page.assets) {
		if (assetIds.has(asset['asset-id']))
			throw new Error('AlgorandIndexer_Rest: duplicate account asset')
		assetIds.add(asset['asset-id'])
	}
	assertPageContinuation(page, next, 'asset')
	return page
}

export const getAccount = async (
	address: string
): Promise<AlgorandIndexerAccountResponse> => {
	assertAddress(address, 'account address')
	const response = assertEnvelope(
		accountResponseWire,
		await query(`/v2/accounts/${encodeURIComponent(address)}`),
		'account'
	)
	if (response.account.address !== address)
		throw new Error('AlgorandIndexer_Rest: account response does not match the subject')
	return response
}

export const getAccountTransactions = async (
	{
		address,
		limit,
		next,
	}: {
		address: string
		limit: number
		next?: string
	}
): Promise<AlgorandIndexerTransactionsPage> => {
	assertAddress(address, 'account address')
	const parameters = pageParameters(limit, next)
	if (limit === 0)
		return {
			'current-round': 0,
			transactions: [],
		}
	const page = assertEnvelope(
		transactionsPageWire,
		await query(`/v2/accounts/${encodeURIComponent(address)}/transactions?${parameters.toString()}`),
		'account transactions page'
	)
	if (page.transactions.length > limit)
		throw new Error('AlgorandIndexer_Rest: transaction page exceeds requested limit')

	const transactionIds = new Set<string>()
	for (const transaction of page.transactions) {
		if (!touchesAccount(transaction, address))
			throw new Error('AlgorandIndexer_Rest: transaction page contains a foreign account row')
		if (transactionIds.has(transaction.id))
			throw new Error('AlgorandIndexer_Rest: invalid or duplicate transaction ID')
		transactionIds.add(transaction.id)
		assertTransactionRow(transaction)
	}
	assertPageContinuation(page, next, 'transaction')
	return page
}

export const listTransactions = async (
	{
		limit,
		next,
	}: {
		limit: number
		next?: string
	}
): Promise<AlgorandIndexerTransactionsPage> => {
	const parameters = pageParameters(limit, next)
	if (limit === 0)
		return {
			'current-round': 0,
			transactions: [],
		}
	const page = assertEnvelope(
		transactionsPageWire,
		await query(`/v2/transactions?${parameters.toString()}`),
		'transactions page'
	)
	if (page.transactions.length > limit)
		throw new Error('AlgorandIndexer_Rest: transaction page exceeds requested limit')

	const transactionIds = new Set<string>()
	for (const transaction of page.transactions) {
		if (transactionIds.has(transaction.id))
			throw new Error('AlgorandIndexer_Rest: invalid or duplicate transaction ID')
		transactionIds.add(transaction.id)
		assertTransactionRow(transaction)
	}
	assertPageContinuation(page, next, 'transaction')
	return page
}

export const getTransaction = async (
	txId: string
): Promise<AlgorandIndexerTransactionResponse> => {
	if (txId.length === 0)
		throw new Error('AlgorandIndexer_Rest: invalid transaction ID')
	const response = assertEnvelope(
		transactionResponseWire,
		await query(`/v2/transactions/${encodeURIComponent(txId)}`),
		'transaction'
	)
	if (response.transaction.id !== txId)
		throw new Error('AlgorandIndexer_Rest: transaction response does not match the subject')
	assertTransactionRow(response.transaction)
	return response
}

export const getAsset = async (
	assetId: bigint
): Promise<AlgorandIndexerAssetResponse> => {
	if (assetId < 0n || assetId > BigInt(Number.MAX_SAFE_INTEGER))
		throw new Error('AlgorandIndexer_Rest: asset ID exceeds lossless JSON integer range')
	const response = assertEnvelope(
		assetResponseWire,
		await query(`/v2/assets/${assetId.toString()}`),
		'asset'
	)
	if (BigInt(response.asset.index) !== assetId)
		throw new Error('AlgorandIndexer_Rest: asset response does not match the subject')
	return response
}

export const getApplication = async (
	applicationId: bigint
): Promise<AlgorandIndexerApplicationResponse> => {
	if (applicationId < 0n || applicationId > BigInt(Number.MAX_SAFE_INTEGER))
		throw new Error('AlgorandIndexer_Rest: application ID exceeds lossless JSON integer range')
	const response = assertEnvelope(
		applicationResponseWire,
		await query(`/v2/applications/${applicationId.toString()}`),
		'application'
	)
	if (BigInt(response.application.id) !== applicationId)
		throw new Error('AlgorandIndexer_Rest: application response does not match the subject')
	return response
}

export const getAccountApplications = async (
	{
		address,
		limit,
		next,
	}: {
		address: string
		limit: number
		next?: string
	}
): Promise<AlgorandIndexerApplicationLocalStatesPage> => {
	assertAddress(address, 'account address')
	const parameters = pageParameters(limit, next)
	parameters.set('include-all', 'true')
	if (limit === 0)
		return {
			'apps-local-states': [],
			'current-round': 0,
		}
	const page = assertEnvelope(
		applicationLocalStatesPageWire,
		await query(`/v2/accounts/${encodeURIComponent(address)}/apps-local-state?${parameters.toString()}`),
		'application local state page'
	)
	if (page['apps-local-states'].length > limit)
		throw new Error('AlgorandIndexer_Rest: application local state page exceeds requested limit')

	const applicationIds = new Set<number>()
	for (const localState of page['apps-local-states']) {
		if (applicationIds.has(localState.id))
			throw new Error('AlgorandIndexer_Rest: duplicate application local state')
		applicationIds.add(localState.id)
	}
	assertPageContinuation(page, next, 'application local state')
	return page
}

export const listApplicationBoxes = async (
	{
		applicationId,
		limit,
		next,
	}: {
		applicationId: bigint
		limit: number
		next?: string
	}
): Promise<AlgorandIndexerApplicationBoxesPage> => {
	if (applicationId < 0n || applicationId > BigInt(Number.MAX_SAFE_INTEGER))
		throw new Error('AlgorandIndexer_Rest: application ID exceeds lossless JSON integer range')
	const parameters = pageParameters(limit, next)
	if (limit === 0)
		return {
			'application-id': Number(applicationId),
			boxes: [],
		}
	const page = assertEnvelope(
		applicationBoxesPageWire,
		await query(`/v2/applications/${applicationId.toString()}/boxes?${parameters.toString()}`),
		'application boxes page'
	)
	if (BigInt(page['application-id']) !== applicationId)
		throw new Error('AlgorandIndexer_Rest: boxes page application does not match the subject')
	if (page.boxes.length > limit)
		throw new Error('AlgorandIndexer_Rest: boxes page exceeds requested limit')

	const boxNames = new Set<string>()
	for (const box of page.boxes) {
		if (boxNames.has(box.name))
			throw new Error('AlgorandIndexer_Rest: duplicate application box')
		boxNames.add(box.name)
	}
	assertPageContinuation(page, next, 'application boxes')
	return page
}

export const getBlock = async (
	round: bigint
): Promise<AlgorandIndexerBlock> => {
	if (round < 0n || round > BigInt(Number.MAX_SAFE_INTEGER))
		throw new Error('AlgorandIndexer_Rest: round exceeds lossless JSON integer range')
	const block = assertEnvelope(
		blockWire,
		await query(`/v2/blocks/${round.toString()}`),
		'block'
	) as AlgorandIndexerBlock
	if (BigInt(block.round) !== round)
		throw new Error('AlgorandIndexer_Rest: block response does not match the subject')
	const transactionIds = new Set<string>()
	for (const transaction of block.transactions ?? []) {
		assertTransactionRow(transaction)
		if (transactionIds.has(transaction.id))
			throw new Error('AlgorandIndexer_Rest: duplicate block transaction ID')
		transactionIds.add(transaction.id)
	}
	return block
}

export const getHealth = async (): Promise<AlgorandIndexerHealth> => (
	assertEnvelope(
		healthWire,
		await query('/health'),
		'health'
	)
)

export const getAssetBalances = async (
	{
		assetId,
		limit,
		next,
	}: {
		assetId: bigint
		limit: number
		next?: string
	}
): Promise<AlgorandIndexerAssetBalancesPage> => {
	if (assetId < 0n || assetId > BigInt(Number.MAX_SAFE_INTEGER))
		throw new Error('AlgorandIndexer_Rest: asset ID exceeds lossless JSON integer range')
	const parameters = pageParameters(limit, next)
	parameters.set('include-all', 'true')
	if (limit === 0)
		return {
			balances: [],
			'current-round': 0,
		}
	const page = assertEnvelope(
		assetBalancesPageWire,
		await query(`/v2/assets/${assetId.toString()}/balances?${parameters.toString()}`),
		'asset balances page'
	)
	if (page.balances.length > limit)
		throw new Error('AlgorandIndexer_Rest: asset balances page exceeds requested limit')

	const addresses = new Set<string>()
	for (const balance of page.balances) {
		if (addresses.has(balance.address))
			throw new Error('AlgorandIndexer_Rest: duplicate asset balance address')
		addresses.add(balance.address)
	}
	assertPageContinuation(page, next, 'asset balances')
	return page
}
