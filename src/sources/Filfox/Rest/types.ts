export type FilfoxTipset = {
	height: number
	timestamp: number
	blocks: {
		cid: string
		miner: string
		winCount?: number
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
	actor?: string
	balance: string
	miner?: {
		owner?: FilfoxAddressBalance
		worker?: FilfoxAddressBalance
		peerId?: string
		qualityAdjPower: string
	}
}

export type FilfoxAddressBalance = {
	address: string
	balance: string
}

export type FilfoxOverview = {
	height: number
	timestamp: number
}
