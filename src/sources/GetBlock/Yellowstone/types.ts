export type GetBlockYellowstoneCommitment =
	| 'processed'
	| 'confirmed'
	| 'finalized'

export type GetBlockYellowstoneAccountDatasizeFilter = {
	datasize: number
}

export type GetBlockYellowstoneAccountRequest = {
	accounts?: string[]
	owners?: string[]
	filters?: GetBlockYellowstoneAccountDatasizeFilter[]
	commitment: GetBlockYellowstoneCommitment
}

export type GetBlockYellowstoneAccountUpdate = {
	account: string
	slot: string
	timestampMs: number
	lamports: string
	ownerProgramId: string
	executable: boolean
	rentEpoch: string
	spaceBytes: number
	dataEncoding: 'base64'
	data: string
	isStartup: boolean
}

export type GetBlockYellowstoneSubscribeUpdate =
	| {
		kind: 'account'
		update: GetBlockYellowstoneAccountUpdate
	}
	| {
		kind: 'ping'
	}
	| {
		kind: 'pong'
		id: number
	}
