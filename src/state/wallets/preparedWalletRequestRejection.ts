import { Source } from '$/sources/Source.ts'
import type { PreparedWalletRequestObservation } from './walletRequestPreparation.ts'


export type PreparedTransactionWalletRequest = {
	id: string
	requestKind: string
	requestMethod: string
	requestedAt: number
	submittedAt?: number
}

/** Prepared observation plus the durable clock used to order a later reject timestamp. */
export type PreparedWalletRequestRejectionObservation = PreparedWalletRequestObservation & {
	timestampMs: number
}


export const preparedWalletRequestRejection = ({
	request,
	preparedObservation,
	rejectedAt,
}: {
	request: PreparedTransactionWalletRequest
	preparedObservation: PreparedWalletRequestRejectionObservation
	rejectedAt: number
}) => {
	if (request.requestKind !== 'transaction')
		throw new Error('Wallet request rejection requires a transaction request.')

	if (preparedObservation.status !== 'prepared')
		throw new Error('Wallet request rejection requires a prepared request.')

	if (request.submittedAt !== undefined)
		throw new Error('Submitted wallet requests cannot be rejected as prepared.')

	if (rejectedAt <= preparedObservation.timestampMs)
		throw new Error('Wallet request rejection must be later than preparation.')

	return {
		walletRequestSelector: {
			id: request.id,
		},
		observation: {
			timestampMs: rejectedAt,
			source: Source.Local_Internal,
			status: 'failed',
			error: 'Wallet signing request rejected',
		},
	}
}
