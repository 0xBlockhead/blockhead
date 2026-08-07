export type SidecarBlockEvent = {
	method:
		| string
		| {
			pallet: string
			method: string
		}
	data?: unknown
	extrinsicIndex?: number
}

export type SidecarExtrinsic = {
	method: {
		pallet: string
		method: string
	}
	signature?: {
		signer?:
			| string
			| {
				id?: string
				address?: string
			}
	} | null
	hash?: string
	events?: SidecarBlockEvent[]
	success?: boolean
}

export type SidecarBlock = {
	number: string
	hash: string
	parentHash: string
	stateRoot: string
	extrinsicsRoot: string
	authorId?: string
	logs?: unknown
	onInitialize?: {
		events?: SidecarBlockEvent[]
	}
	extrinsics: SidecarExtrinsic[]
	onFinalize?: {
		events?: SidecarBlockEvent[]
	}
}

export type SidecarBlockHeader = {
	number: string
	parentHash: string
	stateRoot: string
	extrinsicsRoot: string
	digest?: unknown
}

export type SidecarBlockExtrinsic = {
	at: {
		hash: string
		height: string
	}
	extrinsic: SidecarExtrinsic
}

export type SidecarAccountBalanceInfo = {
	at: {
		hash: string
		height: string
	}
	nonce: string
	tokenSymbol: string
	free: string
	reserved: string
	frozen?: string
	miscFrozen?: string
	feeFrozen?: string
	transferable?: string
}

export type SidecarRuntimeMetadata = {
	pallets: {
		name: string
		index?: number | string
	}[]
}

export type SidecarRuntimeSpec = {
	at: {
		hash: string
		height: string
	}
	specName: string
	implName?: string
	authoringVersion: number
	specVersion: number
	implVersion?: number
	transactionVersion?: number
	stateVersion?: number
}

export type SidecarNodeVersion = {
	clientVersion?: string
	clientImplName?: string
	chain?: string
}

export type SidecarStakingValidators = {
	at?: {
		hash?: string
		height?: string
	}
	validators?: {
		accountId?: string
		address?: string
		stashId?: string
		controllerId?: string
		commission?: string | number
		totalStake?: string
	}[]
}

export type SidecarAccountAssetBalance = {
	assetId: string | number
	balance: string
	isFrozen?: boolean
	isSufficient?: boolean
}

export type SidecarAccountAssetBalances = {
	at: {
		hash: string
		height: string
	}
	assets: SidecarAccountAssetBalance[]
}

export type SidecarAccountForeignAssetBalance = {
	multiLocation: unknown
	balance: string
	isFrozen?: boolean
	isSufficient?: boolean
}

export type SidecarAccountForeignAssetBalances = {
	at: {
		hash: string
		height: string
	}
	foreignAssets: SidecarAccountForeignAssetBalance[]
}

export type SidecarAssetInfo = {
	at: {
		hash: string
		height: string
	}
	owner: string
	issuer: string
	admin: string
	freezer: string
	supply: string
	deposit: string
	minBalance: string
	isSufficient: boolean
	accounts: string
	sufficients: string
	approvals: string
	status: string
	name: string
	symbol: string
	decimals: number
	isFrozen: boolean
}

export type SidecarForeignAssetInfo = SidecarAssetInfo & {
	multiLocation: unknown
}

export type SidecarForeignAssets = {
	at: {
		hash: string
		height: string
	}
	items: SidecarForeignAssetInfo[]
}

export type SidecarAhmInfo = {
	relay: {
		startBlock: string
		endBlock: string
	}
	assetHub: {
		startBlock: string
		endBlock: string
	}
}

export type SidecarNodeNetwork = {
	nodeRoles?: unknown
	numPeers: string
	isSyncing: boolean
	shouldHavePeers: boolean
	localPeerId?: string
	localListenAddresses?: string[]
	peersInfo?: unknown
}

export type SidecarAccountStakingInfo = {
	at: {
		hash: string
		height: string
	}
	rewardDestination?: string
	controller?: string
	numSlashingSpans?: string | null
	nominations?: unknown
	staking?: unknown
}

export type SidecarOngoingReferendum = {
	id: string
	submitted?: string
	enactment?: string | {
		at?: string
		after?: string
	}
	deciding?: {
		since?: string
		confirming?: string | null
	}
	decisionDeposit?: {
		who?: string
		amount?: string
	}
}

export type SidecarOngoingReferenda = {
	at: {
		hash: string
		height: string
	}
	referenda: SidecarOngoingReferendum[]
}

export type SidecarTransactionMaterial = {
	at: {
		hash: string
		height: string
	}
	genesisHash: string
	chainName: string
	specName: string
	specVersion: string
	txVersion: string
	metadata?: string
}
