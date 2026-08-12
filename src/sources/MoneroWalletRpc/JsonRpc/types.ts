import {
	type as arktype,
	type Type,
} from 'arktype'


export type MoneroWalletAccount = {
	account_index: number
	base_address: string
	label?: string
	balance?: number
	unlocked_balance?: number
}

export type MoneroWalletAccounts = {
	subaddress_accounts: MoneroWalletAccount[]
	total_balance?: number
	total_unlocked_balance?: number
}

export type MoneroWalletSubaddress = {
	address: string
	address_index: number
	label?: string
	used?: boolean
}

export type MoneroWalletAddresses = {
	address: string
	addresses: MoneroWalletSubaddress[]
}

export type MoneroWalletSubaddressBalance = {
	account_index: number
	address_index: number
	address?: string
	label?: string
	balance?: number
	unlocked_balance?: number
	num_unspent_outputs?: number
	blocks_to_unlock?: number
	time_to_unlock?: number
}

export type MoneroWalletBalance = {
	balance: number
	unlocked_balance: number
	multisig_import_needed?: boolean
	per_subaddress?: MoneroWalletSubaddressBalance[]
}

export type MoneroWalletHeight = {
	height: number
}


const nonNegativeInteger = arktype('number.integer >= 0')
const walletAccountWire = arktype({
	account_index: nonNegativeInteger,
	base_address: 'string > 0',
	'label?': 'string',
	'balance?': nonNegativeInteger,
	'unlocked_balance?': nonNegativeInteger,
}) satisfies Type<MoneroWalletAccount>
const walletSubaddressWire = arktype({
	address: 'string > 0',
	address_index: nonNegativeInteger,
	'label?': 'string',
	'used?': 'boolean',
}) satisfies Type<MoneroWalletSubaddress>
const walletSubaddressBalanceWire = arktype({
	account_index: nonNegativeInteger,
	address_index: nonNegativeInteger,
	'address?': 'string > 0',
	'label?': 'string',
	'balance?': nonNegativeInteger,
	'unlocked_balance?': nonNegativeInteger,
	'num_unspent_outputs?': nonNegativeInteger,
	'blocks_to_unlock?': nonNegativeInteger,
	'time_to_unlock?': nonNegativeInteger,
}) satisfies Type<MoneroWalletSubaddressBalance>

export const moneroWalletAccountsWire = arktype({
	subaddress_accounts: walletAccountWire.array(),
	'total_balance?': nonNegativeInteger,
	'total_unlocked_balance?': nonNegativeInteger,
}) satisfies Type<MoneroWalletAccounts>
export const moneroWalletAddressesWire = arktype({
	address: 'string > 0',
	addresses: walletSubaddressWire.array(),
}) satisfies Type<MoneroWalletAddresses>
export const moneroWalletBalanceWire = arktype({
	balance: nonNegativeInteger,
	unlocked_balance: nonNegativeInteger,
	'multisig_import_needed?': 'boolean',
	'per_subaddress?': walletSubaddressBalanceWire.array(),
}) satisfies Type<MoneroWalletBalance>
export const moneroWalletHeightWire = arktype({
	height: nonNegativeInteger,
}) satisfies Type<MoneroWalletHeight>
