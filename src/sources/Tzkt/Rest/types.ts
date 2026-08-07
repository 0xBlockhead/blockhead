import {
	type as arktype,
	type Type,
} from 'arktype'

export const tzktAddressWire = arktype({
	address: 'string > 0',
	'alias?': 'string',
})

export type TzktAddress = typeof tzktAddressWire.infer

export const tzktAccountWire = arktype({
	address: 'string > 0',
	type: 'string > 0',
	balance: 'number.integer >= 0',
	'counter?': 'number.integer >= 0',
	'delegate?': tzktAddressWire,
	'revealed?': 'boolean',
	'publicKey?': 'string',
	'firstLevel?': 'number.integer >= 0',
	'lastLevel?': 'number.integer >= 0',
	firstActivity: 'number.integer >= 0',
	lastActivity: 'number.integer >= 0',
	'firstActivityTime?': 'string',
	lastActivityTime: 'string',
})

export type TzktAccount = typeof tzktAccountWire.infer

export const tzktBigMapWire = arktype({
	ptr: 'number.integer >= 0',
	contract: tzktAddressWire,
	path: 'string',
	'tags?': 'string[]',
	active: 'boolean',
	firstLevel: 'number.integer >= 0',
	lastLevel: 'number.integer >= 0',
	totalKeys: 'number.integer >= 0',
	activeKeys: 'number.integer >= 0',
	updates: 'number.integer >= 0',
	'keyType?': 'unknown',
	'valueType?': 'unknown',
})

export type TzktBigMap = typeof tzktBigMapWire.infer

export const tzktBigMapKeyWire = arktype({
	id: 'number.integer >= 0',
	active: 'boolean',
	hash: 'string > 0',
	key: 'unknown',
	value: 'unknown',
	firstLevel: 'number.integer >= 0',
	lastLevel: 'number.integer >= 0',
	updates: 'number.integer >= 0',
})

export type TzktBigMapKey = typeof tzktBigMapKeyWire.infer

export const tzktBigMapUpdateWire = arktype({
	id: 'number.integer >= 0',
	level: 'number.integer >= 0',
	timestamp: 'string',
	bigmap: 'number.integer >= 0',
	'contract?': tzktAddressWire,
	'path?': 'string',
	action: 'string > 0',
	'content?': {
		hash: 'string > 0',
		'key?': 'unknown',
		'value?': 'unknown',
	},
})

export type TzktBigMapUpdate = typeof tzktBigMapUpdateWire.infer

export const tzktBlockWire = arktype({
	level: 'number.integer >= 0',
	timestamp: 'string',
	hash: 'string > 0',
	'cycle?': 'number.integer',
	'proto?': 'number.integer',
	'payloadRound?': 'number.integer >= 0',
	'blockRound?': 'number.integer >= 0',
	'protocol?': 'string',
	'predecessor?': 'string',
	'payloadHash?': 'string',
	'operationsHash?': 'string',
	'fitness?': 'unknown',
	'baker?': tzktAddressWire,
	'proposer?': tzktAddressWire,
})

export type TzktBlock = typeof tzktBlockWire.infer

export const tzktContractWire = arktype({
	address: 'string > 0',
	'alias?': 'string',
	'kind?': 'string',
	'type?': 'string',
	'balance?': 'number.integer >= 0',
	'typeHash?': 'number.integer',
	'codeHash?': 'number.integer',
	'creator?': tzktAddressWire,
	'delegate?': tzktAddressWire,
	'firstActivity?': 'number.integer >= 0',
	'lastActivity?': 'number.integer >= 0',
	'firstActivityTime?': 'string',
	'lastActivityTime?': 'string',
})

export type TzktContract = typeof tzktContractWire.infer

export const tzktHeadWire = arktype({
	chain: 'string > 0',
	chainId: 'string > 0',
	cycle: 'number.integer >= 0',
	level: 'number.integer >= 0',
	hash: 'string > 0',
	protocol: 'string > 0',
	timestamp: 'string',
	synced: 'boolean',
	'knownLevel?': 'number.integer >= 0',
})

export type TzktHead = typeof tzktHeadWire.infer

export const tzktStatisticsWire = arktype({
	level: 'number.integer >= 0',
	timestamp: 'string',
	totalSupply: 'number.integer >= 0',
	'circulatingSupply?': 'number.integer >= 0',
	'totalBakers?': 'number.integer >= 0',
})

export type TzktStatistics = typeof tzktStatisticsWire.infer

export const tzktOperationWire = arktype({
	type: 'string > 0',
	id: 'number.integer >= 0',
	level: 'number.integer >= 0',
	timestamp: 'string',
	hash: 'string > 0',
	'block?': 'string',
	'counter?': 'number.integer >= 0',
	'nonce?': 'number.integer >= 0',
	'initiator?': tzktAddressWire,
	'sender?': tzktAddressWire,
	'target?': tzktAddressWire,
	'newDelegate?': tzktAddressWire,
	'originatedContract?': tzktAddressWire,
	'status?': 'string',
	'amount?': 'number.integer >= 0',
	'bakerFee?': 'number.integer >= 0',
	'storageFee?': 'number.integer >= 0',
	'allocationFee?': 'number.integer >= 0',
	'gasLimit?': 'number.integer >= 0',
	'gasUsed?': 'number.integer >= 0',
	'storageLimit?': 'number.integer >= 0',
	'storageUsed?': 'number.integer >= 0',
	'parameter?': {
		'entrypoint?': 'string',
		'value?': 'unknown',
	},
	'originatedContracts?': tzktAddressWire.array(),
})

export type TzktOperation = typeof tzktOperationWire.infer

export const tzktTokenMetadataWire = arktype({
	'name?': 'string',
	'symbol?': 'string',
	'decimals?': 'string | number.integer >= 0',
	'artifactUri?': 'string',
	'displayUri?': 'string',
	'thumbnailUri?': 'string',
})

export type TzktTokenMetadata = typeof tzktTokenMetadataWire.infer

export const tzktTokenWire = arktype({
	id: 'number.integer >= 0',
	contract: tzktAddressWire,
	tokenId: 'string',
	'standard?': 'string',
	'metadata?': tzktTokenMetadataWire,
	'totalSupply?': 'string',
	'holdersCount?': 'number.integer >= 0',
	'transfersCount?': 'number.integer >= 0',
	'firstLevel?': 'number.integer >= 0',
	'lastLevel?': 'number.integer >= 0',
	'metadataUri?': 'string',
})

export type TzktToken = typeof tzktTokenWire.infer

export const tzktTokenBalanceWire = arktype({
	id: 'number.integer >= 0',
	account: tzktAddressWire,
	token: tzktTokenWire,
	balance: 'string',
	firstLevel: 'number.integer >= 0',
	lastLevel: 'number.integer >= 0',
	transfersCount: 'number.integer >= 0',
})

export type TzktTokenBalance = typeof tzktTokenBalanceWire.infer

export const tzktTokenTransferWire = arktype({
	id: 'number.integer >= 0',
	level: 'number.integer >= 0',
	timestamp: 'string',
	token: tzktTokenWire,
	'from?': tzktAddressWire,
	'to?': tzktAddressWire,
	amount: 'string',
	'transactionId?': 'number.integer >= 0',
})

export type TzktTokenTransfer = typeof tzktTokenTransferWire.infer

export const tzktAddress = tzktAddressWire satisfies Type<TzktAddress>
export const tzktAccount = tzktAccountWire satisfies Type<TzktAccount>
export const tzktBigMap = tzktBigMapWire satisfies Type<TzktBigMap>
export const tzktBigMapKey = tzktBigMapKeyWire satisfies Type<TzktBigMapKey>
export const tzktBigMapUpdate = tzktBigMapUpdateWire satisfies Type<TzktBigMapUpdate>
export const tzktBlock = tzktBlockWire satisfies Type<TzktBlock>
export const tzktContract = tzktContractWire satisfies Type<TzktContract>
export const tzktHead = tzktHeadWire satisfies Type<TzktHead>
export const tzktStatistics = tzktStatisticsWire satisfies Type<TzktStatistics>
export const tzktOperation = tzktOperationWire satisfies Type<TzktOperation>
export const tzktToken = tzktTokenWire satisfies Type<TzktToken>
export const tzktTokenBalance = tzktTokenBalanceWire satisfies Type<TzktTokenBalance>
export const tzktTokenTransfer = tzktTokenTransferWire satisfies Type<TzktTokenTransfer>
