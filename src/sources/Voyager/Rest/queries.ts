import { getJson } from '$/sources/_shared/wire/HttpRest/client.ts'
import type { paths } from '$/sources/Voyager/OpenApi/openapi.d.ts'
import bindings from '$/sources/Voyager/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { type as arktype } from 'arktype'

const binding = bindings[Source.Voyager][0]

const felt = arktype('/^0[xX][\\da-fA-F]{1,64}$/')
const nonNegativeInteger = arktype('number.integer >= 0')
const nonEmptyString = arktype('string > 0')

const transactionDetailsWire = arktype({
	blockNumber: nonNegativeInteger,
	hash: felt,
	timestamp: nonNegativeInteger,
	status: nonEmptyString,
	type: nonEmptyString,
	'actualFee?': 'string|null',
	'executionStatus?': 'string|null',
	'revertError?': 'string|null',
	'senderAddress?': felt.or('null'),
	'nonce?': 'string|null',
	'version?': 'string|null',
	'maxFee?': 'string|null',
	'calldata?': arktype(felt.or('null')).array().or('null'),
	signature: arktype(felt.or('null')).array(),
	receipt: {
		events: arktype({
			'id?': 'string|null',
			'blockNumber?': nonNegativeInteger.or('null'),
			'fromAddress?': felt.or('null'),
			'timestamp?': nonNegativeInteger.or('null'),
			'selector?': felt.or('null'),
			'name?': 'string|null',
			nestedEventNames: arktype('string|null').array(),
		}).array(),
	},
})

const blockDetailsWire = arktype({
	'blockNumber?': nonNegativeInteger.or('null'),
	'hash?': felt.or('null'),
	'timestamp?': nonNegativeInteger.or('null'),
	'stateRoot?': felt.or('null'),
	'status?': 'string|null',
	'prevBlockHash?': felt.or('null'),
	'sequencerAddress?': felt.or('null'),
	'ethGasPrice?': 'string|null',
	'strkGasPrice?': 'string|null',
})

const contractDetailsWire = arktype({
	address: felt,
	blockNumber: nonNegativeInteger,
	nonce: nonNegativeInteger,
	classHash: felt,
})

const classDetailsWire = arktype({
	hash: felt,
	transactionHash: felt,
	'version?': 'string|null',
})

const networkStatsWire = arktype({
	blocksCount: arktype('/^\\d+$/'),
	tpsAtBlockHash: felt,
})

const apiStatusWire = arktype({
	timestamp: nonNegativeInteger,
	apis: {
		'core?': {
			status: nonEmptyString,
		},
	},
})

const listBlocksWire = arktype({
	items: arktype({
		'blockNumber?': nonNegativeInteger.or('null'),
		'hash?': felt.or('null'),
		'timestamp?': nonNegativeInteger.or('null'),
		'status?': 'string|null',
	}).array(),
	lastPage: nonNegativeInteger,
})

const listTransactionsWire = arktype({
	items: arktype({
		hash: felt,
		type: nonEmptyString,
		timestamp: nonNegativeInteger,
		status: nonEmptyString,
		'blockNumber?': nonNegativeInteger,
		'index?': nonNegativeInteger,
		'contractAddress?': felt.or('null'),
		'classHash?': felt.or('null'),
		'actualFee?': 'string|null',
	}).array(),
	lastPage: nonNegativeInteger,
})

const listEventsWire = arktype({
	items: arktype({
		'number?': nonNegativeInteger.or('null'),
		'fromAddress?': felt.or('null'),
		'transactionHash?': felt.or('null'),
		'selector?': felt.or('null'),
		'name?': 'string|null',
		'dataDecoded?': arktype({
			'name?': 'string|null',
			'value?': 'string|null',
			'type?': 'string|null',
		}).array().or('null'),
	}).array(),
	lastPage: nonNegativeInteger,
})

const listContractsWire = arktype({
	items: arktype({
		address: felt,
		blockNumber: nonNegativeInteger,
		classHash: felt,
		'type?': 'string|null',
		'creationTimestamp?': nonNegativeInteger.or('null'),
		'version?': 'string|null',
		'blockHash?': felt.or('null'),
		'isAccount?': 'boolean|null',
		'isErcToken?': 'boolean|null',
		'isProxy?': 'boolean|null',
	}).array(),
	lastPage: nonNegativeInteger,
})

const listClassesWire = arktype({
	items: arktype({
		hash: felt,
		transactionHash: felt,
		'version?': 'string|null',
		'type?': nonNegativeInteger.or('null'),
		'isAccount?': 'boolean|null',
		'isProxy?': 'boolean|null',
		'isErcToken?': 'boolean|null',
		'creationTimestamp?': nonNegativeInteger.or('null'),
	}).array(),
	lastPage: nonNegativeInteger,
})

const listClassContractsWire = arktype({
	items: arktype({
		address: felt,
		'creationTimestamp?': nonNegativeInteger.or('null'),
		'txnCount?': nonNegativeInteger.or('null'),
		'starknetId?': 'string|null',
		'accountCallCount?': nonNegativeInteger.or('null'),
		'contractAlias?': 'string|null',
		'constructorCalldata?': arktype(felt.or('null')).array().or('null'),
	}).array(),
	lastPage: nonNegativeInteger,
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
		throw new Error(`Voyager_Rest: invalid ${label} envelope`)
	}
}

const pageSize = (
	limit: number
) => {
	if (!Number.isSafeInteger(limit) || limit < 0)
		throw new Error('Voyager_Rest: page limit must be a non-negative integer')
	if (limit === 0)
		return 10
	if (limit <= 10)
		return 10
	if (limit <= 25)
		return 25
	if (limit <= 50)
		return 50
	return 100
}

const pageNumber = (
	page: number | undefined
) => {
	if (page == null)
		return 1
	if (!Number.isSafeInteger(page) || page < 1)
		throw new Error('Voyager_Rest: page number must be an integer >= 1')
	return page
}

export const getTransactionByHash = async (
	{ txnHash }: paths['/txns/{txnHash}']['get']['parameters']['path']
) => (
	assertEnvelope(
		transactionDetailsWire,
		await getJson<unknown>(
			binding,
			`/txns/${encodeURIComponent(txnHash)}`
		),
		'transaction'
	)
)

export const getContractByAddress = async (
	{ contractAddress }: paths['/contracts/{contractAddress}']['get']['parameters']['path']
) => (
	assertEnvelope(
		contractDetailsWire,
		await getJson<unknown>(
			binding,
			`/contracts/${encodeURIComponent(contractAddress)}`
		),
		'contract'
	)
)

export const getClassByHash = async (
	{ classHash }: paths['/classes/{classHash}']['get']['parameters']['path']
) => (
	assertEnvelope(
		classDetailsWire,
		await getJson<unknown>(
			binding,
			`/classes/${encodeURIComponent(classHash)}`
		),
		'class'
	)
)

export const getBlockByHash = async (
	{ blockHash }: paths['/blocks/{blockHash}']['get']['parameters']['path']
) => (
	assertEnvelope(
		blockDetailsWire,
		await getJson<unknown>(
			binding,
			`/blocks/${encodeURIComponent(blockHash)}`
		),
		'block'
	)
)

export const getNetworkStats = async () => (
	assertEnvelope(
		networkStatsWire,
		await getJson<unknown>(binding, '/stats'),
		'network stats'
	)
)

export const getApiStatus = async () => (
	assertEnvelope(
		apiStatusWire,
		await getJson<unknown>(binding, '/api-status'),
		'api status'
	)
)

export const listBlocks = async (
	{
		limit,
		page,
	}: {
		limit: number
		page?: number
	}
) => {
	if (limit === 0)
		return {
			items: [],
			lastPage: 0,
		}

	const parameters = new URLSearchParams({
		p: pageNumber(page).toString(),
		ps: pageSize(limit).toString(),
	})
	const response = assertEnvelope(
		listBlocksWire,
		await getJson<unknown>(binding, `/blocks?${parameters.toString()}`),
		'blocks page'
	)
	if (response.items.length > pageSize(limit))
		throw new Error('Voyager_Rest: blocks page exceeds requested page size')
	return response
}

export const listTransactions = async (
	{
		limit,
		page,
		block,
		to,
	}: {
		limit: number
		page?: number
		block?: string
		to?: string
	}
) => {
	if (limit === 0)
		return {
			items: [],
			lastPage: 0,
		}

	const parameters = new URLSearchParams({
		p: pageNumber(page).toString(),
		ps: pageSize(limit).toString(),
	})
	if (block != null)
		parameters.set('block', block)
	if (to != null)
		parameters.set('to', to)

	const response = assertEnvelope(
		listTransactionsWire,
		await getJson<unknown>(binding, `/txns?${parameters.toString()}`),
		'transactions page'
	)
	if (response.items.length > pageSize(limit))
		throw new Error('Voyager_Rest: transactions page exceeds requested page size')
	const transactionHashes = new Set<bigint>()
	for (const transaction of response.items) {
		const transactionHash = BigInt(transaction.hash)
		if (transactionHashes.has(transactionHash))
			throw new Error('Voyager_Rest: transactions page returned a duplicate identity')
		transactionHashes.add(transactionHash)
	}
	return response
}

export const listEvents = async (
	{
		limit,
		page,
		txnHash,
		contract,
		blockHash,
	}: {
		limit: number
		page?: number
		txnHash?: string
		contract?: string
		blockHash?: string
	}
) => {
	if (limit === 0)
		return {
			items: [],
			lastPage: 0,
		}
	if (
		(txnHash != null && contract != null)
		|| (txnHash != null && blockHash != null)
		|| (contract != null && blockHash != null)
	)
		throw new Error('Voyager_Rest: event filters contract/txnHash/blockHash are mutually exclusive')

	const parameters = new URLSearchParams({
		p: pageNumber(page).toString(),
		ps: pageSize(limit).toString(),
	})
	if (txnHash != null)
		parameters.set('txnHash', txnHash)
	if (contract != null)
		parameters.set('contract', contract)
	if (blockHash != null)
		parameters.set('blockHash', blockHash)

	const response = assertEnvelope(
		listEventsWire,
		await getJson<unknown>(binding, `/events?${parameters.toString()}`),
		'events page'
	)
	if (response.items.length > pageSize(limit))
		throw new Error('Voyager_Rest: events page exceeds requested page size')
	return response
}

export const listContracts = async (
	{
		limit,
		page,
		type,
	}: {
		limit: number
		page?: number
		type?: 'account' | 'erc20' | 'erc721' | 'erc1155' | 'unknown' | 'proxy'
	}
) => {
	if (limit === 0)
		return {
			items: [],
			lastPage: 0,
		}

	const parameters = new URLSearchParams({
		p: pageNumber(page).toString(),
		ps: pageSize(limit).toString(),
	})
	if (type != null)
		parameters.set('type', type)

	const response = assertEnvelope(
		listContractsWire,
		await getJson<unknown>(binding, `/contracts?${parameters.toString()}`),
		'contracts page'
	)
	if (response.items.length > pageSize(limit))
		throw new Error('Voyager_Rest: contracts page exceeds requested page size')
	const contractAddresses = new Set<bigint>()
	for (const contract of response.items) {
		const contractAddress = BigInt(contract.address)
		if (contractAddresses.has(contractAddress))
			throw new Error('Voyager_Rest: contracts page returned a duplicate identity')
		contractAddresses.add(contractAddress)
	}
	return response
}

export const listClasses = async (
	{
		limit,
		page,
	}: {
		limit: number
		page?: number
	}
) => {
	if (limit === 0)
		return {
			items: [],
			lastPage: 0,
		}

	const parameters = new URLSearchParams({
		p: pageNumber(page).toString(),
		ps: pageSize(limit).toString(),
	})
	const response = assertEnvelope(
		listClassesWire,
		await getJson<unknown>(binding, `/classes?${parameters.toString()}`),
		'classes page'
	)
	if (response.items.length > pageSize(limit))
		throw new Error('Voyager_Rest: classes page exceeds requested page size')
	const classHashes = new Set<bigint>()
	for (const klass of response.items) {
		const classHash = BigInt(klass.hash)
		if (classHashes.has(classHash))
			throw new Error('Voyager_Rest: classes page returned a duplicate identity')
		classHashes.add(classHash)
	}
	return response
}

export const listClassContracts = async (
	{
		classHash,
		limit,
		page,
	}: {
		classHash: string
		limit: number
		page?: number
	}
) => {
	if (limit === 0)
		return {
			items: [],
			lastPage: 0,
		}

	const parameters = new URLSearchParams({
		p: pageNumber(page).toString(),
		ps: pageSize(limit).toString(),
	})
	const response = assertEnvelope(
		listClassContractsWire,
		await getJson<unknown>(
			binding,
			`/classes/${encodeURIComponent(classHash)}/contracts?${parameters.toString()}`
		),
		'class contracts page'
	)
	if (response.items.length > pageSize(limit))
		throw new Error('Voyager_Rest: class contracts page exceeds requested page size')
	const contractAddresses = new Set<bigint>()
	for (const contract of response.items) {
		const contractAddress = BigInt(contract.address)
		if (contractAddresses.has(contractAddress))
			throw new Error('Voyager_Rest: class contracts page returned a duplicate identity')
		contractAddresses.add(contractAddress)
	}
	return response
}
