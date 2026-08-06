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

export type SidecarBlock = {
	number: string
	hash: string
	parentHash: string
	stateRoot: string
	extrinsicsRoot: string
	authorId?: string
	onInitialize?: {
		events?: SidecarBlockEvent[]
	}
	extrinsics: {
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
	}[]
	onFinalize?: {
		events?: SidecarBlockEvent[]
	}
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
