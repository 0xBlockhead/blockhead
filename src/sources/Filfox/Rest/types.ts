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

export type FilfoxMessage = {
	cid: string
	height?: number
	timestamp?: number
	blocks?: string[]
	from: string
	to: string
	nonce: number
	value: string
	method: string
	methodNumber?: number
	gasLimit?: number
}

export type FilfoxMessagesPage = {
	totalCount: number
	messages: FilfoxMessage[]
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
