import { BlockheadConnectionStatus } from '$/schema/BlockheadConnectionStatus.ts'
import type {
	WalletAccount,
	WalletConnection,
	WalletConnectionBase,
	WalletScope,
} from './adapters/types.ts'
import type { WalletProtocol, WalletTransportKind } from '$/constants/Wallet.ts'


export type PersistedWalletConnection = WalletConnectionBase & {
	status: BlockheadConnectionStatus
	selected: boolean
	connectedAt?: number
	disconnectedAt?: number
	error?: string
}


export const walletConnectionKey = (
	connection: Pick<WalletConnectionBase, 'connectionKey' | 'sessionTopic' | 'sessionId' | 'walletId'>
) => (
	connection.connectionKey
	?? connection.sessionTopic
	?? connection.sessionId
	?? connection.walletId
)

export const connectingWalletConnection = (
	base: WalletConnectionBase
): Extract<WalletConnection, { status: BlockheadConnectionStatus.Connecting }> => ({
	...base,
	status: BlockheadConnectionStatus.Connecting,
})

export const connectedWalletConnection = (
	base: WalletConnectionBase & {
		selected: boolean
		connectedAt?: number
	}
): Extract<WalletConnection, { status: BlockheadConnectionStatus.Connected }> => {
	// EIP-1193 / Wallet Standard: selection only applies while accounts are present.
	const activeAccount = (
		base.activeAccount != null
		&& base.accounts.some((account) => (
			account.namespace === base.activeAccount?.namespace
			&& account.reference === base.activeAccount.reference
			&& account.accountAddress === base.activeAccount.accountAddress
		))
	) ?
		base.activeAccount
	:
		base.accounts.at(0)
	const selected = base.selected && base.accounts.length > 0 && activeAccount != null

	return selected ?
		{
			...base,
			activeAccount,
			status: BlockheadConnectionStatus.Connected,
			selected: true,
		}
	:
		{
			...base,
			...(activeAccount != null ? { activeAccount } : { activeAccount: undefined }),
			status: BlockheadConnectionStatus.Connected,
			selected: false,
		}
}

export const disconnectedWalletConnection = (
	base: WalletConnectionBase & {
		disconnectedAt?: number
		connectedAt?: number
	}
): Extract<WalletConnection, { status: BlockheadConnectionStatus.Disconnected }> => ({
	...base,
	status: BlockheadConnectionStatus.Disconnected,
})

export const erroredWalletConnection = (
	base: WalletConnectionBase & {
		error: string
		disconnectedAt?: number
	}
): Extract<WalletConnection, { status: BlockheadConnectionStatus.Error }> => ({
	...base,
	status: BlockheadConnectionStatus.Error,
	error: base.error,
})

export const buildWalletConnection = ({
	status,
	selected = false,
	connectedAt,
	disconnectedAt,
	error,
	...base
}: WalletConnectionBase & {
	status: BlockheadConnectionStatus
	selected?: boolean
	connectedAt?: number
	disconnectedAt?: number
	error?: string
}): WalletConnection => {
	switch (status) {
		case BlockheadConnectionStatus.Connecting:
			return connectingWalletConnection(base)
		case BlockheadConnectionStatus.Connected:
			return connectedWalletConnection({
				...base,
				selected,
				...(connectedAt != null && { connectedAt }),
			})
		case BlockheadConnectionStatus.Disconnected:
			return disconnectedWalletConnection({
				...base,
				...(disconnectedAt != null && { disconnectedAt }),
				...(connectedAt != null && { connectedAt }),
			})
		case BlockheadConnectionStatus.Error:
			return erroredWalletConnection({
				...base,
				error: error ?? 'Unknown wallet connection error',
				...(disconnectedAt != null && { disconnectedAt }),
			})
	}
}

export const isSelectedWalletConnection = (
	connection: WalletConnection
): connection is Extract<WalletConnection, {
	status: BlockheadConnectionStatus.Connected
	selected: true
}> => (
	connection.status === BlockheadConnectionStatus.Connected
	&& connection.selected
)

export const walletConnectionError = (
	connection: WalletConnection
) => (
	connection.status === BlockheadConnectionStatus.Error ?
		connection.error
	:
		undefined
)

export const persistWalletConnection = (
	connection: WalletConnection
): PersistedWalletConnection => {
	const base = {
		connectionKey: connection.connectionKey,
		walletId: connection.walletId,
		protocol: connection.protocol,
		transportKind: connection.transportKind,
		scopes: connection.scopes,
		accounts: connection.accounts,
		activeAccount: connection.activeAccount,
		sessionId: connection.sessionId,
		sessionTopic: connection.sessionTopic,
	}

	switch (connection.status) {
		case BlockheadConnectionStatus.Connecting:
			return {
				...base,
				status: connection.status,
				selected: false,
			}
		case BlockheadConnectionStatus.Connected:
			return {
				...base,
				status: connection.status,
				selected: connection.selected,
				...(connection.connectedAt != null && { connectedAt: connection.connectedAt }),
			}
		case BlockheadConnectionStatus.Disconnected:
			return {
				...base,
				status: connection.status,
				selected: false,
				...(connection.connectedAt != null && { connectedAt: connection.connectedAt }),
				...(connection.disconnectedAt != null && { disconnectedAt: connection.disconnectedAt }),
			}
		case BlockheadConnectionStatus.Error:
			return {
				...base,
				status: connection.status,
				selected: false,
				error: connection.error,
				...(connection.disconnectedAt != null && { disconnectedAt: connection.disconnectedAt }),
			}
	}
}

export const walletConnectionFromPersisted = (
	connection: PersistedWalletConnection
): WalletConnection => (
	// Flat schema rows may carry contradictory selected/error/status; coerce to the machine.
	buildWalletConnection({
		...connection,
		activeAccount: (
			connection.status === BlockheadConnectionStatus.Connected ?
				connection.activeAccount
			:
				undefined
		),
		selected: (
			connection.status === BlockheadConnectionStatus.Connected
			&& connection.selected
			&& connection.accounts.length > 0
		),
		...(
			connection.status === BlockheadConnectionStatus.Error ?
				{ error: connection.error }
			:
				{ error: undefined }
		),
	})
)

/** Coerce any flat or machine row into a legal persisted snapshot (EIP-1193-shaped). */
export const walletConnectionPersistRoundTrip = (
	row: PersistedWalletConnection | WalletConnection
): PersistedWalletConnection => (
	persistWalletConnection(
		walletConnectionFromPersisted(
			'selected' in row ?
				row
			:
				persistWalletConnection(row)
		)
	)
)

export const applyWalletConnectionSelection = (
	connections: readonly WalletConnection[],
	connectionKey: string,
	account: WalletAccount
): WalletConnection[] => (
	connections.map((connection) => {
		if (connection.status !== BlockheadConnectionStatus.Connected)
			return connection

		const key = walletConnectionKey(connection)
		if (key === connectionKey)
			return connectedWalletConnection({
				...connection,
				selected: true,
				activeAccount: account,
			})

		return connectedWalletConnection({
			...connection,
			selected: false,
		})
	})
)

/** Keep at most one Connected+selected row; when several exist, keep the last in list order. */
export const withExclusiveWalletConnectionSelection = (
	connections: readonly WalletConnection[]
): WalletConnection[] => {
	const selectedKeys = connections
		.filter(isSelectedWalletConnection)
		.map(walletConnectionKey)
	if (selectedKeys.length <= 1)
		return [...connections]

	const keepKey = selectedKeys.at(-1)
	return connections.map((connection) => (
		isSelectedWalletConnection(connection)
		&& walletConnectionKey(connection) !== keepKey ?
			connectedWalletConnection({
				...connection,
				selected: false,
			})
		:
			connection
	))
}

/** Adapter subscription updates must not clobber an existing Connected selection bit. */
export const preserveWalletConnectionSelection = (
	previous: WalletConnection | undefined,
	next: WalletConnection
): WalletConnection => {
	if (
		previous?.status !== BlockheadConnectionStatus.Connected
		|| next.status !== BlockheadConnectionStatus.Connected
	)
		return next

	return connectedWalletConnection({
		...next,
		selected: previous.selected,
		...(next.activeAccount != null && { activeAccount: next.activeAccount }),
		...(next.connectedAt != null && { connectedAt: next.connectedAt }),
	})
}

export const disconnectWalletConnection = (
	connection: WalletConnection,
	disconnectedAt = Date.now()
): Extract<WalletConnection, { status: BlockheadConnectionStatus.Disconnected }> => (
	disconnectedWalletConnection({
		walletId: connection.walletId,
		protocol: connection.protocol,
		transportKind: connection.transportKind,
		scopes: connection.scopes,
		accounts: connection.accounts,
		disconnectedAt,
		...(connection.connectionKey != null && { connectionKey: connection.connectionKey }),
		...(connection.activeAccount != null && { activeAccount: connection.activeAccount }),
		...(connection.sessionId != null && { sessionId: connection.sessionId }),
		...(connection.sessionTopic != null && { sessionTopic: connection.sessionTopic }),
		...(
			connection.status === BlockheadConnectionStatus.Connected
			&& connection.connectedAt != null
			&& { connectedAt: connection.connectedAt }
		),
	})
)

export type WalletConnectionIdentity = {
	walletId: string
	protocol: WalletProtocol
	transportKind: WalletTransportKind
	scopes?: WalletScope[]
	accounts?: WalletAccount[]
	activeAccount?: WalletAccount
	connectionKey?: string
	sessionId?: string
	sessionTopic?: string
}
