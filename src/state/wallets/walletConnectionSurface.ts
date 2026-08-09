import {
	WalletCapability,
	WalletImplementationStatus,
	walletConnectionMethods,
	type WalletConnectionMethod,
} from '$/constants/Wallet.ts'
import type { WalletAdapter, WalletConnection } from './adapters/types.ts'


/**
 * Codex durable conventions (019fc289 §4A):
 * - Public `Account` (CAIP-10) ≠ `BlockheadAccount` enrollment ≠ `BlockheadWalletConnection`
 * - Never revive `BlockheadWalletAccount`
 * - Prep-without-send: SignTransaction/SendTransaction are preparation + rejection only;
 *   public `EvmTransaction` only after a real hash
 * - Keep `BlockheadWalletRequestCall`; capabilities live on `WalletConnectionMethod`
 * - `BlockheadWalletCapabilityGrant` is authorization with scope + lifecycle (schema entity);
 *   it is orthogonal to connection.accounts[].capabilities and is not yet projected onto
 *   WalletConnection discoverable state until session grant restore wires it
 * - Farcaster is an identity overlay over EVM `personal_sign` proof (Account ⊥ WalletConnection);
 *   it is not a `WalletConnectionMethod` and must not gain an injected extension adapter here
 */

export enum WalletCapabilitySurfaceKind {
	/** Candidate discovery / announce */
	Discovery = 'discovery',
	/** connect / reconnect / disconnect / remove */
	ConnectionLifecycle = 'connection-lifecycle',
	/** accounts + scopes + watch via subscribeConnection */
	ConnectionState = 'connection-state',
	/** Adapter-executed signature that does not broadcast a tx */
	ExecutableSign = 'executable-sign',
	/** Prepare/reject only — never submit as public chain tx here */
	PrepOnly = 'prep-only',
	/** Change active CAIP-2 scope (e.g. wallet_switchEthereumChain) */
	ScopeMutation = 'scope-mutation',
}

export type WalletCapabilitySurface = {
	capability: WalletCapability
	kind: WalletCapabilitySurfaceKind
	/** Where the capability is observed when a connection/candidate is live */
	discoverableOn: readonly (
		| 'candidate.capabilities'
		| 'connection.status'
		| 'connection.scopes'
		| 'connection.scopes.methods'
		| 'connection.scopes.events'
		| 'connection.accounts'
		| 'connection.accounts.capabilities'
		| 'connection.session'
		| 'runtime.action'
	)[]
	runtimeAction?:
		| 'connect'
		| 'reconnect'
		| 'disconnect'
		| 'remove'
		| 'selectAccount'
		| 'signMessage'
		| 'signTypedData'
		| 'switchScope'
		| 'rejectPreparedTransactionRequest'
	adapterHook?:
		| 'start'
		| 'connect'
		| 'signMessage'
		| 'signTypedData'
		| 'switchScope'
		| 'disconnect'
		| 'subscribeConnection'
	notes: string
}

export const walletCapabilitySurfaces = [
	{
		capability: WalletCapability.Discover,
		kind: WalletCapabilitySurfaceKind.Discovery,
		discoverableOn: [
			'candidate.capabilities',
		],
		adapterHook: 'start',
		notes: 'Announced via adapter.start → candidates[]; catalog may list Discover without a live candidate until injected.',
	},
	{
		capability: WalletCapability.Connect,
		kind: WalletCapabilitySurfaceKind.ConnectionLifecycle,
		discoverableOn: [
			'candidate.capabilities',
			'connection.status',
			'runtime.action',
		],
		runtimeAction: 'connect',
		adapterHook: 'connect',
		notes: 'Produces BlockheadWalletConnection; does not create Account enrollment.',
	},
	{
		capability: WalletCapability.Reconnect,
		kind: WalletCapabilitySurfaceKind.ConnectionLifecycle,
		discoverableOn: [
			'candidate.capabilities',
			'connection.status',
			'runtime.action',
		],
		runtimeAction: 'reconnect',
		adapterHook: 'connect',
		notes: 'Same adapter.connect path as Connect; restores/re-requests accounts without a separate adapter hook.',
	},
	{
		capability: WalletCapability.Disconnect,
		kind: WalletCapabilitySurfaceKind.ConnectionLifecycle,
		discoverableOn: [
			'connection.status',
			'connection.scopes.events',
			'runtime.action',
		],
		runtimeAction: 'disconnect',
		adapterHook: 'disconnect',
		notes: 'Runtime always exposes disconnect/remove; catalog listing is optional honesty.',
	},
	{
		capability: WalletCapability.ListAccounts,
		kind: WalletCapabilitySurfaceKind.ConnectionState,
		discoverableOn: [
			'connection.accounts',
			'connection.accounts.capabilities',
		],
		adapterHook: 'connect',
		notes: 'Accounts are CAIP-10 slices on the connection; orthogonal to BlockheadAccount enrollment.',
	},
	{
		capability: WalletCapability.WatchAccounts,
		kind: WalletCapabilitySurfaceKind.ConnectionState,
		discoverableOn: [
			'connection.scopes.events',
			'connection.accounts',
		],
		adapterHook: 'subscribeConnection',
		notes: 'Push via subscribeConnection (e.g. accountsChanged); never HTTP-poll.',
	},
	{
		capability: WalletCapability.WatchScopes,
		kind: WalletCapabilitySurfaceKind.ConnectionState,
		discoverableOn: [
			'connection.scopes',
			'connection.scopes.events',
		],
		adapterHook: 'subscribeConnection',
		notes: 'Push via subscribeConnection (e.g. chainChanged); scopes carry methods/events.',
	},
	{
		capability: WalletCapability.SignMessage,
		kind: WalletCapabilitySurfaceKind.ExecutableSign,
		discoverableOn: [
			'connection.accounts.capabilities',
			'connection.scopes.methods',
			'runtime.action',
		],
		runtimeAction: 'signMessage',
		adapterHook: 'signMessage',
		notes: 'Persists BlockheadWalletRequest + timestamps; not a chain tx.',
	},
	{
		capability: WalletCapability.SignTypedData,
		kind: WalletCapabilitySurfaceKind.ExecutableSign,
		discoverableOn: [
			'connection.accounts.capabilities',
			'connection.scopes.methods',
			'runtime.action',
		],
		runtimeAction: 'signTypedData',
		adapterHook: 'signTypedData',
		notes: 'EIP-712 eth_signTypedData_v4; same request audit trail as SignMessage.',
	},
	{
		capability: WalletCapability.SignTransaction,
		kind: WalletCapabilitySurfaceKind.PrepOnly,
		discoverableOn: [
			'connection.accounts.capabilities',
			'connection.scopes.methods',
			'runtime.action',
		],
		runtimeAction: 'rejectPreparedTransactionRequest',
		notes: 'Prep/reject only via walletRequestPreparation; no WalletAdapter.send; no public EvmTransaction until hash.',
	},
	{
		capability: WalletCapability.SendTransaction,
		kind: WalletCapabilitySurfaceKind.PrepOnly,
		discoverableOn: [
			'connection.accounts.capabilities',
			'connection.scopes.methods',
			'runtime.action',
		],
		runtimeAction: 'rejectPreparedTransactionRequest',
		notes: 'Prep/reject only; broadcast is outside this surface until a real hash exists.',
	},
	{
		capability: WalletCapability.SwitchScope,
		kind: WalletCapabilitySurfaceKind.ScopeMutation,
		discoverableOn: [
			'connection.scopes',
			'connection.accounts.capabilities',
			'runtime.action',
		],
		runtimeAction: 'switchScope',
		adapterHook: 'switchScope',
		notes: 'Mutates connection.scopes.reference (and account references) after wallet confirms.',
	},
] as const satisfies readonly WalletCapabilitySurface[]

export const walletCapabilitySurfaceByCapability = Object.fromEntries(
	walletCapabilitySurfaces.map((surface) => [
		surface.capability,
		surface,
	])
) as Record<WalletCapability, WalletCapabilitySurface>

/** Catalog method id → runtime adapter id when they differ */
export const walletConnectionMethodAdapterIdByMethodId = {
	'eip6963': 'eip6963',
	'eip1193-legacy': 'eip6963',
	'tron-tip6963': 'tron-injected',
	'tron-tip1193': 'tron-injected',
	'wallet-standard': 'wallet-standard',
	'aptos-aip62': 'aptos-aip62',
	'aptos-injected-globals': 'aptos-injected',
	'cardano-cip30': 'cardano-cip30',
	'cosmos-offline-signer': 'cosmos-offline-signer',
	'polkadot-injected-web3': 'polkadot-injected-web3',
	'walletconnect-v2': 'walletconnect-v2',
	'ton-connect-injected': 'ton-connect',
	'ton-connect': 'ton-connect',
	'starknet-wallet-api': 'starknet-wallet-api',
	'bitcoin-injected-globals': 'bitcoin-injected',
} as const satisfies Partial<Record<string, string>>

export type WalletConnectionDiscoverableState = {
	connectionKey: string
	walletId: string
	status: WalletConnection['status']
	protocol: WalletConnection['protocol']
	transportKind: WalletConnection['transportKind']
	scopes: {
		namespace: string
		reference: string
		methods: readonly string[]
		events: readonly string[]
	}[]
	accounts: {
		namespace: string
		reference: string
		accountAddress: string
		capabilities: readonly WalletCapability[]
	}[]
	activeAccountAddress?: string
	selected?: boolean
	sessionId?: string
	sessionTopic?: string
	connectedAt?: number
	disconnectedAt?: number
	error?: string
}

export const discoverableStateFromConnection = (
	connection: WalletConnection,
	connectionKey: string
): WalletConnectionDiscoverableState => ({
	connectionKey,
	walletId: connection.walletId,
	status: connection.status,
	protocol: connection.protocol,
	transportKind: connection.transportKind,
	scopes: connection.scopes.map((scope) => ({
		namespace: scope.namespace,
		reference: scope.reference,
		methods: scope.methods,
		events: scope.events,
	})),
	accounts: connection.accounts.map((account) => ({
		namespace: account.namespace,
		reference: account.reference,
		accountAddress: account.accountAddress,
		capabilities: account.capabilities,
	})),
	...(connection.activeAccount != null && {
		activeAccountAddress: connection.activeAccount.accountAddress,
	}),
	...('selected' in connection && { selected: connection.selected }),
	...(connection.sessionId != null && { sessionId: connection.sessionId }),
	...(connection.sessionTopic != null && { sessionTopic: connection.sessionTopic }),
	...('connectedAt' in connection && connection.connectedAt != null && {
		connectedAt: connection.connectedAt,
	}),
	...('disconnectedAt' in connection && connection.disconnectedAt != null && {
		disconnectedAt: connection.disconnectedAt,
	}),
	...('error' in connection && connection.error != null && {
		error: connection.error,
	}),
})

export const assertEveryWalletCapabilityHasSurface = () => {
	const missing = Object.values(WalletCapability)
		.filter((capability) => walletCapabilitySurfaceByCapability[capability] == null)
	if (missing.length)
		throw new Error(`WalletCapability missing surface: ${missing.join(', ')}`)
}

export const catalogCapabilityAccountabilities = (
	method: WalletConnectionMethod
) => (
	method.capabilities.map((capability) => {
		const surface = walletCapabilitySurfaceByCapability[capability]
		return {
			capability,
			kind: surface.kind,
			runtimeAction: surface.runtimeAction,
			adapterHook: surface.adapterHook,
			discoverableOn: surface.discoverableOn,
			prepOnly: surface.kind === WalletCapabilitySurfaceKind.PrepOnly,
		}
	})
)

export const implementedWalletConnectionMethods = () => (
	walletConnectionMethods.filter((method: WalletConnectionMethod) => (
		method.implementationStatus === WalletImplementationStatus.Implemented
		|| method.implementationStatus === WalletImplementationStatus.DiscoveryImplemented
	))
)

export const adapterExposesHook = (
	adapter: Pick<WalletAdapter, 'signMessage' | 'signTypedData' | 'switchScope' | 'disconnect' | 'connect' | 'subscribeConnection' | 'start'>,
	hook: NonNullable<WalletCapabilitySurface['adapterHook']>
) => (
	hook === 'start' ?
		typeof adapter.start === 'function'
	: hook === 'connect' ?
		typeof adapter.connect === 'function'
	: hook === 'disconnect' ?
		typeof adapter.disconnect === 'function'
	: hook === 'subscribeConnection' ?
		typeof adapter.subscribeConnection === 'function'
	: hook === 'signMessage' ?
		typeof adapter.signMessage === 'function'
	: hook === 'signTypedData' ?
		typeof adapter.signTypedData === 'function'
	: hook === 'switchScope' ?
		typeof adapter.switchScope === 'function'
	:
		false
)
