export type HeliusEnhancedTransaction = {
	signature: string
	slot: number
	timestamp?: number
	fee?: number
	feePayer?: string
	transactionError?: string | null
	instructions?: HeliusInstruction[]
}

export type HeliusInstruction = {
	programId: string
	accounts?: string[]
	data?: string
}
