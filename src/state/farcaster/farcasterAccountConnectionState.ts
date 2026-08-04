import type { FarcasterAccountAuthMethod } from '$/state/farcaster/farcasterAccountConnectionRuntime.ts'


export type FarcasterAccountConnectionBase = {
	connectionId: string
	fid: number
	signerAddress: string
	authMethod: FarcasterAccountAuthMethod
	verifiedAt: number
	expiresAt: number
	associationFingerprint: string
}

export type FarcasterAccountConnection =
	| (
		FarcasterAccountConnectionBase & {
			role: 'viewer'
		}
	)
	| (
		FarcasterAccountConnectionBase & {
			role: 'standby'
		}
	)

export type PersistedFarcasterAccountConnection = FarcasterAccountConnectionBase & {
	selected: boolean
}


export const isCurrentFarcasterAccountConnection = (
	connection: Pick<FarcasterAccountConnectionBase, 'expiresAt'>,
	now = Date.now()
) => (
	connection.expiresAt > now
)

export const viewerFarcasterAccountConnection = (
	base: FarcasterAccountConnectionBase
): Extract<FarcasterAccountConnection, { role: 'viewer' }> => ({
	...base,
	role: 'viewer',
})

export const standbyFarcasterAccountConnection = (
	base: FarcasterAccountConnectionBase
): Extract<FarcasterAccountConnection, { role: 'standby' }> => ({
	...base,
	role: 'standby',
})

export const buildFarcasterAccountConnection = ({
	selected = false,
	...base
}: FarcasterAccountConnectionBase & {
	selected?: boolean
}): FarcasterAccountConnection => (
	selected ?
		viewerFarcasterAccountConnection(base)
	:
		standbyFarcasterAccountConnection(base)
)

export const isViewerFarcasterAccountConnection = (
	connection: FarcasterAccountConnection
): connection is Extract<FarcasterAccountConnection, { role: 'viewer' }> => (
	connection.role === 'viewer'
)

export const persistFarcasterAccountConnection = (
	connection: FarcasterAccountConnection
): PersistedFarcasterAccountConnection => ({
	connectionId: connection.connectionId,
	fid: connection.fid,
	signerAddress: connection.signerAddress,
	authMethod: connection.authMethod,
	verifiedAt: connection.verifiedAt,
	expiresAt: connection.expiresAt,
	associationFingerprint: connection.associationFingerprint,
	selected: connection.role === 'viewer',
})

export const farcasterAccountConnectionFromPersisted = (
	connection: PersistedFarcasterAccountConnection,
	now = Date.now()
): FarcasterAccountConnection | undefined => {
	if (!isCurrentFarcasterAccountConnection(connection, now))
		return undefined

	return buildFarcasterAccountConnection(connection)
}

export const applyFarcasterAccountConnectionSelection = (
	connections: readonly FarcasterAccountConnection[],
	connectionId: string,
	now = Date.now()
): {
	connections: FarcasterAccountConnection[]
	viewer: Extract<FarcasterAccountConnection, { role: 'viewer' }> | undefined
	selected: boolean
} => {
	const current = connections.filter((connection) => (
		isCurrentFarcasterAccountConnection(connection, now)
	))
	const target = current.find((connection) => connection.connectionId === connectionId)
	if (target == null) {
		return {
			connections: current,
			viewer: current.find(isViewerFarcasterAccountConnection),
			selected: false,
		}
	}

	const viewer = viewerFarcasterAccountConnection(target)
	return {
		connections: current.map((connection) => (
			connection.connectionId === connectionId ?
				viewer
			:
				standbyFarcasterAccountConnection(connection)
		)),
		viewer,
		selected: true,
	}
}

export const viewerFidFromFarcasterAccountConnections = (
	connections: readonly FarcasterAccountConnection[],
	now = Date.now()
) => (
	connections.find((connection) => (
		isViewerFarcasterAccountConnection(connection)
		&& isCurrentFarcasterAccountConnection(connection, now)
	))?.fid
)
