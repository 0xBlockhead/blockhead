import { Source } from '$/sources/Source.ts'
import {
	SourceTargetKind,
	type SourceBinding,
} from '$/sources/SourceBinding.ts'
import { getJson } from '$/sources/_shared/wire/HttpRest/client.ts'
import type { AlgodAccountResponse } from '$/sources/Algod/Rest/types.ts'

const assertBinding = (binding: SourceBinding) => {
	if (
		binding.source !== Source.Algod_Rest
		|| binding.target.kind !== SourceTargetKind.NetworkSlug
		|| binding.target.key !== 'algorand'
	)
		throw new Error('Algod_Rest: expected canonical Algorand binding')
}

const assertAddress = (
	address: string,
	label: string
) => {
	if (!/^[A-Z2-7]{58}$/.test(address))
		throw new Error(`Algod_Rest: invalid ${label}`)
}

const assertSafeUnsigned = (
	value: number,
	label: string
) => {
	if (!Number.isSafeInteger(value) || value < 0)
		throw new Error(`Algod_Rest: ${label} exceeds lossless JSON integer range`)
}

export const query = <_Json>(
	binding: SourceBinding,
	path: string
) => (
	getJson<_Json>(binding, path)
)

export const getAccount = async (
	binding: SourceBinding,
	address: string
) => {
	assertBinding(binding)
	assertAddress(address, 'account address')
	const account = await query<AlgodAccountResponse>(
		binding,
		`/v2/accounts/${encodeURIComponent(address)}?exclude=all`
	)
	if (account.address !== address)
		throw new Error('Algod_Rest: account response identity does not match request')
	assertSafeUnsigned(account.amount, 'account amount')
	assertSafeUnsigned(account['amount-without-pending-rewards'], 'account amount without pending rewards')
	assertSafeUnsigned(account['min-balance'], 'account minimum balance')
	assertSafeUnsigned(account['pending-rewards'], 'account pending rewards')
	assertSafeUnsigned(account.rewards, 'account rewards')
	assertSafeUnsigned(account.round, 'account round')
	assertSafeUnsigned(account['total-assets-opted-in'], 'account asset count')
	if (account['auth-addr'] != null)
		assertAddress(account['auth-addr'], 'authorized address')
	return account
}
