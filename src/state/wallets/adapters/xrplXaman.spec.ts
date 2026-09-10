import { describe, expect, it, vi } from 'vitest'

import type { WalletXrplTransactionRequest } from './types.ts'
import { createXrplXamanAdapter, type XummAdapterBridge } from './xrplXaman.ts'

const account = 'rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH'
const request = {
	TransactionType: 'Payment',
	Account: account,
	Destination: account,
	Amount: '1',
} satisfies WalletXrplTransactionRequest

const payload = (overrides = {}) => ({
	meta: {
		uuid: 'payload-1',
		submit: false,
		resolved: true,
		signed: true,
		expired: false,
		...overrides,
	},
	payload: { request_json: structuredClone(request) },
	response: { account, signer: account, hex: 'ABCD' },
})

type PayloadStatusEvent = {
	expired?: boolean
	opened?: boolean
	signed?: boolean
}

const fixture = () => {
	const created = Promise.withResolvers<void>()
	const resolved = Promise.withResolvers<void>()
	const subscriptionPayload = payload({ resolved: false, signed: false })
	let callback: ((event: {
		data: PayloadStatusEvent
		payload: typeof subscriptionPayload
		resolve: () => void
		uuid: string
	}) => PayloadStatusEvent | void) | undefined
	const createAndSubscribe = vi.fn(async (_request, nextCallback) => {
		callback = nextCallback
		created.resolve()
		return {
			created: { uuid: 'payload-1' },
			payload: subscriptionPayload,
			resolved: resolved.promise,
		}
	})
	const bridge = {
		user: {
			account: Promise.resolve(account),
			networkType: Promise.resolve('mainnet'),
		},
		payload: { createAndSubscribe },
	} satisfies XummAdapterBridge

	return {
		bridge,
		createAndSubscribe,
		created: created.promise,
		emit: async (data: PayloadStatusEvent, terminalPayload?: ReturnType<typeof payload>) => {
			if (data.signed !== undefined || data.expired !== undefined)
				Object.assign(subscriptionPayload, terminalPayload)
			const callbackResult = await callback?.({
				data,
				payload: subscriptionPayload,
				resolve: resolved.resolve,
				uuid: 'payload-1',
			})
			if (callbackResult !== undefined) resolved.resolve()
		},
		fail: resolved.reject,
	}
}

const connect = async (bridge: XummAdapterBridge) => {
	const adapter = createXrplXamanAdapter(() => bridge)
	const candidates: string[] = []
	adapter.start((next) => candidates.push(...next.map((candidate) => candidate.id)))
	const connection = await adapter.connect('xrpl:xaman')
	if (connection == null)
		throw new Error('Xaman fixture did not connect')
	return { adapter, candidates, connection }
}

describe('Xaman XRPL adapter', () => {
	it('completes only when the SDK-shaped terminal callback resolves its subscription', async () => {
		const xumm = fixture()
		const { adapter, connection } = await connect(xumm.bridge)
		const signing = adapter.signXrplTransaction?.('xrpl:xaman', account, request, connection.connectionKey)
		let settled = false
		void signing?.then(() => { settled = true })

		await xumm.created
		await xumm.emit({ opened: true })
		await xumm.emit({})
		expect(settled).toBe(false)
		await xumm.emit({ signed: true }, payload())
		await Promise.resolve()

		expect(settled).toBe(true)
		await expect(signing).resolves.toBe('ABCD')
	})

	it('rejects a terminal unsigned callback without leaving its subscription open', async () => {
		const xumm = fixture()
		const { adapter, connection } = await connect(xumm.bridge)
		const signing = adapter.signXrplTransaction?.('xrpl:xaman', account, request, connection.connectionKey)
		let settled = false
		void signing?.then(
			() => { settled = true },
			() => { settled = true }
		)

		await xumm.created
		await xumm.emit({ signed: false }, payload({ signed: false }))
		await Promise.resolve()

		expect(settled).toBe(true)
		await expect(signing).rejects.toThrow('Xaman rejected XRPL signing')
	})

	it('discovers, connects, and sends one immutable sign-only payload', async () => {
		const xumm = fixture()
		const { adapter, candidates, connection } = await connect(xumm.bridge)
		const mutableRequest = structuredClone(request)
		const signing = adapter.signXrplTransaction?.('xrpl:xaman', account, mutableRequest, connection.connectionKey)
		mutableRequest.Amount = '2'
		await xumm.created
		await xumm.emit({ signed: true }, payload())

		expect(candidates).toEqual(['xrpl:xaman'])
		await expect(signing).resolves.toBe('ABCD')
		expect(xumm.createAndSubscribe).toHaveBeenCalledOnce()
		expect(xumm.createAndSubscribe).toHaveBeenCalledWith({
			txjson: request,
			options: { submit: false },
		}, expect.any(Function))
		expect(xumm.bridge.payload).not.toHaveProperty('submit')
		expect(xumm.bridge.payload).not.toHaveProperty('broadcast')
	})

	it.each([
		['unsigned', { signed: false }, payload({ signed: false })],
		['expired', { expired: true }, payload({ expired: true })],
		['UUID mismatch', { signed: true }, payload({ uuid: 'payload-2' })],
		['malformed blob', { signed: true }, { ...payload(), response: { account, signer: account, hex: 'ABC' } }],
		['account mismatch', { signed: true }, { ...payload(), response: { account: 'rWrong', signer: account, hex: 'ABCD' } }],
		['signer mismatch', { signed: true }, { ...payload(), response: { account, signer: 'rWrong', hex: 'ABCD' } }],
	])('rejects %s without submission', async (_label, terminalEvent, terminalPayload) => {
		const xumm = fixture()
		const { adapter, connection } = await connect(xumm.bridge)
		const signing = adapter.signXrplTransaction?.('xrpl:xaman', account, request, connection.connectionKey)
		await xumm.created
		await xumm.emit(terminalEvent, terminalPayload)

		await expect(signing).rejects.toThrow()
		expect(xumm.createAndSubscribe).toHaveBeenCalledOnce()
	})

	it('fences delayed resolution after disconnect', async () => {
		const xumm = fixture()
		const { adapter, connection } = await connect(xumm.bridge)
		const signing = adapter.signXrplTransaction?.('xrpl:xaman', account, request, connection.connectionKey)
		await xumm.created
		adapter.disconnect('xrpl:xaman')
		await xumm.emit({ signed: true }, payload())

		await expect(signing).rejects.toThrow('changed during payload resolution')
	})

	it('fences delayed account discovery across stop, restart, and provider replacement', async () => {
		const delayedAccount = Promise.withResolvers<string>()
		const first = fixture()
		first.bridge.user.account = delayedAccount.promise
		const replacement = fixture()
		let current = first.bridge
		const adapter = createXrplXamanAdapter(() => current)
		const stop = adapter.start(() => {})
		const connecting = adapter.connect('xrpl:xaman')
		stop()
		current = replacement.bridge
		adapter.start(() => {})
		delayedAccount.resolve(account)

		await expect(connecting).rejects.toThrow('changed during account discovery')
		await expect(adapter.connect('xrpl:xaman')).resolves.toMatchObject({
			activeAccount: { accountAddress: account },
		})
	})

	it('fences terminal completion across stop, restart, and provider replacement', async () => {
		const first = fixture()
		const replacement = fixture()
		let current = first.bridge
		const adapter = createXrplXamanAdapter(() => current)
		const stop = adapter.start(() => {})
		const connection = await adapter.connect('xrpl:xaman')
		if (connection == null)
			throw new Error('Xaman fixture did not connect')
		const signing = adapter.signXrplTransaction?.('xrpl:xaman', account, request, connection.connectionKey)
		await first.created
		stop()
		current = replacement.bridge
		adapter.start(() => {})
		await first.emit({ signed: true }, payload())

		await expect(signing).rejects.toThrow('changed during payload resolution')
	})

	it('preserves transport failure as an error instead of a rejection', async () => {
		const xumm = fixture()
		const { adapter, connection } = await connect(xumm.bridge)
		const signing = adapter.signXrplTransaction?.('xrpl:xaman', account, request, connection.connectionKey)
		await xumm.created
		xumm.fail(new Error('transport closed'))

		await expect(signing).rejects.toThrow('transport closed')
	})

	it('refuses a request whose Account differs before creating a Xaman payload', async () => {
		const xumm = fixture()
		const { adapter, connection } = await connect(xumm.bridge)
		const mismatchedRequest = { ...request, Account: 'rPT1Sjq2YGrBMTttXg' }

		await expect(adapter.signXrplTransaction?.(
			'xrpl:xaman',
			account,
			mismatchedRequest,
			connection.connectionKey
		)).rejects.toThrow('signing authority changed before dispatch')
		expect(xumm.createAndSubscribe).not.toHaveBeenCalled()
	})

	it('refuses signing when the connected Xaman bridge has no payload API', async () => {
		const xumm = fixture()
		const bridgeWithoutPayload = { ...xumm.bridge, payload: undefined }
		const adapter = createXrplXamanAdapter(() => bridgeWithoutPayload)
		adapter.start(() => {})
		const connection = await adapter.connect('xrpl:xaman')
		if (connection == null)
			throw new Error('Xaman fixture did not connect')

		await expect(adapter.signXrplTransaction?.(
			'xrpl:xaman',
			account,
			request,
			connection.connectionKey
		)).rejects.toThrow('payload API is unavailable')
	})
})
