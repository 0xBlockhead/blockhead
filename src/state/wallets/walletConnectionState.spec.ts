import { describe, expect, it } from 'vitest'

import { WalletProtocol, WalletTransportKind } from '$/constants/Wallet.ts'
import { BlockheadConnectionStatus } from '$/schema/BlockheadConnectionStatus.ts'
import type { WalletConnection } from './adapters/types.ts'
import {
	applyWalletConnectionSelection,
	buildWalletConnection,
	connectedWalletConnection,
	connectingWalletConnection,
	disconnectWalletConnection,
	erroredWalletConnection,
	isSelectedWalletConnection,
	persistWalletConnection,
	preserveWalletConnectionSelection,
	walletConnectionError,
	walletConnectionFromPersisted,
	walletConnectionKey,
	walletConnectionPersistRoundTrip,
	withExclusiveWalletConnectionSelection,
} from './walletConnectionState.ts'


const base = {
	walletId: 'eip6963:com.example',
	protocol: WalletProtocol.Eip6963,
	transportKind: WalletTransportKind.InjectedProvider,
	scopes: [],
	accounts: [{
		namespace: 'eip155',
		reference: '1',
		accountAddress: '0x1111111111111111111111111111111111111111',
		capabilities: [],
	}],
} as const


describe('walletConnectionState', () => {
	it('makes connecting exclusive of selected and error', () => {
		const connection = connectingWalletConnection(base)
		expect(connection.status).toBe(BlockheadConnectionStatus.Connecting)
		expect(connection).not.toHaveProperty('selected')
		expect(connection).not.toHaveProperty('error')
		expect(isSelectedWalletConnection(connection)).toBe(false)
		expect(walletConnectionError(connection)).toBeUndefined()
	})

	it('requires error on Error and forbids selected', () => {
		const connection = erroredWalletConnection({
			...base,
			error: 'denied',
		})
		expect(connection).toMatchObject({
			walletId: base.walletId,
			protocol: base.protocol,
			transportKind: base.transportKind,
			status: BlockheadConnectionStatus.Error,
			error: 'denied',
		})
		expect(connection).not.toHaveProperty('selected')
		expect(connection).not.toHaveProperty('sessionTopic')
		expect(walletConnectionError(connection)).toBe('denied')
	})

	it('forbids activeAccount on disconnected rows', () => {
		const disconnected = disconnectWalletConnection(
			connectedWalletConnection({
				...base,
				selected: true,
				connectedAt: 10,
			}),
			20
		)
		expect(disconnected.status).toBe(BlockheadConnectionStatus.Disconnected)
		expect(disconnected.activeAccount).toBeUndefined()
		expect(disconnected).not.toHaveProperty('selected')
		expect(disconnected.disconnectedAt).toBe(20)
	})

	it('keeps Connected.selected as an exclusive true/false branch', () => {
		const selected = connectedWalletConnection({
			...base,
			selected: true,
			connectedAt: 10,
		})
		const unselected = connectedWalletConnection({
			...base,
			selected: false,
		})
		expect(isSelectedWalletConnection(selected)).toBe(true)
		expect(isSelectedWalletConnection(unselected)).toBe(false)
		expect(selected.selected).toBe(true)
		expect(unselected.selected).toBe(false)
	})

	it('strips sessionTopic from non-WalletConnect protocols', () => {
		const connected = connectedWalletConnection({
			...base,
			sessionTopic: 'should-not-persist',
			selected: true,
		})
		expect(connected.protocol).toBe(WalletProtocol.Eip6963)
		expect(connected.sessionTopic).toBeUndefined()
	})

	it('requires sessionTopic on settled WalletConnect connections', () => {
		const connected = connectedWalletConnection({
			walletId: 'walletconnect-v2',
			protocol: WalletProtocol.WalletConnectV2,
			transportKind: WalletTransportKind.WalletConnectRelay,
			scopes: [],
			accounts: [...base.accounts],
			sessionTopic: 'topic-abc',
			selected: true,
		})
		expect(connected).toMatchObject({
			protocol: WalletProtocol.WalletConnectV2,
			sessionTopic: 'topic-abc',
			selected: true,
		})
	})


	it('coerces illegal persisted combos when hydrating', () => {
		const disconnected = walletConnectionFromPersisted({
			...base,
			status: BlockheadConnectionStatus.Disconnected,
			selected: true,
			activeAccount: base.accounts[0],
			sessionId: 'historical-session',
			error: 'stale',
			disconnectedAt: 5,
		})
		expect(disconnected.status).toBe(BlockheadConnectionStatus.Disconnected)
		expect(disconnected).not.toHaveProperty('selected')
		expect(disconnected.activeAccount).toBeUndefined()
		expect(disconnected.sessionId).toBe('historical-session')
		expect(disconnected.accounts[0].capabilities).toEqual([])
		expect(disconnected).not.toHaveProperty('error')
		expect(persistWalletConnection(disconnected)).toMatchObject({
			status: BlockheadConnectionStatus.Disconnected,
			sessionId: 'historical-session',
			connectionKey: expect.any(String),
		})
		expect(persistWalletConnection(disconnected)).not.toHaveProperty('selected')
		expect(persistWalletConnection(disconnected).activeAccount).toBeUndefined()
		expect(persistWalletConnection(disconnected)).not.toHaveProperty('error')

		const connected = walletConnectionFromPersisted({
			...base,
			status: BlockheadConnectionStatus.Connected,
			selected: true,
			error: 'stale',
			connectedAt: 3,
		})
		expect(connected).toMatchObject({
			status: BlockheadConnectionStatus.Connected,
			selected: true,
			connectedAt: 3,
		})
		expect(connected).not.toHaveProperty('error')

		const errored = walletConnectionFromPersisted({
			...base,
			status: BlockheadConnectionStatus.Error,
			selected: true,
			error: 'denied',
		})
		expect(errored).toEqual({
			...base,
			status: BlockheadConnectionStatus.Error,
			error: 'denied',
		})
		expect(errored).not.toHaveProperty('selected')
	})

	it('applies selection only to Connected rows', () => {
		const connections = [
			connectingWalletConnection(base),
			connectedWalletConnection({
				...base,
				connectionKey: 'a',
				selected: false,
			}),
			erroredWalletConnection({
				...base,
				walletId: 'other',
				connectionKey: 'b',
				error: 'fail',
			}),
		]
		const next = applyWalletConnectionSelection(
			connections,
			'a',
			base.accounts[0]
		)
		expect(next[0].status).toBe(BlockheadConnectionStatus.Connecting)
		expect(next[0]).not.toHaveProperty('selected')
		expect(isSelectedWalletConnection(next[1])).toBe(true)
		expect(next[2].status).toBe(BlockheadConnectionStatus.Error)
		expect(next[2]).not.toHaveProperty('selected')
	})

	it('keeps only the last selected Connected row when several claim selection', () => {
		const exclusive = withExclusiveWalletConnectionSelection([
			connectedWalletConnection({
				...base,
				connectionKey: 'older',
				selected: true,
			}),
			connectedWalletConnection({
				...base,
				walletId: 'eip6963:other',
				connectionKey: 'newer',
				selected: true,
			}),
			connectingWalletConnection({
				...base,
				walletId: 'eip6963:connecting',
				connectionKey: 'pending',
			}),
		])
		expect(exclusive.map((connection) => ({
			key: walletConnectionKey(connection),
			selected: isSelectedWalletConnection(connection),
		}))).toEqual([
			{ key: 'older', selected: false },
			{ key: 'newer', selected: true },
			{ key: 'pending', selected: false },
		])
		expect(withExclusiveWalletConnectionSelection([
			connectedWalletConnection({
				...base,
				connectionKey: 'solo',
				selected: true,
			}),
		])).toEqual([
			expect.objectContaining({
				connectionKey: 'solo',
				selected: true,
			}),
		])
	})

	it('preserves Connected selection across adapter subscription rebuilds', () => {
		const previous = connectedWalletConnection({
			...base,
			connectionKey: 'a',
			selected: true,
			connectedAt: 10,
		})
		const nextFromAdapter = connectedWalletConnection({
			...base,
			connectionKey: 'a',
			selected: false,
			accounts: [
				base.accounts[0],
				{
					namespace: 'eip155',
					reference: '1',
					accountAddress: '0x2222222222222222222222222222222222222222',
					capabilities: [],
				},
			],
			activeAccount: {
				namespace: 'eip155',
				reference: '1',
				accountAddress: '0x2222222222222222222222222222222222222222',
				capabilities: [],
			},
		})
		expect(preserveWalletConnectionSelection(previous, nextFromAdapter)).toMatchObject({
			connectionKey: 'a',
			selected: true,
			activeAccount: nextFromAdapter.activeAccount,
		})
		expect(preserveWalletConnectionSelection(
			connectingWalletConnection(base),
			nextFromAdapter
		)).toMatchObject({
			selected: false,
		})
	})

	it('disconnect clears selection and stamps disconnectedAt', () => {
		const disconnected = disconnectWalletConnection(
			connectedWalletConnection({
				...base,
				connectionKey: 'a',
				selected: true,
				connectedAt: 1,
			}),
			99
		)
		expect(disconnected).toMatchObject({
			walletId: base.walletId,
			protocol: base.protocol,
			transportKind: base.transportKind,
			connectionKey: 'a',
			status: BlockheadConnectionStatus.Disconnected,
			connectedAt: 1,
			disconnectedAt: 99,
		})
		expect(disconnected.activeAccount).toBeUndefined()
		expect(disconnected).not.toHaveProperty('selected')
		expect(walletConnectionKey(disconnected)).toBe('a')
	})

	it('demotes selection when Connected has no accounts (EIP-1193 empty accounts)', () => {
		const connection = connectedWalletConnection({
			...base,
			accounts: [],
			activeAccount: undefined,
			selected: true,
		})
		expect(connection.selected).toBe(false)
		expect(isSelectedWalletConnection(connection)).toBe(false)
		expect(persistWalletConnection(connection)).toMatchObject({
			status: BlockheadConnectionStatus.Connected,
			selected: false,
		})
		expect(persistWalletConnection(connection)).not.toHaveProperty('error')
	})

	it('round-trips illegal flat rows into legal persisted snapshots', () => {
		const snapped = walletConnectionPersistRoundTrip({
			...base,
			status: BlockheadConnectionStatus.Error,
			selected: true,
			error: 'denied',
			connectedAt: 9,
		})
		expect(snapped).toMatchObject({
			walletId: base.walletId,
			protocol: base.protocol,
			transportKind: base.transportKind,
			status: BlockheadConnectionStatus.Error,
			error: 'denied',
			connectionKey: base.walletId,
		})
		expect(snapped).not.toHaveProperty('selected')
		expect(snapped).not.toHaveProperty('connectedAt')

		const connectedEmpty = walletConnectionPersistRoundTrip({
			...base,
			accounts: [],
			status: BlockheadConnectionStatus.Connected,
			selected: true,
			error: 'stale',
			connectedAt: 3,
		})
		expect(connectedEmpty).toMatchObject({
			status: BlockheadConnectionStatus.Connected,
			selected: false,
			connectedAt: 3,
			connectionKey: base.walletId,
		})
		expect(connectedEmpty).not.toHaveProperty('error')
	})

	it('rejects illegal WalletConnection literals at the type level', () => {
		const legal: WalletConnection = buildWalletConnection({
			...base,
			status: BlockheadConnectionStatus.Connected,
			selected: true,
		})

		// @ts-expect-error connecting cannot be selected
		const _connectingSelected: WalletConnection = {
			...base,
			status: BlockheadConnectionStatus.Connecting,
			selected: true,
		}
		// @ts-expect-error error status requires error string
		const _errorWithoutMessage: WalletConnection = {
			...base,
			status: BlockheadConnectionStatus.Error,
		}
		// @ts-expect-error disconnected cannot carry selected
		const _disconnectedSelected: WalletConnection = {
			...base,
			status: BlockheadConnectionStatus.Disconnected,
			selected: true,
		}
		// @ts-expect-error connected cannot carry error
		const _connectedWithError: WalletConnection = {
			...base,
			status: BlockheadConnectionStatus.Connected,
			selected: false,
			error: 'nope',
		}

		expect(legal.status).toBe(BlockheadConnectionStatus.Connected)
		void _connectingSelected
		void _errorWithoutMessage
		void _disconnectedSelected
		void _connectedWithError
	})
})
