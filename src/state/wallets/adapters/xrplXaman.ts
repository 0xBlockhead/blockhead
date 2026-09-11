import type { Xumm } from 'xumm'

import { WalletCapability, WalletDiscoveryKind, WalletProtocol, WalletTransportKind } from '$/constants/Wallet.ts'
import { BlockheadConnectionStatus } from '$/schema/BlockheadConnectionStatus.ts'
import type { WalletAdapter, WalletCandidate, WalletConnection, WalletXrplTransactionRequest } from './types.ts'
import { buildWalletConnection } from '../walletConnectionState.ts'

declare global {
	interface Window {
		xumm?: Xumm
	}
}

export type XummPayloadSubscription = Awaited<ReturnType<
	NonNullable<Xumm['payload']>['createAndSubscribe']
>>

export type XummPayloadCreateAndSubscribe = (
	...args: Parameters<NonNullable<Xumm['payload']>['createAndSubscribe']>
) => Promise<Pick<XummPayloadSubscription, 'created' | 'payload' | 'resolved'>>

export type XummAdapterBridge = {
	user: Pick<Xumm['user'], 'account' | 'networkType'>
	payload?: {
		createAndSubscribe: XummPayloadCreateAndSubscribe
	}
}

const walletId = 'xrpl:xaman'
const defaultXumm = () => typeof window === 'undefined' ? undefined : window.xumm
const capabilities = [
	WalletCapability.Discover,
	WalletCapability.Connect,
	WalletCapability.Reconnect,
	WalletCapability.Disconnect,
	WalletCapability.ListAccounts,
	WalletCapability.SignTransaction,
] satisfies WalletCapability[]

const xrplReference = (networkType: string) => {
	if (networkType === 'mainnet') return '0'
	if (networkType === 'testnet') return '1'
	if (networkType === 'devnet') return '2'
	throw new Error('Xaman did not expose a supported XRPL network')
}

const connectionFrom = (accountAddress: string, reference: string): WalletConnection => (
	buildWalletConnection({
		walletId,
		status: BlockheadConnectionStatus.Connected,
		protocol: WalletProtocol.XrplXaman,
		transportKind: WalletTransportKind.HttpBridge,
		scopes: [{ namespace: 'xrpl', reference, methods: ['payload.createAndSubscribe'], events: [] }],
		accounts: [{ namespace: 'xrpl', reference, accountAddress, capabilities }],
		activeAccount: { namespace: 'xrpl', reference, accountAddress, capabilities },
		selected: true,
		connectedAt: Date.now(),
	})
)

export const createXrplXamanAdapter = (
	getXumm: () => XummAdapterBridge | undefined = defaultXumm
): WalletAdapter => {
	let xumm: XummAdapterBridge | undefined
	let lifecycleGeneration = 0
	let startGeneration = 0
	let connection: WalletConnection | undefined

	const current = (
		candidate: XummAdapterBridge,
		candidateStartGeneration: number,
		candidateLifecycleGeneration: number
	) => (
		xumm === candidate
		&& startGeneration === candidateStartGeneration
		&& lifecycleGeneration === candidateLifecycleGeneration
	)

	return {
		id: 'xrpl-xaman',
		start: (updateCandidates) => {
			const candidateStartGeneration = ++startGeneration
			lifecycleGeneration++
			xumm = getXumm()
			connection = undefined
			updateCandidates(xumm == null ? [] : [{
				id: walletId,
				name: 'Xaman',
				icon: '',
				protocol: WalletProtocol.XrplXaman,
				discoveryKind: WalletDiscoveryKind.InjectedGlobal,
				transportKind: WalletTransportKind.HttpBridge,
				capabilities,
			} satisfies WalletCandidate])
			return () => {
				if (startGeneration !== candidateStartGeneration) return
				lifecycleGeneration++
				xumm = undefined
				connection = undefined
				updateCandidates([])
			}
		},
		connect: async (candidateWalletId) => {
			if (candidateWalletId !== walletId || xumm == null) return undefined
			const candidate = xumm
			const candidateStartGeneration = startGeneration
			const candidateLifecycleGeneration = ++lifecycleGeneration
			const accountAddress = await candidate.user.account
			if (!current(candidate, candidateStartGeneration, candidateLifecycleGeneration))
				throw new Error('Xaman provider changed during account discovery')
			const networkType = await candidate.user.networkType
			if (!current(candidate, candidateStartGeneration, candidateLifecycleGeneration))
				throw new Error('Xaman provider changed during connection')
			if (accountAddress == null || networkType == null)
				throw new Error('Xaman did not expose a supported XRPL account and network')
			connection = connectionFrom(accountAddress, xrplReference(networkType))
			return connection
		},
		disconnect: () => {
			lifecycleGeneration++
			connection = undefined
		},
		subscribeConnection: () => () => {},
		signXrplTransaction: async (candidateWalletId, accountAddress, request, connectionKey) => {
			if (
				candidateWalletId !== walletId || xumm == null || connection == null
				|| connectionKey !== connection.connectionKey
				|| connection.activeAccount?.accountAddress !== accountAddress
				|| request.Account !== accountAddress
			)
				throw new Error('Xaman XRPL signing authority changed before dispatch')
			const candidate = xumm
			const candidateStartGeneration = startGeneration
			const candidateLifecycleGeneration = lifecycleGeneration
			const requestSnapshot = Object.freeze(structuredClone(request))
			const payload = candidate.payload
			if (payload == null) throw new Error('Xaman payload API is unavailable')
			const subscription = await payload.createAndSubscribe(
				{
					txjson: requestSnapshot,
					options: { submit: false },
				},
				({ data }) => (
					data.signed === true
					|| data.signed === false
					|| data.expired === true
				) ? data : undefined
			)
			if (!current(candidate, candidateStartGeneration, candidateLifecycleGeneration))
				throw new Error('Xaman provider changed during payload creation')
			await subscription.resolved
			if (!current(candidate, candidateStartGeneration, candidateLifecycleGeneration))
				throw new Error('Xaman provider changed during payload resolution')
			const resolved = subscription.payload
			if (!current(candidate, candidateStartGeneration, candidateLifecycleGeneration))
				throw new Error('Xaman provider changed during payload audit')
			// oxlint-disable-next-line typescript/no-unnecessary-condition -- The SDK type describes successful receipt materialization; a malformed bridge receipt can still omit it.
			if (resolved == null || resolved.meta.uuid !== subscription.created.uuid || resolved.meta.submit !== false)
				throw new Error('Xaman returned an invalid signing receipt')
			if (resolved.meta.expired)
				throw new Error('Xaman XRPL signing payload expired')
			if (resolved.meta.resolved && !resolved.meta.signed)
				throw new Error('Xaman rejected XRPL signing')
			if (
				!resolved.meta.resolved
				|| !resolved.meta.signed
				|| resolved.response.account !== accountAddress
				|| resolved.response.signer !== accountAddress
				|| JSON.stringify(resolved.payload.request_json) !== JSON.stringify(requestSnapshot)
			)
				throw new Error('Xaman returned an incomplete signing receipt')
			const signedBlob = resolved.response.hex
			if (signedBlob == null || !/^[0-9A-F]+$/i.test(signedBlob) || signedBlob.length % 2 !== 0)
				throw new Error('Xaman returned an invalid signed XRPL blob')
			return signedBlob
		},
	}
}
