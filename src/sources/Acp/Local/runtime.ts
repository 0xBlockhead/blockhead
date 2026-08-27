import type { AcpLocalHistoryBoundary, AcpLocalHistorySnapshot, AcpLocalInitializeResult, AcpLocalRuntime, AcpLocalSessionSnapshot } from './types.ts'

let configuredRuntime: AcpLocalRuntime | undefined

export const configureAcpLocalRuntime = (runtime: AcpLocalRuntime | undefined) => {
	configuredRuntime = runtime
}

export const getAcpLocalRuntime = () => {
	if (configuredRuntime == null)
		throw new Error('AcpLocal_JsonRpc: local runtime unavailable')
	return configuredRuntime
}

export const materializeAcpLocalSession = async (
	runtime: AcpLocalRuntime,
	sessionId: string,
	boundary: AcpLocalHistoryBoundary
) => {
	const session = await runtime.readSession(sessionId)
	const durable = await runtime.readHistory(session.sessionId, boundary)
	return {
		session,
		durable,
		identity: {
			runtimeId: session.runtimeId,
			sessionId: session.sessionId,
		},
		historyBoundary: {
			sequenceStart: durable.sequenceStart,
			sequenceEnd: durable.sequenceEnd,
		},
	}
}

export const createAcpLocalRuntime = ({
	runtimeId,
	transportKind,
	processId,
	initializedAt,
	initialize,
	readSession,
	listSessions,
	readHistory,
}: AcpLocalRuntime): AcpLocalRuntime => ({
	runtimeId,
	transportKind,
	...(processId != null && { processId }),
	...(initializedAt != null && { initializedAt }),
	initialize,
	readSession: async (sessionId) => {
		const session = await readSession(sessionId)
		if (session.runtimeId !== runtimeId)
			throw new Error(`AcpLocal_JsonRpc: session ${sessionId} belongs to another runtime`)
		return session
	},
	listSessions: async () => (await listSessions()).filter((session) => session.runtimeId === runtimeId),
	readHistory: async (sessionId, boundary) => {
		if (boundary.limit < 0 || !Number.isInteger(boundary.limit))
			throw new Error('AcpLocal_JsonRpc: invalid history limit')
		const history = await readHistory(sessionId, boundary)
		if (history.sessionId !== sessionId || history.sequenceEnd < history.sequenceStart)
			throw new Error('AcpLocal_JsonRpc: invalid durable history boundary')
		return history
	},
})

export type { AcpLocalHistoryBoundary, AcpLocalHistorySnapshot, AcpLocalInitializeResult, AcpLocalRuntime, AcpLocalSessionSnapshot }
