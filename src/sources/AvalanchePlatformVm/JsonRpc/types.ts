export type AvalanchePlatformVmHeight = {
	height: string
}

export type AvalanchePlatformVmBlockchain = {
	id: string
	name: string
	subnetID: string
	vmID: string
}

export type AvalanchePlatformVmBlockchains = {
	blockchains: AvalanchePlatformVmBlockchain[]
}

export type AvalanchePlatformVmSubnet = {
	id: string
	controlKeys: string[]
	threshold: string
}

export type AvalanchePlatformVmSubnets = {
	subnets: AvalanchePlatformVmSubnet[]
}

export type AvalanchePlatformVmOutputOwner = {
	locktime: string
	threshold: string
	addresses: string[]
}

export type AvalanchePlatformVmDelegator = {
	txID: string
	startTime: string
	endTime: string
	weight: string
	nodeID: string
	rewardOwner: AvalanchePlatformVmOutputOwner
	potentialReward: string
}

export type AvalanchePlatformVmValidator = {
	txID?: string
	startTime: string
	endTime?: string
	nodeID: string
	weight: string
	validationID?: string
	publicKey?: string
	validationRewardOwner?: AvalanchePlatformVmOutputOwner
	delegationRewardOwner?: AvalanchePlatformVmOutputOwner
	potentialReward?: string
	delegationFee?: string
	uptime?: string
	connected?: boolean
	delegatorCount?: string
	delegatorWeight?: string
	delegators?: AvalanchePlatformVmDelegator[]
}

export type AvalanchePlatformVmValidators = {
	validators: AvalanchePlatformVmValidator[]
}

export type AvalanchePlatformVmBalance = {
	balance: string
	unlocked: string
	lockedStakeable: string
	lockedNotStakeable: string
	balances: Record<string, string>
	unlockeds: Record<string, string>
	lockedStakeables: Record<string, string>
	lockedNotStakeables: Record<string, string>
	utxoIDs: {
		txID: string
		outputIndex: number
	}[]
}

export type AvalanchePlatformVmStake = {
	staked: string
	stakeds: Record<string, string>
	stakedOutputs: string[]
	encoding: string
}

export type AvalanchePlatformVmUtxoIndex = {
	address: string
	utxo: string
}

export type AvalanchePlatformVmUtxos = {
	numFetched: string
	utxos: string[]
	endIndex: AvalanchePlatformVmUtxoIndex
	encoding: string
}

export type AvalanchePlatformVmTxStatus = {
	status: 'Committed' | 'Processing' | 'Dropped' | 'Unknown'
	reason?: string
}

export type AvalanchePlatformVmJsonBlock = {
	parentID: string
	height: number | string
	id: string
	time?: number | string
	txs?: AvalanchePlatformVmJsonTx[]
	tx?: AvalanchePlatformVmJsonTx
}

export type AvalanchePlatformVmBlock = {
	block: string | AvalanchePlatformVmJsonBlock
	encoding: string
}

export type AvalanchePlatformVmJsonTxUnsigned = {
	networkID?: number | string
	blockchainID?: string
	memo?: string
	validator?: {
		nodeID: string
		start: number | string
		end: number | string
		weight: number | string
	}
	stake?: unknown[]
	shares?: number | string
	rewardsOwner?: unknown
	subnetID?: string
	sourceChain?: string
	destinationChain?: string
	subnetOwners?: unknown
	chainName?: string
	vmID?: string
	genesisData?: unknown
	time?: number | string
}

export type AvalanchePlatformVmJsonTx = {
	unsignedTx: AvalanchePlatformVmJsonTxUnsigned
	id?: string
	credentials?: unknown[]
}

export type AvalanchePlatformVmTx = {
	tx: string | AvalanchePlatformVmJsonTx
	encoding: string
}

export const avalanchePrimaryNetworkSubnetId = '11111111111111111111111111111111LpoYY' as const
