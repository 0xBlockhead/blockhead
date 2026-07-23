export type CircleCctpMessageStatus =
	| 'complete'
	| 'pending'

export type CircleCctpMessage = {
	message: string
	eventNonce: string
	attestation: string | null
	decodedMessage: {
		sourceDomain: string
		destinationDomain: string
		nonce: string
		sender: string
		recipient: string
		destinationCaller: string
		minFinalityThreshold?: number
		finalityThresholdExecuted?: number
		messageBody: string
		decodedMessageBody: {
			burnToken: string
			mintRecipient: string
			amount: string
			messageSender: string
			maxFee?: string
			feeExecuted?: string
			expirationBlock?: string
			hookData?: string
		}
	}
	cctpVersion: number
	status: CircleCctpMessageStatus
	delayReason?: string
	forwardState?: string
	forwardTxHash?: string
	requestId?: string
}

export type CircleCctpMessagesResponse = {
	messages: CircleCctpMessage[]
	sourceTxHash: string
}

export type CircleCctpMessageSubject =
	| {
		transactionHash: string
		nonce?: never
	}
	| {
		transactionHash?: never
		nonce: string
	}
