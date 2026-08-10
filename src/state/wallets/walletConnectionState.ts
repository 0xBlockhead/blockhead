import {
	WalletProtocol,
	type WalletTransportKind,
} from '$/constants/Wallet.ts'
import { BlockheadConnectionStatus } from '$/schema/BlockheadConnectionStatus.ts'
import type {
	WalletAccount,
	WalletConnectingSession,
	WalletConnection,
	WalletConnectionBase,
	WalletScope,
	WalletSettledSession,
} from './adapters/types.ts'
import {
	coerceWalletAccount,
	isWalletAccountsNonEmpty,
} from './adapters/types.ts'


export type WalletConnectionWire = WalletConnectionBase & {
	status: BlockheadConnectionStatus
	selected?: boolean
	connectedAt?: number
	disconnectedAt?: number
	error?: string
}

/** Durable snapshot after coercion — illegal status/session/selection combos are unrepresentable. */
export type PersistedWalletConnection = WalletConnection & {
	connectionKey: string
}


export const walletConnectionKey = (
	connection: Pick<WalletConnectionBase, 'connectionKey' | 'sessionTopic' | 'sessionId' | 'walletId'>
) => (
	connection.connectionKey
	?? connection.sessionTopic
	?? connection.sessionId
	?? connection.walletId
)

const coerceWalletConnectionBase = (
	base: WalletConnectionBase
): WalletConnectionBase => ({
	...base,
	accounts: base.accounts.map(coerceWalletAccount),
	...(base.activeAccount != null && {
		activeAccount: coerceWalletAccount(base.activeAccount),
	}),
})

const connectionIdentity = (
	base: WalletConnectionBase
) => ({
	walletId: base.walletId,
	transportKind: base.transportKind,
	scopes: base.scopes,
	accounts: base.accounts,
	...(base.connectionKey != null && { connectionKey: base.connectionKey }),
})

const connectingSession = (
	base: WalletConnectionBase
): WalletConnectingSession => (
	base.protocol === WalletProtocol.WalletConnectV2 ?
		{
			protocol: WalletProtocol.WalletConnectV2,
			...(base.sessionTopic != null && { sessionTopic: base.sessionTopic }),
			...(base.sessionId != null && { sessionId: base.sessionId }),
		}
	:
		{
			protocol: base.protocol,
			...(base.sessionId != null && { sessionId: base.sessionId }),
		}
)

const settledSession = (
	base: WalletConnectionBase
): WalletSettledSession => {
	if (base.protocol === WalletProtocol.WalletConnectV2) {
		const sessionTopic = base.sessionTopic ?? base.sessionId ?? base.connectionKey ?? base.walletId
		return {
			protocol: WalletProtocol.WalletConnectV2,
			sessionTopic,
			...(base.sessionId != null && { sessionId: base.sessionId }),
		}
	}

	return {
		protocol: base.protocol,
		...(base.sessionId != null && { sessionId: base.sessionId }),
	}
}

export const connectingWalletConnection = (
	base: WalletConnectionBase
): Extract<WalletConnection, { status: BlockheadConnectionStatus.Connecting }> => {
	const coerced = coerceWalletConnectionBase(base)
	return {
		...connectionIdentity(coerced),
		...connectingSession(coerced),
		status: BlockheadConnectionStatus.Connecting,
		...(coerced.activeAccount != null && { activeAccount: coerced.activeAccount }),
	}
}

export const connectedWalletConnection = (
	base: WalletConnectionBase & {
		selected: boolean
		connectedAt?: number
	}
): Extract<WalletConnection, { status: BlockheadConnectionStatus.Connected }> => {
	const coerced = coerceWalletConnectionBase(base)
	const activeAccount = (
		coerced.activeAccount != null
		&& coerced.accounts.some((account) => (
			account.namespace === coerced.activeAccount?.namespace
			&& account.reference === coerced.activeAccount.reference
			&& account.accountAddress === coerced.activeAccount.accountAddress
		))
	) ?
		coerced.activeAccount
	:
		coerced.accounts.at(0)
	if (
		base.selected
		&& isWalletAccountsNonEmpty(coerced.accounts)
		&& activeAccount != null
	)
		return {
			...connectionIdentity(coerced),
			...settledSession(coerced),
			accounts: coerced.accounts,
			activeAccount,
			status: BlockheadConnectionStatus.Connected,
			selected: true,
			...(base.connectedAt != null && { connectedAt: base.connectedAt }),
		}

	return {
		...connectionIdentity(coerced),
		...settledSession(coerced),
		accounts: coerced.accounts,
		status: BlockheadConnectionStatus.Connected,
		selected: false,
		...(activeAccount != null && { activeAccount }),
		...(base.connectedAt != null && { connectedAt: base.connectedAt }),
	}
}

export const disconnectedWalletConnection = (
	base: WalletConnectionBase & {
		disconnectedAt?: number
		connectedAt?: number
	}
): Extract<WalletConnection, { status: BlockheadConnectionStatus.Disconnected }> => {
	const coerced = coerceWalletConnectionBase(base)
	return {
		...connectionIdentity(coerced),
		...settledSession(coerced),
		status: BlockheadConnectionStatus.Disconnected,
		...(base.disconnectedAt != null && { disconnectedAt: base.disconnectedAt }),
		...(base.connectedAt != null && { connectedAt: base.connectedAt }),
	}
}

export const erroredWalletConnection = (
	base: WalletConnectionBase & {
		error: string
		disconnectedAt?: number
	}
): Extract<WalletConnection, { status: BlockheadConnectionStatus.Error }> => {
	const coerced = coerceWalletConnectionBase(base)
	return {
		...connectionIdentity(coerced),
		...settledSession(coerced),
		status: BlockheadConnectionStatus.Error,
		error: base.error,
		...(base.disconnectedAt != null && { disconnectedAt: base.disconnectedAt }),
	}
}

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
): PersistedWalletConnection => ({
	...connection,
	connectionKey: walletConnectionKey(connection),
})

export const walletConnectionFromPersisted = (
	connection: WalletConnectionWire | WalletConnection
): WalletConnection => (
	buildWalletConnection({
		connectionKey: connection.connectionKey ?? walletConnectionKey(connection),
		walletId: connection.walletId,
		protocol: connection.protocol,
		transportKind: connection.transportKind,
		scopes: connection.scopes,
		accounts: connection.accounts,
		...(connection.sessionId != null && { sessionId: connection.sessionId }),
		...(connection.sessionTopic != null && { sessionTopic: connection.sessionTopic }),
		activeAccount: (
			connection.status === BlockheadConnectionStatus.Connected ?
				connection.activeAccount
			:
				undefined
		),
		status: connection.status,
		selected: (
			connection.status === BlockheadConnectionStatus.Connected
			&& (
				'selected' in connection ?
					connection.selected === true
				:
					false
			)
			&& connection.accounts.length > 0
		),
		...(
			'connectedAt' in connection
			&& connection.connectedAt != null
			&& { connectedAt: connection.connectedAt }
		),
		...(
			'disconnectedAt' in connection
			&& connection.disconnectedAt != null
			&& { disconnectedAt: connection.disconnectedAt }
		),
		...(
			connection.status === BlockheadConnectionStatus.Error ?
				{
					error: (
						'error' in connection
						&& typeof connection.error === 'string'
					) ?
						connection.error
					:
						'Unknown wallet connection error'
				}
			:
				{ error: undefined }
		),
	})
)

/** Coerce any flat or machine row into a legal persisted snapshot. */
export const walletConnectionPersistRoundTrip = (
	row: WalletConnectionWire | WalletConnection
): PersistedWalletConnection => (
	persistWalletConnection(
		walletConnectionFromPersisted(row)
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
