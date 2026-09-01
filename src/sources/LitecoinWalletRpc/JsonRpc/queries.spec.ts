import { beforeEach, expect, it, vi } from 'vitest'

import bindings from '$/sources/LitecoinWalletRpc/bindings.ts'
import { Source } from '$/sources/Source.ts'

const jsonRpc2 = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_shared/wire/JsonRpc2/client.ts', () => ({
	jsonRpc2,
}))

const {
	getNewAddress,
	getWalletInfo,
	listTransactions,
	signMessage,
} = await import('$/sources/LitecoinWalletRpc/JsonRpc/queries.ts')
const binding = bindings[Source.LitecoinWalletRpc_JsonRpc][0]

beforeEach(() => {
	jsonRpc2.mockReset()
})

it('forwards each wallet method with its exact positional parameters', async () => {
	jsonRpc2.mockResolvedValue({})

	await getWalletInfo(binding)
	await listTransactions(binding, ['label', 25, 5, true])
	await getNewAddress(binding, ['label', 'bech32'])
	await signMessage(binding, ['ltc1qfixture', 'message'])

	expect(jsonRpc2.mock.calls).toEqual([
		[binding, 'getwalletinfo', undefined],
		[binding, 'listtransactions', ['label', 25, 5, true]],
		[binding, 'getnewaddress', ['label', 'bech32']],
		[binding, 'signmessage', ['ltc1qfixture', 'message']],
	])
})

it('propagates wallet RPC failures without substituting an empty result', async () => {
	const failure = new Error('wallet locked')
	jsonRpc2.mockRejectedValueOnce(failure)

	await expect(signMessage(binding, ['address', 'message'])).rejects.toBe(failure)
})
