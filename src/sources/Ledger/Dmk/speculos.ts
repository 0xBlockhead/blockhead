import {
	DeviceManagementKitBuilder,
	DeviceModelId,
} from '@ledgerhq/device-management-kit'
import { SignerEthBuilder, type Signature } from '@ledgerhq/device-signer-kit-ethereum'
import { speculosIdentifier, speculosTransportFactory } from '@ledgerhq/device-transport-kit-speculos'
import { firstValueFrom, timeout } from 'rxjs'
import * as Hex from 'ox/Hex'
import * as PersonalMessage from 'ox/PersonalMessage'
import * as Secp256k1 from 'ox/Secp256k1'
import * as SignatureUtils from 'ox/Signature'
import { waitForLedgerAction } from './deviceAction.ts'


/** A signature was returned by the device, but it failed native-account verification. */
export class LedgerSignatureAuditFailure extends Error {
	constructor(
		readonly returnedSignature: Signature,
		cause: unknown
	) {
		super('Ledger returned a signature that failed account verification', { cause })
		this.name = 'LedgerSignatureAuditFailure'
	}
}

export const verifyLedgerMessageSignature = (response: Signature, message: string, address: string) => {
	try {
		const signature = SignatureUtils.fromRpc({ ...response, v: Hex.fromNumber(response.v) })
		const recoveredAddress = Secp256k1.recoverAddress({
			payload: PersonalMessage.getSignPayload(Hex.fromString(message)),
			signature,
		})
		if (recoveredAddress.toLowerCase() !== address.toLowerCase())
			throw new Error('Ledger signature does not recover the connected account')
		return SignatureUtils.toHex(signature)
	} catch (cause) {
		throw new LedgerSignatureAuditFailure(response, cause)
	}
}


/** Explicit local emulator transport. Never represents a physical hardware connection. */
export const connectSpeculos = async () => {
	const dmk = new DeviceManagementKitBuilder()
		.addTransport(speculosTransportFactory('http://127.0.0.1:5500', true, DeviceModelId.FLEX))
		.build()
	try {
		const device = await firstValueFrom(
			dmk.startDiscovering({ transport: speculosIdentifier }).pipe(timeout({ first: 10_000 }))
		)
		const sessionId = await dmk.connect({
			device,
			sessionRefresherOptions: { isRefresherDisabled: true },
		})
		const signer = new SignerEthBuilder({ dmk, sessionId }).build()
		const derivationPath = "44'/60'/0'/0/0"
		const { address } = await waitForLedgerAction(
			signer.getAddress(derivationPath, { checkOnDevice: false })
		)
		let closed = false
		return {
			address,
			signMessage: async (message: string) => {
				if (closed)
					throw new Error('Ledger emulator session is closed')
				const response = await waitForLedgerAction(signer.signMessage(derivationPath, message))
				return verifyLedgerMessageSignature(response, message, address)
			},
			close: async () => {
				if (closed)
					return
				closed = true
				try {
					await dmk.disconnect({ sessionId })
				} finally {
					dmk.close()
				}
			},
		}
	} catch (error) {
		dmk.close()
		throw error
	}
}
