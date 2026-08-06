import {
	type as arktype,
} from 'arktype'


const cidLink = arktype({
	'/': 'string > 0',
})

const nonNegativeInteger = arktype('number.integer >= 0')
const integer = arktype('number.integer')
const nonEmptyString = arktype('string > 0')
const attoFil = arktype('/^\\d+$/')

export const lotusTipsetKey = cidLink.array()

export const lotusBlockHeader = arktype({
	Miner: nonEmptyString,
	'Ticket?': {
		'VRFProof?': 'string',
	},
	'ElectionProof?': {
		'WinCount?': integer,
		'VRFProof?': 'string',
	},
	Parents: cidLink.array(),
	ParentWeight: attoFil,
	Height: nonNegativeInteger,
	Timestamp: nonNegativeInteger,
	Messages: cidLink,
})

export const lotusTipset = arktype({
	Cids: cidLink.array(),
	Blocks: lotusBlockHeader.array(),
	Height: nonNegativeInteger,
})

export const lotusVersion = arktype({
	Version: nonEmptyString,
	APIVersion: nonNegativeInteger,
	BlockDelay: nonNegativeInteger,
	Agent: nonEmptyString,
})

export const lotusMessage = arktype({
	Version: nonNegativeInteger,
	To: nonEmptyString,
	From: nonEmptyString,
	Nonce: nonNegativeInteger,
	Value: attoFil,
	GasLimit: nonNegativeInteger,
	GasFeeCap: attoFil,
	GasPremium: attoFil,
	Method: nonNegativeInteger,
	Params: 'string',
})

export const lotusActor = arktype({
	Code: cidLink,
	Head: cidLink,
	Nonce: nonNegativeInteger,
	Balance: attoFil,
})

export const lotusSectorOnChainInfo = arktype({
	SectorNumber: nonNegativeInteger,
	'SealedCID?': cidLink,
	Activation: nonNegativeInteger,
	Expiration: nonNegativeInteger,
})

const lotusPowerClaim = arktype({
	RawBytePower: attoFil,
	QualityAdjPower: attoFil,
})

export const lotusMinerPower = arktype({
	MinerPower: lotusPowerClaim,
	TotalPower: lotusPowerClaim,
	HasMinPower: 'boolean',
})

export const lotusMinerSectorCount = arktype({
	Live: nonNegativeInteger,
	Active: nonNegativeInteger,
	Faulty: nonNegativeInteger,
	Total: nonNegativeInteger,
})

export const lotusMinerInfo = arktype({
	Owner: nonEmptyString,
	Worker: nonEmptyString,
	'PeerId?': 'string',
})

export const lotusMarketDeal = arktype({
	Proposal: {
		PieceCID: cidLink,
		PieceSize: nonNegativeInteger,
		VerifiedDeal: 'boolean',
		Client: nonEmptyString,
		Provider: nonEmptyString,
		'Label?': 'string',
		StartEpoch: nonNegativeInteger,
		EndEpoch: nonNegativeInteger,
		StoragePricePerEpoch: attoFil,
		ProviderCollateral: attoFil,
		ClientCollateral: attoFil,
	},
	State: {
		SectorStartEpoch: integer,
		LastUpdatedEpoch: integer,
		SlashEpoch: integer,
	},
})

export const lotusNetworkVersion = nonNegativeInteger
export const lotusIdAddress = nonEmptyString

export type LotusTipset = typeof lotusTipset.infer
export type LotusTipsetKey = typeof lotusTipsetKey.infer
export type LotusVersion = typeof lotusVersion.infer
export type LotusBlockHeader = typeof lotusBlockHeader.infer
export type LotusMessage = typeof lotusMessage.infer
export type LotusActor = typeof lotusActor.infer
export type LotusSectorOnChainInfo = typeof lotusSectorOnChainInfo.infer
export type LotusMinerPower = typeof lotusMinerPower.infer
export type LotusMinerSectorCount = typeof lotusMinerSectorCount.infer
export type LotusMinerInfo = typeof lotusMinerInfo.infer
export type LotusMarketDeal = typeof lotusMarketDeal.infer
