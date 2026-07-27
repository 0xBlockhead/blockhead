import type { SourceBinding } from '$/sources/SourceBinding.ts'
import {
	firstHttpUrlForBinding,
	sourceGetJson,
} from '$/sources/_runtime/http.ts'
import type {
	SafeMultisigConfirmation,
	SafeMultisigTransaction,
	SafePage,
	SafeStatus,
} from '$/sources/SafeTransactionService/Rest/types.ts'

const assertAddress = (
	address: string,
	label: string
) => {
	if (!/^0x[0-9a-fA-F]{40}$/.test(address))
		throw new Error(`SafeTransactionService_Rest: invalid ${label}`)
}

const assertHash = (
	hash: string,
	label: string
) => {
	if (!/^0x[0-9a-fA-F]{64}$/.test(hash))
		throw new Error(`SafeTransactionService_Rest: invalid ${label}`)
}

const assertUnsignedDecimal = (
	value: string,
	label: string
) => {
	if (!/^(0|[1-9][0-9]*)$/.test(value))
		throw new Error(`SafeTransactionService_Rest: invalid ${label}`)
}

const assertPageNumber = (
	value: number,
	label: string,
	maximum: number
) => {
	if (!Number.isSafeInteger(value) || value < 0 || value > maximum)
		throw new Error(`SafeTransactionService_Rest: invalid ${label}`)
}

const request = <_Result>({
	binding,
	path,
}: {
	binding: SourceBinding
	path: string
}) => {
	return sourceGetJson<_Result>(
		binding,
		`${firstHttpUrlForBinding(binding).replace(/\/$/, '')}${path}`
	)
}

const assertConfirmation = (
	confirmation: SafeMultisigConfirmation,
	owners?: Set<string>
) => {
	assertAddress(confirmation.owner, 'confirmation owner')
	if (owners != null && !owners.has(confirmation.owner.toLowerCase()))
		throw new Error('SafeTransactionService_Rest: confirmation belongs to a non-owner')
	if (confirmation.transactionHash != null)
		assertHash(confirmation.transactionHash, 'confirmation transaction hash')
	if (!/^0x[0-9a-fA-F]+$/.test(confirmation.signature))
		throw new Error('SafeTransactionService_Rest: invalid confirmation signature')
}

const assertTransaction = (
	transaction: SafeMultisigTransaction,
	safeAddress: string
) => {
	if (transaction.safe.toLowerCase() !== safeAddress.toLowerCase())
		throw new Error('SafeTransactionService_Rest: transaction belongs to a different Safe')
	assertAddress(transaction.safe, 'transaction Safe')
	assertAddress(transaction.to, 'transaction recipient')
	assertAddress(transaction.gasToken, 'transaction gas token')
	assertAddress(transaction.refundReceiver, 'transaction refund receiver')
	assertHash(transaction.safeTxHash, 'Safe transaction hash')
	if (transaction.transactionHash != null)
		assertHash(transaction.transactionHash, 'execution transaction hash')
	for (const [value, label] of [
		[transaction.value, 'transaction value'],
		[transaction.safeTxGas, 'Safe transaction gas'],
		[transaction.baseGas, 'base gas'],
		[transaction.gasPrice, 'gas price'],
		[transaction.nonce, 'transaction nonce'],
	])
		assertUnsignedDecimal(value, label)
	assertPageNumber(transaction.confirmationsRequired, 'confirmation threshold', 1_000)
	const confirmingOwners = new Set<string>()
	for (const confirmation of transaction.confirmations) {
		assertConfirmation(confirmation)
		const owner = confirmation.owner.toLowerCase()
		if (confirmingOwners.has(owner))
			throw new Error('SafeTransactionService_Rest: transaction has duplicate owner confirmations')
		confirmingOwners.add(owner)
	}
}

export const isSafeNonceRejectionTransaction = (
	transaction: SafeMultisigTransaction
) => (
	transaction.to.toLowerCase() === transaction.safe.toLowerCase()
	&& transaction.value === '0'
	&& (transaction.data == null || transaction.data === '0x')
	&& transaction.operation === 0
)

const assertContinuation = (
	continuation: string | null,
	binding: SourceBinding,
	pathPrefix: string
) => {
	if (continuation == null)
		return
	const url = new URL(continuation)
	const endpointUrl = new URL(firstHttpUrlForBinding(binding))
	if (
		url.origin !== endpointUrl.origin
		|| !url.pathname.startsWith(`${endpointUrl.pathname.replace(/\/$/, '')}${pathPrefix}`)
	)
		throw new Error('SafeTransactionService_Rest: pagination continuation escaped its subject')
}

export const getSafeStatus = async (binding: SourceBinding, {
	safeAddress,
}: {
	safeAddress: string
}) => {
	assertAddress(safeAddress, 'Safe address')
	const status = await request<SafeStatus>({
		binding,
		path: `/api/v1/safes/${encodeURIComponent(safeAddress)}/`,
	})
	if (status.address.toLowerCase() !== safeAddress.toLowerCase())
		throw new Error('SafeTransactionService_Rest: status belongs to a different Safe')
	assertUnsignedDecimal(status.nonce, 'Safe nonce')
	assertPageNumber(status.threshold, 'Safe threshold', 1_000)
	const owners = new Set<string>()
	for (const owner of status.owners) {
		assertAddress(owner, 'Safe owner')
		const normalizedOwner = owner.toLowerCase()
		if (owners.has(normalizedOwner))
			throw new Error('SafeTransactionService_Rest: duplicate Safe owner')
		owners.add(normalizedOwner)
	}
	if (status.threshold < 1 || status.threshold > status.owners.length)
		throw new Error('SafeTransactionService_Rest: Safe threshold exceeds its owner set')
	return status
}

export const getSafeMultisigTransactions = async (binding: SourceBinding, {
	safeAddress,
	limit,
	offset,
	executed,
}: {
	safeAddress: string
	limit: number
	offset: number
	executed?: boolean
}) => {
	assertAddress(safeAddress, 'Safe address')
	assertPageNumber(limit, 'page limit', 100)
	if (limit < 1)
		throw new Error('SafeTransactionService_Rest: page limit must be positive')
	assertPageNumber(offset, 'page offset', Number.MAX_SAFE_INTEGER)
	const parameters = new URLSearchParams({
		limit: limit.toString(),
		offset: offset.toString(),
		...(executed != null && {
			executed: executed.toString(),
		}),
	})
	const pathPrefix = `/api/v2/safes/${encodeURIComponent(safeAddress)}/multisig-transactions/`
	const page = await request<SafePage<SafeMultisigTransaction>>({
		binding,
		path: `${pathPrefix}?${parameters.toString()}`,
	})
	assertPageNumber(page.count, 'result count', Number.MAX_SAFE_INTEGER)
	if (page.results.length > limit)
		throw new Error('SafeTransactionService_Rest: transaction page exceeds requested limit')
	assertContinuation(page.next, binding, pathPrefix)
	assertContinuation(page.previous, binding, pathPrefix)
	const hashes = new Set<string>()
	for (const transaction of page.results) {
		assertTransaction(transaction, safeAddress)
		const hash = transaction.safeTxHash.toLowerCase()
		if (hashes.has(hash))
			throw new Error('SafeTransactionService_Rest: duplicate transaction in page')
		hashes.add(hash)
		if (executed != null && transaction.isExecuted !== executed)
			throw new Error('SafeTransactionService_Rest: transaction execution filter was violated')
	}
	return page
}

export const getSafeTransactionConfirmations = async (binding: SourceBinding, {
	safeAddress,
	safeTxHash,
	limit,
	offset,
}: {
	safeAddress: string
	safeTxHash: string
	limit: number
	offset: number
}) => {
	assertAddress(safeAddress, 'Safe address')
	assertHash(safeTxHash, 'Safe transaction hash')
	assertPageNumber(limit, 'page limit', 100)
	if (limit < 1)
		throw new Error('SafeTransactionService_Rest: page limit must be positive')
	assertPageNumber(offset, 'page offset', Number.MAX_SAFE_INTEGER)
	const [status, transaction, page] = await Promise.all([
		getSafeStatus(binding, {
			safeAddress,
		}),
		request<SafeMultisigTransaction>({
			binding,
			path: `/api/v2/multisig-transactions/${encodeURIComponent(safeTxHash)}/`,
		}),
		request<SafePage<SafeMultisigConfirmation>>({
			binding,
			path: `/api/v1/multisig-transactions/${encodeURIComponent(safeTxHash)}/confirmations/?limit=${limit}&offset=${offset}`,
		}),
	])
	assertTransaction(transaction, safeAddress)
	if (transaction.safeTxHash.toLowerCase() !== safeTxHash.toLowerCase())
		throw new Error('SafeTransactionService_Rest: confirmation transaction hash was substituted')
	assertPageNumber(page.count, 'confirmation count', Number.MAX_SAFE_INTEGER)
	if (page.results.length > limit)
		throw new Error('SafeTransactionService_Rest: confirmation page exceeds requested limit')
	const confirmationPath = `/api/v1/multisig-transactions/${encodeURIComponent(safeTxHash)}/confirmations/`
	assertContinuation(page.next, binding, confirmationPath)
	assertContinuation(page.previous, binding, confirmationPath)
	const owners = new Set(status.owners.map((owner) => owner.toLowerCase()))
	const confirmedOwners = new Set<string>()
	for (const confirmation of page.results) {
		assertConfirmation(confirmation, owners)
		const owner = confirmation.owner.toLowerCase()
		if (confirmedOwners.has(owner))
			throw new Error('SafeTransactionService_Rest: duplicate confirmation owner in page')
		confirmedOwners.add(owner)
	}
	return page
}
