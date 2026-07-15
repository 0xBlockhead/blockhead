export type GetBlockYellowstoneAccountRequest = {
	accounts: string[]
	commitment: 'processed' | 'confirmed' | 'finalized'
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
