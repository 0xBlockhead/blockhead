import type { SourceBinding } from '$/sources/SourceBinding.ts'
import { Source } from '$/sources/Source.ts'
import { jsonRpc2 } from '$/sources/_shared/wire/JsonRpc2/client.ts'
import bindings from '$/sources/MoneroWalletRpc/bindings.ts'
import {
	moneroWalletAccountsWire,
	moneroWalletAddressesWire,
	moneroWalletBalanceWire,
	moneroWalletHeightWire,
	moneroWalletKeyWire,
	moneroWalletOutputsWire,
	moneroWalletTransfersWire,
} from '$/sources/MoneroWalletRpc/JsonRpc/types.ts'

const sourceBinding = bindings[Source.MoneroWalletRpc_JsonRpc][0]

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
	binding: SourceBinding = sourceBinding
) => (
	request(binding, 'get_accounts', moneroWalletAccountsWire, {
		strict_balances: true,
	})
)

export const getBalance = (
	binding: SourceBinding = sourceBinding
) => (
	request(binding, 'get_balance', moneroWalletBalanceWire, {
		all_accounts: true,
		strict: true,
	})
)

export const getAddress = (
	accountIndex: number,
	binding: SourceBinding = sourceBinding
) => (
	request(binding, 'get_address', moneroWalletAddressesWire, {
		account_index: accountIndex,
	})
)

export const getHeight = (
	binding: SourceBinding = sourceBinding
) => (
	request(binding, 'get_height', moneroWalletHeightWire)
)

export const getKeyStatus = async (
	binding: SourceBinding = sourceBinding
) => {
	const [viewKey, spendKey] = await Promise.all([
		request(binding, 'query_key', moneroWalletKeyWire, { key_type: 'view_key' }),
		request(binding, 'query_key', moneroWalletKeyWire, { key_type: 'spend_key' }),
	])
	if (!/^[0-9a-f]{64}$/i.test(viewKey.key) || !/^[0-9a-f]{64}$/i.test(spendKey.key))
		throw new Error('MoneroWalletRpc_JsonRpc: invalid wallet key response')

	return {
		viewKeyFingerprint: [...new Uint8Array(await crypto.subtle.digest(
			'SHA-256',
			new TextEncoder().encode(viewKey.key.toLowerCase())
		))].map((byte) => byte.toString(16).padStart(2, '0')).join(''),
		spendKeyAvailable: !/^0{64}$/.test(spendKey.key),
	}
}

export const getOutputs = async (
	binding: SourceBinding = sourceBinding
) => {
	const outputs = await request(binding, 'get_outputs', moneroWalletOutputsWire, {
		all: true,
	})
	if (new Set(outputs.outputs.map((output) => `${output.txid}:${output.amount_index}`)).size !== outputs.outputs.length)
		throw new Error('MoneroWalletRpc_JsonRpc: duplicate output identity')

	return outputs
}

export const getTransfers = (
	binding: SourceBinding = sourceBinding
) => (
	request(binding, 'get_transfers', moneroWalletTransfersWire, {
		in: true,
		out: true,
		pending: true,
		failed: true,
		pool: true,
	})
)
