import { describe, expect, it } from 'vitest'

import type { FarcasterAccountConnection } from '$/state/farcaster/farcasterAccountConnectionState.ts'
import {
	applyFarcasterAccountConnectionSelection,
	buildFarcasterAccountConnection,
	farcasterAccountConnectionFromPersisted,
	isCurrentFarcasterAccountConnection,
	isViewerFarcasterAccountConnection,
	persistFarcasterAccountConnection,
	standbyFarcasterAccountConnection,
	viewerFarcasterAccountConnection,
	viewerFidFromFarcasterAccountConnections,
} from '$/state/farcaster/farcasterAccountConnectionState.ts'


const base = {
	connectionId: 'connection-1',
	fid: 3,
	signerAddress: '0x1111111111111111111111111111111111111111',
	authMethod: 'custody' as const,
	verifiedAt: 1_000,
	expiresAt: 10_000,
	associationFingerprint: 'custody:1',
}


describe('farcasterAccountConnectionState', () => {
	it('makes viewer and standby exclusive roles', () => {
		const viewer = viewerFarcasterAccountConnection(base)
		const standby = standbyFarcasterAccountConnection(base)
		expect(isViewerFarcasterAccountConnection(viewer)).toBe(true)
		expect(isViewerFarcasterAccountConnection(standby)).toBe(false)
		expect(viewer).not.toHaveProperty('selected')
		expect(standby).not.toHaveProperty('selected')
		expect(persistFarcasterAccountConnection(viewer).selected).toBe(true)
		expect(persistFarcasterAccountConnection(standby).selected).toBe(false)
	})

	it('drops expired persisted rows instead of hydrating a selected viewer', () => {
		expect(farcasterAccountConnectionFromPersisted({
			...base,
			selected: true,
			expiresAt: 1,
		}, 2)).toBeUndefined()
		expect(farcasterAccountConnectionFromPersisted({
			...base,
			selected: true,
		}, 2_000)).toMatchObject({
			role: 'viewer',
			fid: 3,
		})
	})

	it('round-trips role through flat selected without retaining proof material', () => {
		const persisted = persistFarcasterAccountConnection(
			viewerFarcasterAccountConnection(base)
		)
		expect(persisted).toEqual({
			...base,
			selected: true,
		})
		expect(persisted).not.toHaveProperty('role')
		expect(farcasterAccountConnectionFromPersisted(persisted, 2_000)).toMatchObject({
			role: 'viewer',
		})
		expect(farcasterAccountConnectionFromPersisted({
			...persisted,
			selected: false,
		}, 2_000)).toMatchObject({
			role: 'standby',
		})
	})

	it('selects only a current connection and demotes other viewers', () => {
		const connections = [
			viewerFarcasterAccountConnection({
				...base,
				connectionId: 'a',
				fid: 1,
			}),
			standbyFarcasterAccountConnection({
				...base,
				connectionId: 'b',
				fid: 2,
			}),
		]
		const selected = applyFarcasterAccountConnectionSelection(connections, 'b', 2_000)
		expect(selected.viewer?.connectionId).toBe('b')
		expect(selected.connections.map((connection) => connection.role)).toEqual([
			'standby',
			'viewer',
		])
		expect(viewerFidFromFarcasterAccountConnections(selected.connections, 2_000)).toBe(2)
	})

	it('keeps the current viewer when selection target is missing or expired', () => {
		const connections = [
			viewerFarcasterAccountConnection(base),
			standbyFarcasterAccountConnection({
				...base,
				connectionId: 'expired',
				fid: 9,
				expiresAt: 1_500,
			}),
		]
		const missing = applyFarcasterAccountConnectionSelection(connections, 'missing', 2_000)
		expect(missing.selected).toBe(false)
		expect(missing.viewer?.connectionId).toBe('connection-1')
		expect(missing.connections).toHaveLength(1)

		const expiredTarget = applyFarcasterAccountConnectionSelection(connections, 'expired', 2_000)
		expect(expiredTarget.selected).toBe(false)
		expect(expiredTarget.viewer?.connectionId).toBe('connection-1')
		expect(expiredTarget.connections.every((connection) => (
			isCurrentFarcasterAccountConnection(connection, 2_000)
		))).toBe(true)
	})

	it('never treats an expired viewer as authority', () => {
		const expiredViewer = viewerFarcasterAccountConnection({
			...base,
			expiresAt: 1_500,
		})
		expect(isCurrentFarcasterAccountConnection(expiredViewer, 2_000)).toBe(false)
		expect(viewerFidFromFarcasterAccountConnections([expiredViewer], 2_000)).toBeUndefined()
	})

	it('rejects illegal FarcasterAccountConnection literals at the type level', () => {
		const legal: FarcasterAccountConnection = buildFarcasterAccountConnection({
			...base,
			selected: true,
		})

		// @ts-expect-error selected boolean is not part of the runtime machine
		const _selectedFlag: FarcasterAccountConnection = {
			...base,
			selected: true,
		}
		// @ts-expect-error role must be viewer or standby
		const _badRole: FarcasterAccountConnection = {
			...base,
			role: 'selected',
		}

		expect(legal.role).toBe('viewer')
		void _selectedFlag
		void _badRole
	})
})
