import {
	firstHttpUrlForBinding,
	sourceGetJson,
} from '$/sources/_runtime/http.ts'
import type {
	FilfoxAddress,
	FilfoxBlock,
	FilfoxDeal,
	FilfoxDealsPage,
	FilfoxMessage,
	FilfoxMessagesPage,
	FilfoxOverview,
	FilfoxTipset,
} from '$/sources/Filfox/Rest/types.ts'
import bindings from '$/sources/Filfox/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { type as arktype } from 'arktype'

const binding = bindings[Source.Filfox_Rest][0]
const baseUrl = `${firstHttpUrlForBinding(binding).replace(/\/$/, '')}/api/v1`

const filfoxMessageReceiptWire = arktype({
	exitCode: 'number.integer',
	'return?': 'string',
	'gasUsed?': 'number.integer',
})

const filfoxMessageListItemWire = arktype({
	cid: 'string',
	'height?': 'number.integer',
	'timestamp?': 'number.integer',
	from: 'string',
	to: 'string',
	'nonce?': 'number.integer',
	value: 'string',
	method: 'string',
	'methodNumber?': 'number.integer',
	'evmMethod?': 'string',
	'params?': 'string',
	'receipt?': filfoxMessageReceiptWire,
	'gasLimit?': 'number.integer',
})

const filfoxMessagesPageWire = arktype({
	totalCount: 'number.integer',
	messages: filfoxMessageListItemWire.array(),
	'methods?': 'unknown[]',
})

const filfoxMessageDetailWire = arktype({
	cid: 'string',
	'height?': 'number.integer',
	'timestamp?': 'number.integer',
	'blocks?': 'string[]',
	'confirmations?': 'number.integer',
	'version?': 'number.integer',
	from: 'string',
	'fromId?': 'string',
	'fromActor?': 'string',
	to: 'string',
	'toId?': 'string',
	'toActor?': 'string',
	nonce: 'number.integer',
	value: 'string',
	method: 'string',
	'methodNumber?': 'number.integer',
	'evmMethod?': 'string',
	'params?': 'string',
	'gasLimit?': 'number.integer',
	'gasFeeCap?': 'string',
	'gasPremium?': 'string',
	'receipt?': filfoxMessageReceiptWire,
	'size?': 'number.integer',
	'error?': 'string',
	'baseFee?': 'string',
	'fee?': {
		baseFeeBurn: 'string',
		overEstimationBurn: 'string',
		minerPenalty: 'string',
		minerTip: 'string',
		refund: 'string',
	},
	'transfers?': arktype({
		from: 'string',
		'fromId?': 'string',
		to: 'string',
		'toId?': 'string',
		'toTag?': {
			name: 'string',
			signed: 'boolean',
		},
		value: 'string',
		type: 'string',
	}).array(),
	'ethTransactionHash?': 'string',
	'eventLogCount?': 'number.integer',
	'subcallCount?': 'number.integer',
	'tokenTransfers?': 'unknown[]',
})

const assertMessagesPageEnvelope = (response: unknown): FilfoxMessagesPage => {
	try {
		return filfoxMessagesPageWire.assert(response)
	} catch {
		throw new Error(`${Source.Filfox_Rest}: invalid messages response envelope`)
	}
}

const assertMessageDetailEnvelope = (response: unknown): FilfoxMessage => {
	try {
		return filfoxMessageDetailWire.assert(response)
	} catch {
		throw new Error(`${Source.Filfox_Rest}: invalid message response envelope`)
	}
}

const assertPageSize = (pageSize: number) => {
	if (!Number.isSafeInteger(pageSize) || pageSize < 1 || pageSize > 100)
		throw new Error(`${Source.Filfox_Rest}: invalid pageSize ${String(pageSize)}`)
}

const assertPage = (page: number) => {
	if (!Number.isSafeInteger(page) || page < 0)
		throw new Error(`${Source.Filfox_Rest}: invalid page ${String(page)}`)
}

export const getTipset = ({
	height,
}: {
	height: bigint
}) => (
	sourceGetJson<FilfoxTipset>(
		binding,
		`${baseUrl}/tipset/${height.toString()}`
	)
)

/**
 * Message detail including tipset inclusion (`height` / `timestamp` / `blocks`)
 * and receipt-adjacent fields when Filfox has executed the message.
 * @see https://filfox.info/api/v1/message/{cid}
 */
export const getMessage = ({
	messageCid,
}: {
	messageCid: string
}) => {
	if (messageCid === '')
		throw new Error(`${Source.Filfox_Rest}: empty message cid`)

	return sourceGetJson<unknown>(
		binding,
		`${baseUrl}/message/${messageCid}`
	)
		.then((response) => {
			const message = assertMessageDetailEnvelope(response)
			if (message.cid !== messageCid)
				throw new Error(`${Source.Filfox_Rest}: message cid mismatch ${message.cid} !== ${messageCid}`)

			return message
		})
}

/**
 * Global recent-message page (`totalCount` + `messages[]`).
 * Optional `method` filters by Filfox method name (e.g. `PublishStorageDeals`).
 * @see https://filfox.info/api/v1/message/list
 */
export const getMessages = ({
	page = 0,
	pageSize = 16,
	method,
}: {
	page?: number
	pageSize?: number
	method?: string
}) => {
	assertPage(page)
	assertPageSize(pageSize)
	const parameters = new URLSearchParams({
		page: page.toString(),
		pageSize: pageSize.toString(),
		...(method != null && method !== '' && {
			method,
		}),
	})
	return sourceGetJson<unknown>(
		binding,
		`${baseUrl}/message/list?${parameters}`
	)
		.then(assertMessagesPageEnvelope)
}

export const getBlock = ({
	blockCid,
}: {
	blockCid: string
}) => (
	sourceGetJson<FilfoxBlock>(
		binding,
		`${baseUrl}/block/${blockCid}`
	)
)

export const getBlockMessages = ({
	blockCid,
	pageSize,
}: {
	blockCid: string
	pageSize: number
}) => {
	assertPageSize(pageSize)
	return sourceGetJson<unknown>(
		binding,
		`${baseUrl}/block/${blockCid}/messages?pageSize=${pageSize.toString()}`
	)
		.then(assertMessagesPageEnvelope)
}

/**
 * Messages involving a Filecoin address (paginated).
 * @see https://filfox.info/api/v1/address/{address}/messages
 */
export const getAddressMessages = ({
	address,
	page = 0,
	pageSize = 16,
}: {
	address: string
	page?: number
	pageSize?: number
}) => {
	if (address === '')
		throw new Error(`${Source.Filfox_Rest}: empty address`)
	assertPage(page)
	assertPageSize(pageSize)
	const parameters = new URLSearchParams({
		page: page.toString(),
		pageSize: pageSize.toString(),
	})
	return sourceGetJson<unknown>(
		binding,
		`${baseUrl}/address/${address}/messages?${parameters}`
	)
		.then(assertMessagesPageEnvelope)
}

export const getAddress = ({
	address,
}: {
	address: string
}) => (
	sourceGetJson<FilfoxAddress>(
		binding,
		`${baseUrl}/address/${address}`
	)
)

export const getOverview = () => (
	sourceGetJson<FilfoxOverview>(
		binding,
		`${baseUrl}/overview`
	)
)

export const getDeals = ({
	page,
	pageSize,
}: {
	page: number
	pageSize: number
}) => (
	sourceGetJson<FilfoxDealsPage>(
		binding,
		`${baseUrl}/deal/list?pageSize=${pageSize.toString()}&page=${page.toString()}`
	)
)

export const getDeal = ({
	dealId,
}: {
	dealId: bigint
}) => (
	sourceGetJson<FilfoxDeal>(
		binding,
		`${baseUrl}/deal/${dealId.toString()}`
	)
)
