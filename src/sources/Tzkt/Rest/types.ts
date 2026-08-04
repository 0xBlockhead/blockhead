export type TzktAddress = {
	address: string
	alias?: string
}

export type TzktAccount = {
	address: string
	type: string
	balance: number
	counter?: number
	delegate?: TzktAddress
	revealed?: boolean
	publicKey?: string
	firstLevel: number
	lastLevel: number
	firstActivity: string
	lastActivity: string
}

export type TzktBigMap = {
	ptr: number
	contract: TzktAddress
	path: string
	tags?: string[]
	active: boolean
	firstLevel: number
	lastLevel: number
	totalKeys: number
	activeKeys: number
	updates: number
	keyType?: unknown
	valueType?: unknown
}

export type TzktBigMapKey = {
	id: number
	active: boolean
	hash: string
	key: unknown
	value: unknown
	firstLevel: number
	lastLevel: number
	updates: number
}

export type TzktBigMapUpdateContent = {
	hash: string
	key?: unknown
	value?: unknown
}

export type TzktBigMapUpdate = {
	id: number
	level: number
	timestamp: string
	bigmap: number
	contract?: TzktAddress
	path?: string
	action: string
	content?: TzktBigMapUpdateContent
}

export type TzktBlock = {
	level: number
	timestamp: string
	hash: string
	cycle?: number
	proto?: number
	payloadRound?: number
	blockRound?: number
	protocol?: string
	predecessor?: string
	payloadHash?: string
	operationsHash?: string
	fitness?: unknown
	baker?: TzktAddress
	proposer?: TzktAddress
}

export type TzktContract = {
	address: string
	alias?: string
	kind?: string
	type?: string
	balance?: number
	typeHash?: number
	codeHash?: number
	creator?: TzktAddress
	delegate?: TzktAddress
	firstActivity?: number
	lastActivity?: number
	firstActivityTime?: string
	lastActivityTime?: string
}

export type TzktHead = {
	chain: string
	chainId: string
	cycle: number
	level: number
	hash: string
	protocol: string
	timestamp: string
	synced: boolean
	knownLevel?: number
}

export type TzktStatistics = {
	level: number
	timestamp: string
	totalSupply: number
	circulatingSupply?: number
}

export type TzktOperation = {
	type: string
	id: number
	level: number
	timestamp: string
	hash: string
	block?: string
	counter?: number
	nonce?: number
	initiator?: TzktAddress
	sender?: TzktAddress
	target?: TzktAddress
	newDelegate?: TzktAddress
	originatedContract?: TzktAddress
	status?: string
	amount?: number
	bakerFee?: number
	storageFee?: number
	allocationFee?: number
	gasLimit?: number
	gasUsed?: number
	storageLimit?: number
	storageUsed?: number
	parameter?: {
		entrypoint?: string
		value?: unknown
	}
	originatedContracts?: TzktAddress[]
}

export type TzktTokenMetadata = {
	name?: string
	symbol?: string
	decimals?: string | number
	artifactUri?: string
	displayUri?: string
	thumbnailUri?: string
}

export type TzktToken = {
	id: number
	contract: TzktAddress
	tokenId: string
	standard?: string
	metadata?: TzktTokenMetadata
	totalSupply?: string
	holdersCount?: number
	transfersCount?: number
	firstLevel?: number
	lastLevel?: number
	metadataUri?: string
}

export type TzktTokenBalance = {
	id: number
	account: TzktAddress
	token: TzktToken
	balance: string
	firstLevel: number
	lastLevel: number
	transfersCount: number
}

export type TzktTokenTransfer = {
	id: number
	level: number
	timestamp: string
	token: TzktToken
	from?: TzktAddress
	to?: TzktAddress
	amount: string
	transactionId?: number
}
