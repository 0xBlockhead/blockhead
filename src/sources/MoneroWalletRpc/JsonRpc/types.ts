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

export type MoneroWalletOutput = {
	amount: number
	amount_index: number
	txid: string
	global_index?: number
	subaddr_index?: number
	key_image?: string
	key_image_known?: boolean
	key_image_partial?: boolean
	unlocked?: boolean
	spent?: boolean
	confirmations?: number
	height?: number
}

export type MoneroWalletOutputs = {
	outputs: MoneroWalletOutput[]
}

export type MoneroWalletTransfer = {
	txid: string
	amount: number
	fee?: number
	subaddr_index?: number
	payment_id?: string
	note?: string
	key_image?: string
	timestamp?: number
	confirmations?: number
	unlock_time?: number
	double_spend_seen?: boolean
}

export type MoneroWalletTransfers = {
	in?: MoneroWalletTransfer[]
	out?: MoneroWalletTransfer[]
	pending?: MoneroWalletTransfer[]
	failed?: MoneroWalletTransfer[]
	pool?: MoneroWalletTransfer[]
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
const walletOutputWire = arktype({
	amount: nonNegativeInteger,
	amount_index: nonNegativeInteger,
	txid: 'string > 0',
	'global_index?': nonNegativeInteger,
	'subaddr_index?': nonNegativeInteger,
	'key_image?': 'string > 0',
	'key_image_known?': 'boolean',
	'key_image_partial?': 'boolean',
	'unlocked?': 'boolean',
	'spent?': 'boolean',
	'confirmations?': nonNegativeInteger,
	'height?': nonNegativeInteger,
}) satisfies Type<MoneroWalletOutput>
const walletTransferWire = arktype({
	txid: 'string > 0',
	amount: nonNegativeInteger,
	'fee?': nonNegativeInteger,
	'subaddr_index?': nonNegativeInteger,
	'payment_id?': 'string > 0',
	'note?': 'string',
	'key_image?': 'string > 0',
	'timestamp?': nonNegativeInteger,
	'confirmations?': nonNegativeInteger,
	'unlock_time?': nonNegativeInteger,
	'double_spend_seen?': 'boolean',
}) satisfies Type<MoneroWalletTransfer>

export const moneroWalletOutputsWire = arktype({
	outputs: walletOutputWire.array(),
}) satisfies Type<MoneroWalletOutputs>
export const moneroWalletTransfersWire = arktype({
	'in?': walletTransferWire.array(),
	'out?': walletTransferWire.array(),
	'pending?': walletTransferWire.array(),
	'failed?': walletTransferWire.array(),
	'pool?': walletTransferWire.array(),
}) satisfies Type<MoneroWalletTransfers>
