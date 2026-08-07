import { type as arktype } from 'arktype'


const nonNegativeInteger = arktype('number.integer >= 0')
const integer = arktype('number.integer')
const nonEmptyString = arktype('string > 0')
const attoFil = arktype('/^\\d+$/')


export const filfoxTipsetBlockWire = arktype({
	cid: nonEmptyString,
	miner: nonEmptyString,
	'messageCount?': nonNegativeInteger,
	'winCount?': integer,
	'reward?': 'string',
	'penalty?': 'string',
})

export const filfoxTipsetWire = arktype({
	height: nonNegativeInteger,
	timestamp: nonNegativeInteger,
	'messageCount?': nonNegativeInteger,
	blocks: filfoxTipsetBlockWire.array(),
})

export const filfoxBlockWire = arktype({
	cid: nonEmptyString,
	height: nonNegativeInteger,
	timestamp: nonNegativeInteger,
	miner: nonEmptyString,
	'winCount?': integer,
	parents: 'string[]',
	parentWeight: attoFil,
	messageCount: nonNegativeInteger,
})

export const filfoxAddressBalanceWire = arktype({
	address: nonEmptyString,
	balance: attoFil,
})

export const filfoxAddressWire = arktype({
	id: nonEmptyString,
	address: nonEmptyString,
	'robust?': 'string',
	'actor?': 'string',
	balance: attoFil,
	'messageCount?': nonNegativeInteger,
	'timestamp?': nonNegativeInteger,
	'miner?': {
		'owner?': filfoxAddressBalanceWire,
		'worker?': filfoxAddressBalanceWire,
		'beneficiary?': filfoxAddressBalanceWire,
		'peerId?': 'string',
		'rawBytePower?': attoFil,
		qualityAdjPower: attoFil,
		'networkRawBytePower?': attoFil,
		'networkQualityAdjPower?': attoFil,
		'sectors?': {
			live: nonNegativeInteger,
			active: nonNegativeInteger,
			faulty: nonNegativeInteger,
			'recovering?': nonNegativeInteger,
		},
	},
})

export const filfoxOverviewWire = arktype({
	height: nonNegativeInteger,
	timestamp: nonNegativeInteger,
	'totalRawBytePower?': attoFil,
	'totalQualityAdjPower?': attoFil,
	'totalRawBytePowerDelta?': 'string',
	'totalQualityAdjPowerDelta?': 'string',
	'activeMiners?': nonNegativeInteger,
	'activeMinersGrowth?': integer,
	'baseFee?': attoFil,
	'averageTipsetInterval?': 'number',
	'averageTipsetBlocks?': 'number',
	'averageTipsetWeightedBlocks?': 'number',
	'dailyMessages?': nonNegativeInteger,
	'blockReward?': attoFil,
	'burntSupply?': attoFil,
	'circulatingSupply?': attoFil,
	'totalSupply?': attoFil,
	'totalMaxSupply?': attoFil,
	'totalPledgeCollateral?': attoFil,
	'totalMarketPledge?': attoFil,
})

const filfoxDealTagWire = arktype({
	name: 'string',
	signed: 'boolean',
})

export const filfoxDealListItemWire = arktype({
	id: nonNegativeInteger,
	height: nonNegativeInteger,
	timestamp: nonNegativeInteger,
	pieceSize: nonNegativeInteger,
	verifiedDeal: 'boolean',
	client: nonEmptyString,
	provider: nonEmptyString,
	startEpoch: nonNegativeInteger,
	startTimestamp: nonNegativeInteger,
	endEpoch: nonNegativeInteger,
	endTimestamp: nonNegativeInteger,
	// Filfox wire typo — keep literal key.
	stroagePrice: attoFil,
})

export const filfoxDealsPageWire = arktype({
	totalCount: nonNegativeInteger,
	deals: filfoxDealListItemWire.array(),
})

export const filfoxDealWire = filfoxDealListItemWire.and(arktype({
	pieceCid: nonEmptyString,
	clientTag: filfoxDealTagWire,
	providerTag: filfoxDealTagWire,
	storagePricePerEpoch: attoFil,
	clientCollateral: attoFil,
	providerCollateral: attoFil,
}))

export type FilfoxTipset = typeof filfoxTipsetWire.infer
export type FilfoxBlock = typeof filfoxBlockWire.infer

/**
 * Receipt on Filfox message list/detail wires.
 * Detail includes `gasUsed`; list rows often omit it.
 */
export type FilfoxMessageReceipt = {
	exitCode: number
	return?: string
	gasUsed?: number
}

export type FilfoxMessageFee = {
	baseFeeBurn: string
	overEstimationBurn: string
	minerPenalty: string
	minerTip: string
	refund: string
}

export type FilfoxMessageTransfer = {
	from: string
	fromId?: string
	to: string
	toId?: string
	toTag?: {
		name: string
		signed: boolean
	}
	value: string
	type: string
}

/**
 * EVM-style log on `GET /message/{cid}/events` (count on detail as `eventLogCount`).
 */
export type FilfoxMessageEvent = {
	address: string
	name?: string
	data: string
	topics: string[]
	removed?: boolean
	logIndex?: number
}

/**
 * Nested actor call on `GET /message/{cid}/subcalls` (count on detail as `subcallCount`).
 * `receipt` mirrors message-list receipts (often omits `gasUsed`).
 */
export type FilfoxMessageSubcall = {
	from: string
	fromId?: string
	fromActor?: string
	to: string
	toId?: string
	toActor?: string
	value: string
	method: string
	methodNumber?: number
	params?: string
	receipt?: FilfoxMessageReceipt
	subcalls?: FilfoxMessageSubcall[]
}

/**
 * Token transfer rows on message detail (`tokenTransfers`).
 * Observed empty on many messages; typed from Filfox explorer token-transfer cards.
 */
export type FilfoxMessageTokenTransfer = {
	from: string
	to: string
	value: string
	type?: string
	token?: string
	tokenId?: string
	tokenName?: string
	tokenSymbol?: string
	fromId?: string
	toId?: string
}

/**
 * Shared message row fields from Filfox list surfaces
 * (`/message/list`, `/block/{cid}/messages`, `/address/{address}/messages`).
 * Observation clocks (`height` / `timestamp`) are present on included messages;
 * `blocks` is detail-only (`GET /message/{cid}`).
 */
export type FilfoxMessageListItem = {
	cid: string
	height?: number
	timestamp?: number
	from: string
	to: string
	nonce?: number
	value: string
	method: string
	methodNumber?: number
	evmMethod?: string
	params?: string
	receipt?: FilfoxMessageReceipt
	gasLimit?: number
}

/**
 * `GET /api/v1/message/{cid}` detail — includes tipset inclusion (`height` /
 * `timestamp` / `blocks`) and receipt-adjacent fee/transfer fields when executed.
 */
export type FilfoxMessage = FilfoxMessageListItem & {
	blocks?: string[]
	confirmations?: number
	version?: number
	fromId?: string
	fromActor?: string
	toId?: string
	toActor?: string
	nonce: number
	gasFeeCap?: string
	gasPremium?: string
	size?: number
	error?: string
	baseFee?: string
	fee?: FilfoxMessageFee
	transfers?: FilfoxMessageTransfer[]
	ethTransactionHash?: string
	eventLogCount?: number
	subcallCount?: number
	tokenTransfers?: FilfoxMessageTokenTransfer[]
}

export type FilfoxMessagesPage = {
	totalCount: number
	messages: FilfoxMessageListItem[]
	methods?: unknown[]
}

export type FilfoxAddress = typeof filfoxAddressWire.infer
export type FilfoxAddressBalance = typeof filfoxAddressBalanceWire.infer
export type FilfoxOverview = typeof filfoxOverviewWire.infer
export type FilfoxDealListItem = typeof filfoxDealListItemWire.infer
export type FilfoxDealsPage = typeof filfoxDealsPageWire.infer
export type FilfoxDeal = typeof filfoxDealWire.infer
