import { beforeAll, describe, expect, it } from 'vitest'

import localInternal from '$/resolvers/Local.ts'
import { readNormalizedLocalInternal } from '$/resolvers/Local/Internal/catalog.ts'
import { EntityMetaKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'


const context = {
	filters: [],
	sorts: [],
	pagination: {},
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [],
	publicEnv: {},
}

const walletRequestResolver = localInternal.resolvers.find((resolver) => (
	resolver.entityType === EntityType.BlockheadWalletRequest
	&& 'Id' in resolver.resolve
	&& 'requestKind' in resolver.projections
))

const evmWalletRequestResolver = localInternal.resolvers.find((resolver) => (
	resolver.entityType === EntityType.BlockheadEvmWalletRequest
	&& 'EvmWalletRequest' in resolver.resolve
	&& '$network' in resolver.projections
))

const walletConnectionResolver = localInternal.resolvers.find((resolver) => (
	resolver.entityType === EntityType.BlockheadWalletConnection
	&& 'ConnectionKey' in resolver.resolve
	&& '$$accounts' in resolver.projections
))

const callResolver = localInternal.resolvers.find((resolver) => (
	resolver.entityType === EntityType.BlockheadWalletRequestCall
	&& 'EvmWalletRequestCallIndex' in resolver.resolve
))

const timestampResolver = localInternal.resolvers.find((resolver) => (
	resolver.entityType === EntityType.BlockheadWalletRequest_Timestamp
	&& 'WalletRequestTimestampMsSource' in resolver.resolve
))

const globalWalletRequestsResolver = localInternal.resolvers.find((resolver) => (
	resolver.entityType === EntityType._Global
	&& '$$blockheadWalletRequests' in resolver.projections
))

const sessionActionWalletRequestsResolver = localInternal.resolvers.find((resolver) => (
	resolver.entityType === EntityType.BlockheadSessionAction
	&& '$$walletRequests' in resolver.projections
))

const timestampsListResolver = localInternal.resolvers.find((resolver) => (
	resolver.entityType === EntityType.BlockheadWalletRequest
	&& '$$timestamps' in resolver.projections
))

const callsListResolver = localInternal.resolvers.find((resolver) => (
	resolver.entityType === EntityType.BlockheadEvmWalletRequest
	&& '$$calls' in resolver.projections
))

if (
	walletRequestResolver == null
	|| evmWalletRequestResolver == null
	|| walletConnectionResolver == null
	|| callResolver == null
	|| timestampResolver == null
	|| globalWalletRequestsResolver == null
	|| sessionActionWalletRequestsResolver == null
	|| timestampsListResolver == null
	|| callsListResolver == null
)
	throw new Error('Local wallet request resolvers missing from Local_Internal module')


describe('Local_Internal wallet request resolvers', () => {
	beforeAll(() => {
		// Warm Local catalog + schema graph before cold-import resolve paths.
		expect(readNormalizedLocalInternal().blockheadWalletRequests).toEqual(
			expect.arrayContaining([
				expect.objectContaining({ id: 'e2e-probe-wallet-request' }),
			])
		)
	})

	it('resolves the probe wallet request with connection and EVM detail refs', { timeout: 60_000 }, async () => {
		const snapshot = await walletRequestResolver.resolve.Id.resolve(
			{ id: 'e2e-probe-wallet-request' },
			context
		)
		expect(snapshot).toMatchObject({
			id: 'e2e-probe-wallet-request',
			requestKind: 'transaction',
			requestMethod: 'eth_sendTransaction',
			$walletConnection: {
				[EntityMetaKey.Selector]: {
					connectionKey: 'e2e-probe-wallet-connection',
				},
			},
			$evmRequest: {
				[EntityMetaKey.Selector]: {
					$walletRequest: {
						id: 'e2e-probe-wallet-request',
					},
				},
			},
			$sessionAction: {
				[EntityMetaKey.Selector]: {
					sessionId: 'e2e-probe-session',
					actionId: 'e2e-probe-session-action-0',
				},
			},
		})
	})

	it('keeps connected accounts public without locally enrolling them', { timeout: 60_000 }, async () => {
		await expect(walletConnectionResolver.resolve.ConnectionKey.resolve(
			{ connectionKey: 'e2e-probe-wallet-connection' },
			context
		)).resolves.toMatchObject({
			$$accounts: [
				{
					[EntityMetaKey.Selector]: {
						caip10: {
							namespace: 'eip155',
							reference: '1',
							accountAddress: '0xd8da6bf26964af9d7eed9e403e826090792bed6a',
						},
					},
				},
			],
			$activeAccount: {
				[EntityMetaKey.Selector]: {
					caip10: {
						namespace: 'eip155',
						reference: '1',
						accountAddress: '0xd8da6bf26964af9d7eed9e403e826090792bed6a',
					},
				},
			},
		})

		expect(localInternal.resolvers.some((resolver) => (
			resolver.entityType === EntityType.BlockheadAccount
		))).toBe(true)
	})

	it('resolves EVM detail, call, and prepared timestamp rows', { timeout: 60_000 }, async () => {
		await expect(evmWalletRequestResolver.resolve.EvmWalletRequest.resolve({
			$walletRequest: { id: 'e2e-probe-wallet-request' },
		}, context)).resolves.toMatchObject({
			$network: {
				[EntityMetaKey.Selector]: {
					caip2: {
						namespace: 'eip155',
						reference: '1',
					},
				},
			},
			$simulation: {
				[EntityMetaKey.Selector]: {
					id: 'e2e-probe-session-simulation',
				},
			},
		})

		await expect(callResolver.resolve.EvmWalletRequestCallIndex.resolve({
			$evmRequest: {
				$walletRequest: { id: 'e2e-probe-wallet-request' },
			},
			callIndex: 0,
		}, context)).resolves.toMatchObject({
			callIndex: 0,
			toAddress: '0x0000000000000000000000000000000000000001',
			value: 0n,
			inputDataHash: '0x2222222222222222222222222222222222222222222222222222222222222222',
		})

		await expect(timestampResolver.resolve.WalletRequestTimestampMsSource.resolve({
			$walletRequest: { id: 'e2e-probe-wallet-request' },
			timestampMs: 0,
			source: 'Local_Internal',
		}, context)).resolves.toMatchObject({
			status: 'prepared',
			source: Source.Local_Internal,
		})
	})

	it('lists global, session-action, timestamp, and call facets from the catalog', { timeout: 60_000 }, async () => {
		await expect(globalWalletRequestsResolver.resolve.Scope.resolve(
			{ scope: '$$blockheadWalletRequests' },
			context
		)).resolves.toEqual([
			{
				[EntityMetaKey.Selector]: {
					id: 'e2e-probe-wallet-request',
				},
			},
		])

		await expect(sessionActionWalletRequestsResolver.resolve.SessionIdActionId.resolve({
			sessionId: 'e2e-probe-session',
			actionId: 'e2e-probe-session-action-0',
		}, context)).resolves.toEqual([
			{
				[EntityMetaKey.Selector]: {
					id: 'e2e-probe-wallet-request',
				},
			},
		])

		await expect(timestampsListResolver.resolve.Id.resolve(
			{ id: 'e2e-probe-wallet-request' },
			context
		)).resolves.toEqual([
			{
				[EntityMetaKey.Selector]: {
					$walletRequest: { id: 'e2e-probe-wallet-request' },
					timestampMs: 0,
					source: 'Local_Internal',
				},
			},
		])

		await expect(callsListResolver.resolve.EvmWalletRequest.resolve({
			$walletRequest: { id: 'e2e-probe-wallet-request' },
		}, context)).resolves.toEqual([
			{
				[EntityMetaKey.Selector]: {
					$evmRequest: {
						$walletRequest: { id: 'e2e-probe-wallet-request' },
					},
					callIndex: 0,
				},
			},
		])
	})

	it('rejects calls for an absent EVM request instead of composing an empty list', { timeout: 60_000 }, async () => {
		await expect(callsListResolver.resolve.EvmWalletRequest.resolve({
			$walletRequest: { id: 'missing-wallet-request' },
		}, context)).rejects.toThrow(
			'Local_Internal: BlockheadEvmWalletRequest not present in local catalog'
		)
	})
})
