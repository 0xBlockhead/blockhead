import { expect, it, vi } from 'vitest'
import type { Eip1193Provider } from './eip1193.ts'
import { sendEip1193Transaction, type WalletEvmTransaction } from './eip1193Transaction.ts'
import { WalletAdapterPreDispatchFailure, WalletAdapterProviderRejection, WalletAdapterResponseAuditFailure } from './types.ts'


const from = '0x1111111111111111111111111111111111111111'
const to = '0x2222222222222222222222222222222222222222'
const hash = `0x${'ab'.repeat(32)}`
const call = (): WalletEvmTransaction => ({ chainId: 11155111, from, to, data: '0x1234', value: 1n })
const provider = () => ({ request: vi.fn<Eip1193Provider['request']>()
	.mockResolvedValueOnce('0xaa36a7')
	.mockResolvedValueOnce([from])
	.mockResolvedValueOnce(hash) })

it('checks chain, sender and authority before submitting one snapshotted call', async () => {
	const wallet = provider()
	const input = call()
	const guard = vi.fn(() => {
		input.to = from
		input.chainId = 1
	})
	expect(await sendEip1193Transaction(wallet, input, guard)).toBe(hash)
	expect(guard).toHaveBeenCalledTimes(2)
	expect(wallet.request.mock.calls).toEqual([
		[{ method: 'eth_chainId', params: [] }],
		[{ method: 'eth_accounts', params: [] }],
		[{ method: 'eth_sendTransaction', params: [{ chainId: '0xaa36a7', from, to, data: '0x1234', value: '0x1' }] }],
	])
})

it.each([
	{ label: 'wrong chain', chain: '0x1', accounts: [from] },
	{ label: 'missing sender', chain: '0xaa36a7', accounts: [to] },
	{ label: 'malformed account', chain: '0xaa36a7', accounts: ['0x11'] },
])('does not broadcast after $label', async ({ chain, accounts }) => {
	const wallet = { request: vi.fn<Eip1193Provider['request']>().mockResolvedValueOnce(chain).mockResolvedValueOnce(accounts) }
	await expect(sendEip1193Transaction(wallet, call(), () => {})).rejects.toBeInstanceOf(WalletAdapterPreDispatchFailure)
	expect(wallet.request.mock.calls.some(([request]) => request.method === 'eth_sendTransaction')).toBe(false)
})

it.each<Partial<WalletEvmTransaction>>([{ data: '0x123' }, { value: -1n }, { value: 2n ** 256n }, { chainId: Number.MAX_SAFE_INTEGER + 1 }])('rejects invalid input before contacting the wallet (case %#)', async (invalid) => {
	const wallet = provider()
	await expect(sendEip1193Transaction(wallet, { ...call(), ...invalid }, () => {})).rejects.toBeInstanceOf(WalletAdapterPreDispatchFailure)
	expect(wallet.request).not.toHaveBeenCalled()
})

it('does not broadcast when authority expires during preflight', async () => {
	const wallet = provider()
	const guard = vi.fn().mockImplementationOnce(() => {}).mockImplementationOnce(() => { throw new Error('expired') })
	await expect(sendEip1193Transaction(wallet, call(), guard)).rejects.toThrow('expired')
	expect(wallet.request).toHaveBeenCalledTimes(2)
})

it.each([4001, 4100, 4200, 4900, 4901, -32603])('distinguishes rejection from uncertainty for code %i without retries', async (code) => {
	const error = Object.assign(new Error('wallet failure'), { code })
	const wallet = { request: vi.fn<Eip1193Provider['request']>().mockResolvedValueOnce('0xaa36a7').mockResolvedValueOnce([from]).mockRejectedValueOnce(error) }
	const result = sendEip1193Transaction(wallet, call(), () => {})
	if ([4001, 4100, 4200].includes(code))
		await expect(result).rejects.toBeInstanceOf(WalletAdapterProviderRejection)
	else
		await expect(result).rejects.toBe(error)
	expect(wallet.request).toHaveBeenCalledTimes(3)
})

it('keeps an invalid broadcast response distinct from a pre-dispatch failure', async () => {
	const wallet = { request: vi.fn<Eip1193Provider['request']>().mockResolvedValueOnce('0xaa36a7').mockResolvedValueOnce([from]).mockResolvedValueOnce('0x1234') }
	await expect(sendEip1193Transaction(wallet, call(), () => {})).rejects.toBeInstanceOf(WalletAdapterResponseAuditFailure)
	expect(wallet.request).toHaveBeenCalledTimes(3)
})
