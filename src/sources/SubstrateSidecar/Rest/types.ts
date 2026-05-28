export type SidecarBlock = {
	number: string
	hash: string
	parentHash: string
	stateRoot: string
	extrinsicsRoot: string
	onInitialize?: {
		events?: {
			method: string
		}[]
	}
	extrinsics: {
		method: {
			pallet: string
			method: string
		}
		signature?: {
			signer?: string
		}
		hash?: string
		events?: {
			method: string
		}[]
		success?: boolean
	}[]
	onFinalize?: {
		events?: {
			method: string
		}[]
	}
}

export type SidecarAccountBalanceInfo = {
	nonce?: string | number
	free?: string
}

export type SidecarRuntimeMetadata = {
	pallets: {
		name: string
		index?: number
	}[]
}

export type SidecarStakingValidators = {
	validators?: {
		accountId?: string
		address?: string
		stashId?: string
		controllerId?: string
		commission?: string | number
		totalStake?: string
	}[]
}
