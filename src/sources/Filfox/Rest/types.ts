export type FilfoxTipset = {
	height: number
	timestamp: number
	messageCount?: number
	blocks: {
		cid: string
		miner: string
		messageCount?: number
		winCount?: number
		reward?: string
		penalty?: string
	}[]
}

export type FilfoxBlock = {
	cid: string
	height: number
	timestamp: number
	miner: string
	winCount?: number
	parents: string[]
	parentWeight: string
	messageCount: number
}

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
	tokenTransfers?: unknown[]
}

export type FilfoxMessagesPage = {
	totalCount: number
	messages: FilfoxMessageListItem[]
	methods?: unknown[]
}

export type FilfoxAddress = {
	id: string
	address: string
	robust?: string
	actor?: string
	balance: string
	messageCount?: number
	timestamp?: number
	miner?: {
		owner?: FilfoxAddressBalance
		worker?: FilfoxAddressBalance
		beneficiary?: FilfoxAddressBalance
		peerId?: string
		rawBytePower?: string
		qualityAdjPower: string
		networkRawBytePower?: string
		networkQualityAdjPower?: string
		sectors?: {
			live: number
			active: number
			faulty: number
			recovering?: number
		}
	}
}

export type FilfoxAddressBalance = {
	address: string
	balance: string
}

export type FilfoxOverview = {
	height: number
	timestamp: number
	totalRawBytePower?: string
	totalQualityAdjPower?: string
	activeMiners?: number
	baseFee?: string
	averageTipsetInterval?: number
	averageTipsetBlocks?: number
	dailyMessages?: number
}

export type FilfoxDealListItem = {
	id: number
	height: number
	timestamp: number
	pieceSize: number
	verifiedDeal: boolean
	client: string
	provider: string
	startEpoch: number
	startTimestamp: number
	endEpoch: number
	endTimestamp: number
	stroagePrice: string
}

export type FilfoxDealsPage = {
	totalCount: number
	deals: FilfoxDealListItem[]
}

export type FilfoxDeal = FilfoxDealListItem & {
	pieceCid: string
	clientTag: {
		name: string
		signed: boolean
	}
	providerTag: {
		name: string
		signed: boolean
	}
	storagePricePerEpoch: string
	clientCollateral: string
	providerCollateral: string
}
