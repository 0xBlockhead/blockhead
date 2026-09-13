import {
	DeviceActionStatus,
	DeviceExchangeError,
	GlobalCommandError,
	type DeviceActionState,
} from '@ledgerhq/device-management-kit'
import type { Signature } from '@ledgerhq/device-signer-kit-ethereum'
import * as Address from 'ox/Address'
import * as Hex from 'ox/Hex'
import * as PublicKey from 'ox/PublicKey'
import { Subject } from 'rxjs'
import { afterEach, describe, expect, it, vi } from 'vitest'
import {
	ledgerNativeAlternatePublicKey,
	ledgerNativePersonalSignFixture,
} from '../../../../scripts/hardware-wallets/Speculos/fixtures.ts'
import { LedgerDeviceUserRejection, waitForLedgerAction } from './deviceAction.ts'
import { LedgerSignatureAuditFailure, verifyLedgerMessageSignature } from './speculos.ts'


const fixture = () => ({
	observable: new Subject<DeviceActionState<string, unknown, string>>(),
	cancel: vi.fn(),
})

class EthAppCommandError extends DeviceExchangeError<string> {
	constructor(errorCode: string) {
		super({
			tag: 'EthAppCommandError',
			errorCode,
			message: 'native Ethereum app status word',
		})
	}
}

afterEach(() => vi.useRealTimers())

describe('Ledger terminal action lifecycle', () => {
	it('waits through a device prompt for the actual completed signature', async () => {
		const action = fixture()
		const pending = vi.fn()
		const settled = vi.fn()
		const result = waitForLedgerAction(action, pending).then(settled)
		action.observable.next({ status: DeviceActionStatus.Pending, intermediateValue: 'review' })
		await Promise.resolve()
		expect(pending).toHaveBeenCalledWith('review')
		expect(settled).not.toHaveBeenCalled()
		action.observable.next({ status: DeviceActionStatus.Completed, output: 'signature' })
		await result
		expect(settled).toHaveBeenCalledWith('signature')
		expect(action.cancel).toHaveBeenCalledOnce()
	})

	it.each([
		['global refusal', () => new GlobalCommandError({ errorCode: '5501', message: 'Action refused on device' }), '5501'],
		['Ethereum refusal', () => new EthAppCommandError('6985'), '6985'],
	] as const)('preserves a native %s as definite user rejection', async (_label, createError, code) => {
		const action = fixture()
		const result = waitForLedgerAction(action)
		action.observable.next({ status: DeviceActionStatus.Error, error: createError() })
		await expect(result).rejects.toMatchObject({
			name: 'LedgerDeviceUserRejection',
			deviceErrorCode: code,
			cause: expect.any(DeviceExchangeError),
		})
		expect(action.cancel).toHaveBeenCalledOnce()
	})

	it('keeps transport errors and Stopped ambiguous rather than translating them to rejection', async () => {
		const error = new Error('device disconnected during APDU exchange')
		const action = fixture()
		const result = waitForLedgerAction(action)
		action.observable.next({ status: DeviceActionStatus.Error, error })
		await expect(result).rejects.toMatchObject({
			message: 'Ledger device action failed',
			cause: error,
		})
		expect(action.cancel).toHaveBeenCalledOnce()

		const stoppedAction = fixture()
		const stoppedResult = waitForLedgerAction(stoppedAction)
		stoppedAction.observable.next({ status: DeviceActionStatus.Stopped })
		await expect(stoppedResult).rejects.toThrow('cancelled')
		await expect(stoppedResult).rejects.not.toBeInstanceOf(LedgerDeviceUserRejection)
		expect(stoppedAction.cancel).toHaveBeenCalledOnce()
	})

	it('does not treat device lock as user refusal', async () => {
		const action = fixture()
		const result = waitForLedgerAction(action)
		const lockedDevice = new EthAppCommandError('6982')
		action.observable.next({ status: DeviceActionStatus.Error, error: lockedDevice })
		await expect(result).rejects.toMatchObject({
			message: 'Ledger device action failed',
			cause: lockedDevice,
		})
	})

	it('retains a completed but unauditable signature for adapter-level response auditing', () => {
		const returnedSignature = { r: '0xnot-hex', s: '0x', v: 27 } as const satisfies Signature
		let failure: unknown
		try {
			verifyLedgerMessageSignature(returnedSignature, '0x1234', '0xabc')
		} catch (error) {
			failure = error
		}
		expect(failure).toBeInstanceOf(LedgerSignatureAuditFailure)
		expect(failure).toMatchObject({ returnedSignature })
	})

	it('cryptographically verifies a captured signature only for its message and public key (not device integration)', () => {
		const fixture = ledgerNativePersonalSignFixture
		const responseHex = Hex.from(`0x${fixture.responseData}`)
		const responseSignature = {
			v: Number(Hex.toBigInt(Hex.slice(responseHex, 0, 1))),
			r: Hex.slice(responseHex, 1, 33),
			s: Hex.slice(responseHex, 33),
		} satisfies Signature
		const message = fixture.message
		const expectedAddress = Address.fromPublicKey(PublicKey.from(`0x${fixture.publicKey}`))
		const otherAddress = Address.fromPublicKey(PublicKey.from(`0x${ledgerNativeAlternatePublicKey}`))

		expect(verifyLedgerMessageSignature(responseSignature, message, expectedAddress)).toMatch(/^0x/)

		let alteredMessageFailure: unknown
		try {
			verifyLedgerMessageSignature(responseSignature, `${fixture.message} altered`, expectedAddress)
		} catch (error) {
			alteredMessageFailure = error
		}
		expect(alteredMessageFailure).toBeInstanceOf(LedgerSignatureAuditFailure)
		expect(alteredMessageFailure).toMatchObject({ returnedSignature: responseSignature })

		let wrongAccountFailure: unknown
		try {
			verifyLedgerMessageSignature(responseSignature, message, otherAddress)
		} catch (error) {
			wrongAccountFailure = error
		}
		expect(wrongAccountFailure).toBeInstanceOf(LedgerSignatureAuditFailure)
		expect(wrongAccountFailure).toMatchObject({ returnedSignature: responseSignature })
	})

	it('bounds a device that never produces a terminal event, even with repeated prompts', async () => {
		vi.useFakeTimers()
		const action = fixture()
		const result = expect(waitForLedgerAction(action)).rejects.toThrow('Timeout')
		await vi.advanceTimersByTimeAsync(60_000)
		action.observable.next({ status: DeviceActionStatus.Pending, intermediateValue: 'review' })
		await vi.advanceTimersByTimeAsync(60_000)
		await result
		expect(action.cancel).toHaveBeenCalledOnce()
	})
})
