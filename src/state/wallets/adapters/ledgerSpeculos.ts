import { WalletCapability, WalletDiscoveryKind, WalletProtocol, WalletTransportKind } from '$/constants/Wallet.ts'
import { BlockheadConnectionStatus } from '$/schema/BlockheadConnectionStatus.ts'
import {
	connectSpeculos,
	LedgerSignatureAuditFailure,
} from '$/sources/Ledger/Dmk/speculos.ts'
import { LedgerDeviceUserRejection } from '$/sources/Ledger/Dmk/deviceAction.ts'
import { buildWalletConnection } from '../walletConnectionState.ts'
import {
	WalletAdapterPreDispatchFailure,
	WalletAdapterProviderRejection,
	WalletAdapterResponseAuditFailure,
	type WalletAdapter,
} from './types.ts'

const walletId = 'ledger:speculos'
const capabilities = [
	WalletCapability.Connect,
	WalletCapability.Disconnect,
	WalletCapability.ListAccounts,
	WalletCapability.SignMessage,
]

/** Sepolia is the presentation context, not a chain selected by the emulated device. */
export const createLedgerSpeculosAdapter = (
	connect: typeof connectSpeculos = connectSpeculos
): WalletAdapter => {
	let session: Awaited<ReturnType<typeof connectSpeculos>> | undefined
	let epoch = 0
	let startGeneration = 0
	let active = false
	let signingToken: object | undefined

	const retireSession = () => {
		epoch++
		const previous = session
		session = undefined
		signingToken = undefined
		return previous
	}
	const disconnect = async () => {
		await retireSession()?.close()
	}

	return {
		id: 'ledger-speculos',
		start: (updateCandidates) => {
			active = true
			const thisStart = ++startGeneration
			updateCandidates([{
				id: walletId,
				name: 'Ledger Speculos (emulator · Sepolia)',
				icon: '',
				protocol: WalletProtocol.DirectHardwareTransport,
				discoveryKind: WalletDiscoveryKind.HardwareBridge,
				transportKind: WalletTransportKind.HttpBridge,
				capabilities,
			}])
			return () => {
				if (!active || startGeneration !== thisStart) return

				active = false
				startGeneration++
				void retireSession()?.close()
				updateCandidates([])
			}
		},
		connect: async (candidateWalletId) => {
			if (!active || candidateWalletId !== walletId)
				return undefined
			const connectionEpoch = ++epoch
			const previous = session
			session = undefined
			signingToken = undefined
			await previous?.close()
			if (!active || epoch !== connectionEpoch)
				throw new Error('Ledger connection was cancelled')
			const connected = await connect()
			if (!active || epoch !== connectionEpoch) {
				await connected.close()
				throw new Error('Ledger connection was cancelled')
			}
			session = connected
			const account = {
				namespace: 'eip155',
				reference: '11155111',
				accountAddress: connected.address,
				capabilities,
			}
			return buildWalletConnection({
				walletId,
				connectionKey: walletId,
				protocol: WalletProtocol.DirectHardwareTransport,
				transportKind: WalletTransportKind.HttpBridge,
				status: BlockheadConnectionStatus.Connected,
				selected: true,
				accounts: [account],
				activeAccount: account,
				scopes: [{
					namespace: account.namespace,
					reference: account.reference,
					methods: ['personal_sign'],
					events: [],
				}],
				connectedAt: Date.now(),
			})
		},
		signMessage: async (candidateWalletId, accountAddress, message, connectionKey) => {
			const current = session
			if (
				!active || current == null || candidateWalletId !== walletId
				|| connectionKey !== walletId || signingToken != null
				|| accountAddress.toLowerCase() !== current.address.toLowerCase()
			)
				throw new WalletAdapterPreDispatchFailure('Ledger signing authority is unavailable or busy')

			const signingEpoch = epoch
			const token = {}
			signingToken = token
			try {
				const signature = await current.signMessage(message)
				if (!active || session !== current || epoch !== signingEpoch)
					throw new WalletAdapterResponseAuditFailure(
						'Ledger signing authority changed while the device request was pending',
						signature
					)
				return signature
			} catch (error) {
				if (error instanceof LedgerDeviceUserRejection)
					throw new WalletAdapterProviderRejection(error.message, Number.parseInt(error.deviceErrorCode, 16))
				if (error instanceof LedgerSignatureAuditFailure)
					throw new WalletAdapterResponseAuditFailure(
						'Ledger device returned a signature that failed cryptographic audit',
						{
							r: error.returnedSignature.r,
							s: error.returnedSignature.s,
							v: error.returnedSignature.v,
						},
					)
				throw error
			} finally {
				if (signingToken === token)
					signingToken = undefined
			}
		},
		disconnect,
		subscribeConnection: () => () => {},
	}
}
