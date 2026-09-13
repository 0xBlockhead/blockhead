import {
	DeviceActionStatus,
	DeviceExchangeError,
	GlobalCommandError,
	type ExecuteDeviceActionReturnType,
} from '@ledgerhq/device-management-kit'
import { filter, firstValueFrom, map, tap, timeout } from 'rxjs'


export type LedgerUserRejectionCode = '5501' | '6985'

/** A native Ledger status word proves that the user refused this device action. */
export class LedgerDeviceUserRejection extends Error {
	constructor(
		readonly deviceErrorCode: LedgerUserRejectionCode,
		cause: unknown
	) {
		super('Ledger action was refused on device', { cause })
		this.name = 'LedgerDeviceUserRejection'
	}
}

const toLedgerDeviceUserRejection = <_Error>(error: _Error): LedgerDeviceUserRejection | undefined => {
	if (error instanceof GlobalCommandError && error.errorCode === '5501')
		return new LedgerDeviceUserRejection('5501', error)

	if (error instanceof DeviceExchangeError && error._tag === 'EthAppCommandError' && error.errorCode === '6985')
		return new LedgerDeviceUserRejection('6985', error)

	return undefined
}


/** Resolve only a terminal device result; expiry and cancellation release the SDK action. */
export const waitForLedgerAction = async <
	_Output,
	_Error,
	_Intermediate,
>(
	action: ExecuteDeviceActionReturnType<_Output, _Error, _Intermediate>,
	onPending?: (value: _Intermediate) => void
): Promise<_Output> => {
	try {
		return await firstValueFrom(action.observable.pipe(
			tap((state) => {
				if (state.status === DeviceActionStatus.Pending)
					onPending?.(state.intermediateValue)
			}),
			filter((state) => (
				state.status === DeviceActionStatus.Completed
				|| state.status === DeviceActionStatus.Error
				|| state.status === DeviceActionStatus.Stopped
			)),
			timeout({ first: 120_000 }),
			map((state) => {
				if (state.status === DeviceActionStatus.Completed)
					return state.output
				if (state.status === DeviceActionStatus.Error) {
					const rejection = toLedgerDeviceUserRejection(state.error)
					if (rejection != null)
						throw rejection
					throw new Error('Ledger device action failed', { cause: state.error })
				}
				throw new Error('Ledger device action was cancelled')
			})
		))
	} finally {
		action.cancel()
	}
}
