import { describe, expect, it, vi } from 'vitest'
import * as Hex from 'ox/Hex'
import { GlobalCommandError } from '@ledgerhq/device-management-kit'
import { LedgerDeviceUserRejection } from '$/sources/Ledger/Dmk/deviceAction.ts'
import { LedgerSignatureAuditFailure } from '$/sources/Ledger/Dmk/speculos.ts'
import {
	WalletAdapterPreDispatchFailure,
	WalletAdapterProviderRejection,
	WalletAdapterResponseAuditFailure,
} from './types.ts'
import { createLedgerSpeculosAdapter } from './ledgerSpeculos.ts'

const address = '0x7883053bfc5bc3cab18c35452f5ea317c837fa60' as const
const walletId = 'ledger:speculos'
const validSignature = Hex.fromNumber(0x11)
const fixture = () => ({
	address,
	signMessage: vi.fn(async (_message: string) => validSignature),
	close: vi.fn(async () => {}),
})

describe('Ledger emulator wallet authority', () => {
	it('exposes the connected identity and dispatches the exact reviewed message once', async () => {
		const session = fixture()
		const adapter = createLedgerSpeculosAdapter(async () => session)
		adapter.start(() => {})
		const connection = await adapter.connect(walletId)

		expect(connection?.activeAccount).toMatchObject({ accountAddress: address, reference: '11155111' })
		await expect(adapter.signMessage?.(walletId, address, 'exact message', walletId)).resolves.toBe(validSignature)
		expect(session.signMessage).toHaveBeenCalledExactlyOnceWith('exact message')
		await expect(adapter.signMessage?.(walletId, address, 'second message', walletId)).resolves.toBe(validSignature)
		expect(session.signMessage).toHaveBeenCalledTimes(2)
		await adapter.disconnect(walletId)
		expect(session.close).toHaveBeenCalledOnce()
	})

	it.each([
		['wrong account', walletId, `0x${'00'.repeat(20)}`, walletId],
		['wrong connection', walletId, address, 'another-connection'],
		['wrong wallet', 'another-wallet', address, walletId],
	])('blocks %s before dispatch', async (_label, selectedWallet, selectedAddress, connectionKey) => {
		const session = fixture()
		const adapter = createLedgerSpeculosAdapter(async () => session)
		adapter.start(() => {})
		await adapter.connect(walletId)

		await expect(adapter.signMessage?.(selectedWallet, selectedAddress, 'wrong authority', connectionKey))
			.rejects.toBeInstanceOf(WalletAdapterPreDispatchFailure)
		expect(session.signMessage).not.toHaveBeenCalled()
	})

	it('refuses to dispatch before connection', async () => {
		const connect = vi.fn(async () => fixture())
		const adapter = createLedgerSpeculosAdapter(connect)
		adapter.start(() => {})

		await expect(adapter.signMessage?.(walletId, address, 'not connected', walletId))
			.rejects.toBeInstanceOf(WalletAdapterPreDispatchFailure)
		expect(connect).not.toHaveBeenCalled()
	})

	it('rejects a signature returned after disconnect as response-audit evidence', async () => {
		const session = fixture()
		const pending = Promise.withResolvers<typeof validSignature>()
		session.signMessage.mockImplementationOnce(() => pending.promise)
		const adapter = createLedgerSpeculosAdapter(async () => session)
		adapter.start(() => {})
		await adapter.connect(walletId)

		const signing = adapter.signMessage?.(walletId, address, 'disconnect while pending', walletId)
		await vi.waitFor(() => expect(session.signMessage).toHaveBeenCalledOnce())
		await adapter.disconnect(walletId)
		const lateSignature = Hex.fromNumber(0x22)
		pending.resolve(lateSignature)

		await expect(signing).rejects.toBeInstanceOf(WalletAdapterResponseAuditFailure)
		await expect(signing).rejects.toMatchObject({ returnedValue: lateSignature })
		expect(session.close).toHaveBeenCalledOnce()
	})

	it('rejects a signature returned after stop as response-audit evidence', async () => {
		const session = fixture()
		const pending = Promise.withResolvers<typeof validSignature>()
		session.signMessage.mockImplementationOnce(() => pending.promise)
		const adapter = createLedgerSpeculosAdapter(async () => session)
		const stop = adapter.start(() => {})
		await adapter.connect(walletId)

		const signing = adapter.signMessage?.(walletId, address, 'stop while pending', walletId)
		await vi.waitFor(() => expect(session.signMessage).toHaveBeenCalledOnce())
		stop()
		const lateSignature = Hex.fromNumber(0x22)
		pending.resolve(lateSignature)

		await expect(signing).rejects.toBeInstanceOf(WalletAdapterResponseAuditFailure)
		await expect(signing).rejects.toMatchObject({ returnedValue: lateSignature })
		expect(session.close).toHaveBeenCalledOnce()
	})

	it('preserves a definite device rejection after authority loss', async () => {
		const session = fixture()
		const pending = Promise.withResolvers<typeof validSignature>()
		const nativeRejection = new LedgerDeviceUserRejection(
			'5501',
			new GlobalCommandError({ errorCode: '5501', message: 'Action refused on device' })
		)
		session.signMessage.mockImplementationOnce(() => pending.promise)
		const adapter = createLedgerSpeculosAdapter(async () => session)
		adapter.start(() => {})
		await adapter.connect(walletId)

		const signing = adapter.signMessage?.(walletId, address, 'cancel while pending', walletId)
		await vi.waitFor(() => expect(session.signMessage).toHaveBeenCalledOnce())
		await adapter.disconnect(walletId)
		pending.reject(nativeRejection)

		await expect(signing).rejects.toBeInstanceOf(WalletAdapterProviderRejection)
		await expect(signing).rejects.toMatchObject({ code: 0x5501 })
		await expect(signing).rejects.not.toBe(nativeRejection)
	})

	it('keeps a returned but unauditable device signature distinct from rejection', async () => {
		const session = fixture()
		const returnedSignature = { r: Hex.fromNumber(1), s: Hex.fromNumber(2), v: 27 }
		const nativeAuditFailure = new LedgerSignatureAuditFailure(
			returnedSignature,
			new Error('signature does not recover connected address')
		)
		session.signMessage.mockRejectedValueOnce(nativeAuditFailure)
		const adapter = createLedgerSpeculosAdapter(async () => session)
		adapter.start(() => {})
		await adapter.connect(walletId)

		const signing = adapter.signMessage?.(walletId, address, 'unauditable signature', walletId)
		await expect(signing).rejects.toBeInstanceOf(WalletAdapterResponseAuditFailure)
		await expect(signing).rejects.toMatchObject({
			returnedValue: returnedSignature,
		})
		await expect(signing).rejects.not.toBeInstanceOf(WalletAdapterProviderRejection)
		expect(session.signMessage).toHaveBeenCalledExactlyOnceWith('unauditable signature')
	})

	it('preserves an ambiguous transport failure after authority loss', async () => {
		const session = fixture()
		const pending = Promise.withResolvers<typeof validSignature>()
		const transportFailure = new Error('Ledger transport disconnected')
		session.signMessage.mockImplementationOnce(() => pending.promise)
		const adapter = createLedgerSpeculosAdapter(async () => session)
		adapter.start(() => {})
		await adapter.connect(walletId)

		const signing = adapter.signMessage?.(walletId, address, 'transport loss while pending', walletId)
		await vi.waitFor(() => expect(session.signMessage).toHaveBeenCalledOnce())
		await adapter.disconnect(walletId)
		pending.reject(transportFailure)

		await expect(signing).rejects.toBe(transportFailure)
	})

	it('does not let an old completion clear the newer session busy token', async () => {
		const oldSession = fixture()
		const newSession = fixture()
		const oldResponse = Promise.withResolvers<typeof validSignature>()
		const newResponse = Promise.withResolvers<typeof validSignature>()
		oldSession.signMessage.mockImplementationOnce(() => oldResponse.promise)
		newSession.signMessage.mockImplementationOnce(() => newResponse.promise)
		const connect = vi.fn()
			.mockResolvedValueOnce(oldSession)
			.mockResolvedValueOnce(newSession)
		const adapter = createLedgerSpeculosAdapter(connect)
		adapter.start(() => {})
		await adapter.connect(walletId)

		const oldSigning = adapter.signMessage?.(walletId, address, 'old request', walletId)
		await vi.waitFor(() => expect(oldSession.signMessage).toHaveBeenCalledOnce())
		await adapter.connect(walletId)
		const newSigning = adapter.signMessage?.(walletId, address, 'new request', walletId)
		await vi.waitFor(() => expect(newSession.signMessage).toHaveBeenCalledOnce())

		oldResponse.resolve(Hex.fromNumber(0x22))
		await expect(oldSigning).rejects.toBeInstanceOf(WalletAdapterResponseAuditFailure)
		await expect(adapter.signMessage?.(walletId, address, 'overlap', walletId))
			.rejects.toBeInstanceOf(WalletAdapterPreDispatchFailure)
		expect(newSession.signMessage).toHaveBeenCalledOnce()

		newResponse.resolve(Hex.fromNumber(0x33))
		await expect(newSigning).resolves.toBe(Hex.fromNumber(0x33))
	})

	it('closes a late connection after adapter teardown', async () => {
		const session = fixture()
		const pending = Promise.withResolvers<typeof session>()
		const connecting = vi.fn(() => pending.promise)
		const adapter = createLedgerSpeculosAdapter(connecting)
		const stop = adapter.start(() => {})
		const connection = adapter.connect(walletId)
		await vi.waitFor(() => expect(connecting).toHaveBeenCalledOnce())
		stop()
		pending.resolve(session)

		await expect(connection).rejects.toThrow('cancelled')
		expect(session.close).toHaveBeenCalledOnce()
		await expect(adapter.signMessage?.(walletId, address, 'after stop', walletId))
			.rejects.toBeInstanceOf(WalletAdapterPreDispatchFailure)
	})

	it('does not let obsolete cleanup stop a newer adapter start', async () => {
		const session = fixture()
		const adapter = createLedgerSpeculosAdapter(async () => session)
		const obsoleteStop = adapter.start(() => {})
		adapter.start(() => {})
		obsoleteStop()

		await expect(adapter.connect(walletId)).resolves.toMatchObject({
			activeAccount: { accountAddress: address },
		})
		await expect(adapter.signMessage?.(walletId, address, 'still active', walletId)).resolves.toBe(validSignature)
		expect(session.signMessage).toHaveBeenCalledOnce()
	})
})
