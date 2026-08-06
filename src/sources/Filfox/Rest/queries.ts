import {
	firstHttpUrlForBinding,
	sourceGetJson,
} from '$/sources/_runtime/http.ts'
import {
	filfoxAddressWire,
	filfoxBlockWire,
	filfoxDealWire,
	filfoxDealsPageWire,
	filfoxOverviewWire,
	filfoxTipsetWire,
	type FilfoxMessage,
	type FilfoxMessageEvent,
	type FilfoxMessagesPage,
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
	'tokenTransfers?': arktype({
		from: 'string',
		to: 'string',
		value: 'string',
		'type?': 'string',
		'token?': 'string',
		'tokenId?': 'string',
		'tokenName?': 'string',
		'tokenSymbol?': 'string',
		'fromId?': 'string',
		'toId?': 'string',
	}).array(),
})

const filfoxMessageEventWire = arktype({
	address: 'string',
	'name?': 'string',
	data: 'string',
	topics: 'string[]',
	'removed?': 'boolean',
	'logIndex?': 'number.integer',
})

const filfoxMessageSubcallWire = arktype({
	from: 'string',
	'fromId?': 'string',
	'fromActor?': 'string',
	to: 'string',
	'toId?': 'string',
	'toActor?': 'string',
	value: 'string',
	method: 'string',
	'methodNumber?': 'number.integer',
	'params?': 'string',
	'receipt?': filfoxMessageReceiptWire,
	// Nested trees validated one level deep; deeper nests stay typed in TS.
	'subcalls?': arktype({
		from: 'string',
		'fromId?': 'string',
		'fromActor?': 'string',
		to: 'string',
		'toId?': 'string',
		'toActor?': 'string',
		value: 'string',
		method: 'string',
		'methodNumber?': 'number.integer',
		'params?': 'string',
		'receipt?': filfoxMessageReceiptWire,
		'subcalls?': 'unknown[]',
	}).array(),
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

const assertMessageEventsEnvelope = (response: unknown): FilfoxMessageEvent[] => {
	try {
		return filfoxMessageEventWire.array().assert(response)
	} catch {
		throw new Error(`${Source.Filfox_Rest}: invalid message events response envelope`)
	}
}

const assertMessageSubcallsEnvelope = (response: unknown) => {
	try {
		return filfoxMessageSubcallWire.array().assert(response)
	} catch {
		throw new Error(`${Source.Filfox_Rest}: invalid message subcalls response envelope`)
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

const assertEnvelope = <_Value>(
	label: string,
	wire: {
		assert: (value: unknown) => _Value
	},
	response: unknown
) => {
	try {
		return wire.assert(response)
	} catch {
		throw new Error(`${Source.Filfox_Rest}: invalid ${label} response envelope`)
	}
}

export const getTipset = ({
	height,
}: {
	height: bigint
}) => (
	sourceGetJson<unknown>(
		binding,
		`${baseUrl}/tipset/${height.toString()}`
	)
		.then((response) => {
			const tipset = assertEnvelope(
				'tipset',
				filfoxTipsetWire,
				response
			)
			if (BigInt(tipset.height) !== height)
				throw new Error(`${Source.Filfox_Rest}: tipset height mismatch ${String(tipset.height)} !== ${height.toString()}`)

			return tipset
		})
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
 * EVM-style event logs for an executed message (`eventLogCount` on detail).
 * @see https://filfox.info/api/v1/message/{cid}/events
 */
export const getMessageEvents = ({
	messageCid,
}: {
	messageCid: string
}) => {
	if (messageCid === '')
		throw new Error(`${Source.Filfox_Rest}: empty message cid`)

	return sourceGetJson<unknown>(
		binding,
		`${baseUrl}/message/${messageCid}/events`
	)
		.then(assertMessageEventsEnvelope)
}

/**
 * Nested actor subcalls for an executed message (`subcallCount` on detail).
 * @see https://filfox.info/api/v1/message/{cid}/subcalls
 */
export const getMessageSubcalls = ({
	messageCid,
}: {
	messageCid: string
}) => {
	if (messageCid === '')
		throw new Error(`${Source.Filfox_Rest}: empty message cid`)

	return sourceGetJson<unknown>(
		binding,
		`${baseUrl}/message/${messageCid}/subcalls`
	)
		.then(assertMessageSubcallsEnvelope)
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
}) => {
	if (blockCid === '')
		throw new Error(`${Source.Filfox_Rest}: empty block cid`)

	return sourceGetJson<unknown>(
		binding,
		`${baseUrl}/block/${blockCid}`
	)
		.then((response) => {
			const block = assertEnvelope(
				'block',
				filfoxBlockWire,
				response
			)
			if (block.cid !== blockCid)
				throw new Error(`${Source.Filfox_Rest}: block cid mismatch ${block.cid} !== ${blockCid}`)

			return block
		})
}

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
}) => {
	if (address === '')
		throw new Error(`${Source.Filfox_Rest}: empty address`)

	return sourceGetJson<unknown>(
		binding,
		`${baseUrl}/address/${address}`
	)
		.then((response) => {
			const row = assertEnvelope(
				'address',
				filfoxAddressWire,
				response
			)
			if (
				row.address !== address
				&& row.id !== address
				&& row.robust !== address
			)
				throw new Error(`${Source.Filfox_Rest}: address identity mismatch`)

			return row
		})
}

export const getOverview = () => (
	sourceGetJson<unknown>(
		binding,
		`${baseUrl}/overview`
	)
		.then((response) => (
			assertEnvelope(
				'overview',
				filfoxOverviewWire,
				response
			)
		))
)

export const getDeals = ({
	page,
	pageSize,
}: {
	page: number
	pageSize: number
}) => {
	assertPage(page)
	assertPageSize(pageSize)
	return sourceGetJson<unknown>(
		binding,
		`${baseUrl}/deal/list?pageSize=${pageSize.toString()}&page=${page.toString()}`
	)
		.then((response) => (
			assertEnvelope(
				'deals',
				filfoxDealsPageWire,
				response
			)
		))
}

export const getDeal = ({
	dealId,
}: {
	dealId: bigint
}) => {
	if (dealId < 0n)
		throw new Error(`${Source.Filfox_Rest}: invalid deal id`)

	return sourceGetJson<unknown>(
		binding,
		`${baseUrl}/deal/${dealId.toString()}`
	)
		.then((response) => {
			const deal = assertEnvelope(
				'deal',
				filfoxDealWire,
				response
			)
			if (BigInt(deal.id) !== dealId)
				throw new Error(`${Source.Filfox_Rest}: deal id mismatch ${String(deal.id)} !== ${dealId.toString()}`)

			return deal
		})
}
