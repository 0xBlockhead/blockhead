import * as Address from 'ox/Address'

import bindings from '$/sources/SafeTransactionService/bindings.ts'
import type { SourceBinding } from '$/sources/SourceBinding.ts'
import {
	firstHttpUrlForBinding,
	sourceGetJson,
} from '$/sources/_runtime/http.ts'
import { Source } from '$/sources/Source.ts'
import {
	safeCreationEnvelope,
	safeMultisigConfirmationPageEnvelope,
	safeMultisigTransactionEnvelope,
	safeMultisigTransactionPageEnvelope,
	safeStatusEnvelope,
	type SafeCreation,
	type SafeMultisigConfirmation,
	type SafeMultisigTransaction,
	type SafeStatus,
} from '$/sources/SafeTransactionService/Rest/types.ts'

const bindingByChainId = new Map(
	bindings[Source.SafeTransactionService_Rest].map((binding) => [
		Number(binding.target.key),
		binding,
	] as const)
)

export const safeTransactionServiceChainIds = [
	...bindingByChainId.keys(),
]

export const requireSafeTransactionServiceBinding = (
	chainId: number
) => {
	const binding = bindingByChainId.get(chainId)
	if (binding == null)
		throw new Error(`SafeTransactionService_Rest: no binding for chain ${chainId}`)

	return binding
}

const omitUndefinedJson = (
	value: unknown
): unknown => {
	if (Array.isArray(value))
		return value.map(omitUndefinedJson)
	if (value != null && typeof value === 'object')
		return Object.fromEntries(
			Object.entries(value)
				.filter(([, entry]) => entry !== undefined)
				.map(([key, entry]) => [
					key,
					omitUndefinedJson(entry),
				])
		)
	return value
}

const assertEnvelope = <_Value>(
	label: string,
	wire: { assert: (value: unknown) => _Value },
	response: unknown
) => {
	try {
		return wire.assert(omitUndefinedJson(response))
	} catch {
		throw new Error(`SafeTransactionService_Rest: invalid ${label} response envelope`)
	}
}

const assertAddress = (
	address: string,
	label: string
) => {
	if (!/^0x[0-9a-fA-F]{40}$/.test(address))
		throw new Error(`SafeTransactionService_Rest: invalid ${label}`)
}

const checksumAddress = (
	address: string,
	label: string
) => {
	assertAddress(address, label)
	return Address.checksum(address)
}

const assertHash = (
	hash: string,
	label: string
) => {
	if (!/^0x[0-9a-fA-F]{64}$/.test(hash))
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
}) => (
	sourceGetJson<_Result>(
		binding,
		`${firstHttpUrlForBinding(binding).replace(/\/$/, '')}${path}`
	)
)

const assertConfirmationOwners = (
	confirmation: SafeMultisigConfirmation,
	owners?: Set<string>
) => {
	if (owners != null && !owners.has(confirmation.owner.toLowerCase()))
		throw new Error('SafeTransactionService_Rest: confirmation belongs to a non-owner')
}

const assertTransactionSubject = (
	transaction: SafeMultisigTransaction,
	safeAddress: string
) => {
	if (transaction.safe.toLowerCase() !== safeAddress.toLowerCase())
		throw new Error('SafeTransactionService_Rest: transaction belongs to a different Safe')
	const confirmingOwners = new Set<string>()
	for (const confirmation of transaction.confirmations) {
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

export const getSafeStatus = async ({
	chainId,
	safeAddress,
}: {
	chainId: number
	safeAddress: string
}) => {
	const binding = requireSafeTransactionServiceBinding(chainId)
	const checksummedSafeAddress = checksumAddress(safeAddress, 'Safe address')
	const status = assertEnvelope(
		'Safe status',
		safeStatusEnvelope,
		await request<SafeStatus>({
			binding,
			path: `/api/v1/safes/${encodeURIComponent(checksummedSafeAddress)}/`,
		})
	)
	if (status.address.toLowerCase() !== checksummedSafeAddress.toLowerCase())
		throw new Error('SafeTransactionService_Rest: status belongs to a different Safe')
	const owners = new Set<string>()
	for (const owner of status.owners) {
		const normalizedOwner = owner.toLowerCase()
		if (owners.has(normalizedOwner))
			throw new Error('SafeTransactionService_Rest: duplicate Safe owner')
		owners.add(normalizedOwner)
	}
	const modules = new Set<string>()
	for (const moduleAddress of status.modules) {
		const normalizedModule = moduleAddress.toLowerCase()
		if (modules.has(normalizedModule))
			throw new Error('SafeTransactionService_Rest: duplicate Safe module')
		modules.add(normalizedModule)
	}
	if (status.threshold > status.owners.length)
		throw new Error('SafeTransactionService_Rest: Safe threshold exceeds its owner set')
	return status
}

/** `GET /api/v1/safes/{address}/creation/` — factory + creator + creation tx. */
export const getSafeCreation = async ({
	chainId,
	safeAddress,
}: {
	chainId: number
	safeAddress: string
}) => {
	const binding = requireSafeTransactionServiceBinding(chainId)
	const checksummedSafeAddress = checksumAddress(safeAddress, 'Safe address')
	const creation = assertEnvelope(
		'Safe creation',
		safeCreationEnvelope,
		await request<SafeCreation>({
			binding,
			path: `/api/v1/safes/${encodeURIComponent(checksummedSafeAddress)}/creation/`,
		})
	)
	// Creation wire does not echo the Safe address; bind factory/masterCopy/creator identities instead.
	if (creation.factoryAddress.toLowerCase() === checksummedSafeAddress.toLowerCase())
		throw new Error('SafeTransactionService_Rest: creation factory cannot be the Safe itself')
	if (creation.masterCopy.toLowerCase() === checksummedSafeAddress.toLowerCase())
		throw new Error('SafeTransactionService_Rest: creation masterCopy cannot be the Safe itself')
	if (creation.creator.toLowerCase() === checksummedSafeAddress.toLowerCase())
		throw new Error('SafeTransactionService_Rest: creation creator cannot be the Safe itself')
	if (creation.factoryAddress.toLowerCase() === creation.masterCopy.toLowerCase())
		throw new Error('SafeTransactionService_Rest: creation factory and masterCopy must differ')
	return creation
}

export const getSafeMultisigTransactions = async ({
	chainId,
	safeAddress,
	limit,
	offset,
	executed,
}: {
	chainId: number
	safeAddress: string
	limit: number
	offset: number
	executed?: boolean
}) => {
	const binding = requireSafeTransactionServiceBinding(chainId)
	const checksummedSafeAddress = checksumAddress(safeAddress, 'Safe address')
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
	const pathPrefix = `/api/v2/safes/${encodeURIComponent(checksummedSafeAddress)}/multisig-transactions/`
	const page = assertEnvelope(
		'transaction page',
		safeMultisigTransactionPageEnvelope,
		await request({
			binding,
			path: `${pathPrefix}?${parameters.toString()}`,
		})
	)
	if (page.results.length > limit)
		throw new Error('SafeTransactionService_Rest: transaction page exceeds requested limit')
	assertContinuation(page.next, binding, pathPrefix)
	assertContinuation(page.previous, binding, pathPrefix)
	const hashes = new Set<string>()
	for (const transaction of page.results) {
		assertTransactionSubject(transaction, checksummedSafeAddress)
		const hash = transaction.safeTxHash.toLowerCase()
		if (hashes.has(hash))
			throw new Error('SafeTransactionService_Rest: duplicate transaction in page')
		hashes.add(hash)
		if (executed != null && transaction.isExecuted !== executed)
			throw new Error('SafeTransactionService_Rest: transaction execution filter was violated')
		if (executed === true && transaction.transactionHash == null)
			throw new Error('SafeTransactionService_Rest: executed transaction missing execution hash')
		if (
			executed === false
			&& (
				transaction.transactionHash != null
				|| transaction.executionDate != null
				|| transaction.blockNumber != null
				|| transaction.isSuccessful != null
				|| transaction.ethGasPrice != null
				|| transaction.maxFeePerGas != null
				|| transaction.maxPriorityFeePerGas != null
				|| transaction.gasUsed != null
				|| transaction.fee != null
				|| transaction.payment != null
			)
		)
			throw new Error('SafeTransactionService_Rest: queued transaction includes execution data')
	}
	if (
		page.countUniqueNonce != null
		&& page.countUniqueNonce > page.count
	)
		throw new Error('SafeTransactionService_Rest: countUniqueNonce exceeds page count')
	return page
}

export const getSafeMultisigTransaction = async ({
	chainId,
	safeAddress,
	safeTxHash,
}: {
	chainId: number
	safeAddress?: string
	safeTxHash: string
}) => {
	const binding = requireSafeTransactionServiceBinding(chainId)
	const checksummedSafeAddress = (
		safeAddress == null ?
			undefined
		:
			checksumAddress(safeAddress, 'Safe address')
	)
	assertHash(safeTxHash, 'Safe transaction hash')
	const transaction = assertEnvelope(
		'Safe multisig transaction',
		safeMultisigTransactionEnvelope,
		await request({
			binding,
			path: `/api/v2/multisig-transactions/${encodeURIComponent(safeTxHash)}/`,
		})
	)
	assertTransactionSubject(
		transaction,
		checksummedSafeAddress ?? transaction.safe
	)
	if (transaction.safeTxHash.toLowerCase() !== safeTxHash.toLowerCase())
		throw new Error('SafeTransactionService_Rest: Safe transaction hash was substituted')
	return transaction
}

export const getSafeTransactionConfirmations = async ({
	chainId,
	safeAddress,
	safeTxHash,
	limit,
	offset,
}: {
	chainId: number
	safeAddress: string
	safeTxHash: string
	limit: number
	offset: number
}) => {
	const binding = requireSafeTransactionServiceBinding(chainId)
	checksumAddress(safeAddress, 'Safe address')
	assertHash(safeTxHash, 'Safe transaction hash')
	assertPageNumber(limit, 'page limit', 100)
	if (limit < 1)
		throw new Error('SafeTransactionService_Rest: page limit must be positive')
	assertPageNumber(offset, 'page offset', Number.MAX_SAFE_INTEGER)
	const [
		status,
		,
		rawPage,
	] = await Promise.all([
		getSafeStatus({
			chainId,
			safeAddress,
		}),
		getSafeMultisigTransaction({
			chainId,
			safeAddress,
			safeTxHash,
		}),
		request({
			binding,
			path: `/api/v1/multisig-transactions/${encodeURIComponent(safeTxHash)}/confirmations/?limit=${limit}&offset=${offset}`,
		}),
	])
	const page = assertEnvelope(
		'confirmation page',
		safeMultisigConfirmationPageEnvelope,
		rawPage
	)
	if (page.results.length > limit)
		throw new Error('SafeTransactionService_Rest: confirmation page exceeds requested limit')
	const confirmationPath = `/api/v1/multisig-transactions/${encodeURIComponent(safeTxHash)}/confirmations/`
	assertContinuation(page.next, binding, confirmationPath)
	assertContinuation(page.previous, binding, confirmationPath)
	const owners = new Set(status.owners.map((owner) => owner.toLowerCase()))
	const confirmedOwners = new Set<string>()
	for (const confirmation of page.results) {
		assertConfirmationOwners(confirmation, owners)
		const owner = confirmation.owner.toLowerCase()
		if (confirmedOwners.has(owner))
			throw new Error('SafeTransactionService_Rest: duplicate confirmation owner in page')
		confirmedOwners.add(owner)
	}
	return page
}
