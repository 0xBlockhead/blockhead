import type { SourceBinding } from '$/sources/SourceBinding.ts'
import { jsonRpc2 } from '$/sources/_shared/wire/JsonRpc2/client.ts'
import {
	moneroWalletAccountsWire,
	moneroWalletAddressesWire,
	moneroWalletBalanceWire,
	moneroWalletHeightWire,
} from '$/sources/MoneroWalletRpc/JsonRpc/types.ts'

const request = async <_Result>(
	binding: SourceBinding,
	method: string,
	resultWire: { assert: (value: unknown) => _Result },
	params?: Readonly<Record<string, unknown>>
) => {
	try {
		return resultWire.assert(await jsonRpc2<unknown>(binding, method, params))
	} catch (error) {
		if (error instanceof Error && error.message.startsWith('JSON-RPC '))
			throw error

		throw new Error(`MoneroWalletRpc_JsonRpc: invalid ${method} response envelope`)
	}
}

export const getAccounts = (
	binding: SourceBinding
) => (
	request(binding, 'get_accounts', moneroWalletAccountsWire, {
		strict_balances: true,
	})
)

export const getBalance = (
	binding: SourceBinding
) => (
	request(binding, 'get_balance', moneroWalletBalanceWire, {
		all_accounts: true,
		strict: true,
	})
)

export const getAddress = (
	binding: SourceBinding,
	accountIndex: number
) => (
	request(binding, 'get_address', moneroWalletAddressesWire, {
		account_index: accountIndex,
	})
)

export const getHeight = (
	binding: SourceBinding
) => (
	request(binding, 'get_height', moneroWalletHeightWire)
)
