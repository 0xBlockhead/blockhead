import type { JsonValue } from '$/typescript/JsonValue.ts'

export type SolanaRpcBlock = {
	blockHeight?: number
	blockTime?: number
	blockhash: string
	parentSlot: number
	previousBlockhash: string
	transactions: SolanaRpcTransactionWithMeta[]
}

export type SolanaRpcTransactionWithMeta = {
	transaction: {
		signatures: string[]
		message: SolanaRpcMessage
	}
	meta?: {
		err: JsonValue
		fee: number
		computeUnitsConsumed?: number
		innerInstructions?: {
			index: number
			instructions: SolanaRpcInstruction[]
		}[]
	}
}

export type SolanaRpcTransaction = SolanaRpcTransactionWithMeta & {
	slot: number
	blockTime?: number
}

export type SolanaRpcMessage = {
	accountKeys: {
		pubkey: string
		signer: boolean
		writable: boolean
		source?: string
	}[]
	instructions: SolanaRpcInstruction[]
}

export type SolanaRpcInstruction = {
	programId: string
	program?: string
	parsed?: {
		type?: string
		info?: {
			account?: string
			destination?: string
			mint?: string
			newAccount?: string
			source?: string
		}
	}
	accounts?: string[]
	data?: string
	stackHeight?: number
}

export type SolanaRpcAccountInfo = {
	value: {
		lamports: number
		owner: string
		executable: boolean
		rentEpoch: number
		data: [string, string]
	} | null
}

export type SolanaRpcParsedTokenMintAccountInfo = {
	value: {
		data: {
			parsed: {
				info: {
					supply: string
					decimals: number
					isInitialized?: boolean
					mintAuthority?: string | null
					freezeAuthority?: string | null
				}
			}
		}
	} | null
}

export type SolanaRpcParsedTokenAccountInfo = {
	value: {
		data: {
			parsed: {
				info: {
					mint: string
					owner: string
					tokenAmount: {
						amount: string
						decimals: number
						uiAmountString?: string
					}
					state?: string
					isNative?: boolean
					delegate?: string
					delegatedAmount?: {
						amount: string
					}
					rentExemptReserve?: {
						amount: string
					}
					closeAuthority?: string
				}
			}
		}
	} | null
}

export type SolanaRpcSignatureStatus = {
	slot: number
	confirmations: number | null
	err: JsonValue
	confirmationStatus?: string
}

export type SolanaRpcCommitment = 'confirmed' | 'finalized'

export type SolanaRpcAddressSignature = {
	signature: string
	slot: number
	err: JsonValue
	memo: string | null
	blockTime: number | null
	confirmationStatus: SolanaRpcCommitment | null
}

export type SolanaRpcVoteAccounts = {
	current: SolanaRpcVoteAccount[]
	delinquent: SolanaRpcVoteAccount[]
}

export type SolanaRpcVoteAccount = {
	activatedStake: number
	commission: number
	epochVoteAccount: boolean
	epochCredits?: JsonValue
	lastVote: number
	nodePubkey: string
	rootSlot: number
	votePubkey: string
}

export type SolanaRpcEpochInfo = {
	absoluteSlot: number
	blockHeight: number
	epoch: number
	slotIndex: number
	slotsInEpoch: number
	transactionCount?: number
}

export type SolanaRpcVersion = {
	'solana-core': string
	'feature-set'?: number
}
