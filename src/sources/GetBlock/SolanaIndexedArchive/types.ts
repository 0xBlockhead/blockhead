export enum GetBlockSolanaIndexedArchiveResolution {
	Complete = 'Complete',
	Empty = 'Empty',
	Partial = 'Partial',
	Unsupported = 'Unsupported',
}

export type GetBlockSolanaIndexedArchiveInstruction = {
	programId: string
	accounts: string[]
	data: string
	stackHeight: number | null
}

export type GetBlockSolanaIndexedArchiveTransaction = {
	signature: string
	slot: string
	blockTimeMs: number | null
	feePayer: string
	feeLamports: string | null
	computeUnitsConsumed: number | null
	status: 'success' | 'failed' | null
	instructions: GetBlockSolanaIndexedArchiveInstruction[]
}

export type GetBlockSolanaIndexedArchiveRequest = {
	signature: string
	include: {
		instructions: true
	}
}

export type GetBlockSolanaIndexedArchiveResponse = {
	resolution: GetBlockSolanaIndexedArchiveResolution
	transaction: GetBlockSolanaIndexedArchiveTransaction | null
	missingFields: string[]
}
