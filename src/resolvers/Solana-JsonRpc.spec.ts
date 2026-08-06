import { QueryClient } from '@tanstack/query-core'
import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import {
	entityFieldAddressKey,
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

const {
	getAccountInfo,
	getBlock,
	getBlocks,
	getParsedTokenAccountInfo,
	getParsedTokenMintAccountInfo,
	getSlot,
	getTokenAccountsByOwner,
	getVoteAccounts,
	solanaRpcEndpoints,
	subscribeSlot,
} = vi.hoisted(() => ({
	solanaRpcEndpoints: [
		{
			url: 'https://solana-rpc.publicnode.com',
			transportType: 'Http',
			providerName: 'PublicNode',
		},
		{
			url: 'wss://solana-rpc.publicnode.com',
			transportType: 'WebSocket',
			providerName: 'PublicNode',
		},
	],
	getSlot: vi.fn().mockResolvedValue(100),
	getAccountInfo: vi.fn(),
	getParsedTokenAccountInfo: vi.fn(),
	getParsedTokenMintAccountInfo: vi.fn(),
	getTokenAccountsByOwner: vi.fn(),
	getVoteAccounts: vi.fn().mockResolvedValue({
		current: [{
			activatedStake: 1_000,
			commission: 5,
			epochCredits: [[1, 2, 3]],
			lastVote: 99,
			nodePubkey: 'node-current',
			rootSlot: 98,
			votePubkey: 'vote-current',
		}],
		delinquent: [],
	}),
	getBlocks: vi.fn().mockResolvedValue([100]),
	getBlock: vi.fn().mockResolvedValue({
		blockhash: 'block-hash',
		parentSlot: 99,
		previousBlockhash: 'parent-hash',
		transactions: [{
			transaction: {
				signatures: ['signature'],
				message: {
					accountKeys: [
						{
							pubkey: 'account-1',
							signer: true,
							writable: true,
						},
					],
					instructions: [
						{
							program: 'spl-token',
							programId: 'token-program',
							parsed: {
								type: 'transferChecked',
								info: {
									source: 'token-account-source',
									destination: 'token-account-destination',
									mint: 'token-mint',
								},
							},
						},
						{
							programId: 'application-program',
						},
					],
				},
			},
			meta: {
				err: null,
				fee: 5000,
				innerInstructions: [{
					index: 0,
					instructions: [{
						program: 'spl-associated-token-account',
						programId: 'associated-token-program',
						parsed: {
							type: 'create',
							info: {
								account: 'token-account-created',
								mint: 'token-mint',
							},
						},
					}],
				}],
			},
		}],
	}),
	subscribeSlot: vi.fn(),
}))

vi.mock('$/sources/Solana/JsonRpc/queries.ts', () => ({
	solanaRpcEndpoints,
	getSlot,
	getAccountInfo,
	getParsedTokenAccountInfo,
	getParsedTokenMintAccountInfo,
	getTokenAccountsByOwner,
	getVoteAccounts,
	getBlocks,
	getBlock,
	getBlockHeight: vi.fn().mockResolvedValue(90),
	subscribeSlot,
}))

const { default: solanaJsonRpc } = await import('$/resolvers/Solana-JsonRpc.ts')

const context = {
	filters: [],
	sorts: [],
	pagination: {
		limit: 16,
	},
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [],
	publicEnv: {},
}
const networkSelector = {
	caip2: {
		namespace: 'solana',
		reference: '5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp',
	},
}

const networkTimestampsResolver = solanaJsonRpc.resolvers.find((candidate) => (
	candidate.entityType === EntityType.Network
	&& '$$timestamps' in candidate.projections
	&& typeof candidate.projections.$$timestamps === 'function'
	&& candidate.resolveLive != null
))
if (networkTimestampsResolver == null)
	throw new Error('Solana Network $$timestamps resolveLive resolver is missing')

const liveField = () => ({
	replaceRows: vi.fn(),
	invalidate: vi.fn(),
	count: {
		replaceRows: vi.fn(),
		invalidate: vi.fn(),
	},
})

const liveFields = () => ({
	'$$timestamps': liveField(),
})

const startSlotStreamLive = (
	fields: ReturnType<typeof liveFields>,
	signal = new AbortController().signal
) => networkTimestampsResolver.resolveLive.slotStream.start({
	parentEntitySelector: networkSelector,
	queryClient: new QueryClient(),
	signal,
	trigger: context,
	fields,
})

describe('Solana JSON-RPC network state lists', () => {
	it('owns the registered Solana RPC endpoints', async () => {
		const resolver = solanaJsonRpc.resolvers.find((candidate) => (
			candidate.entityType === EntityType.Network
			&& 'Solana' in candidate.projections
			&& 'rpcEndpoints' in candidate.projections.Solana
		))
		if (resolver == null) throw new Error('Solana RPC endpoint resolver is missing')

		const rpcEndpoints = await resolver.resolve['Caip2'].resolve(
			networkSelector,
			context
		)

		expect(resolver.projections.Solana.rpcEndpoints(rpcEndpoints)).toEqual([
			{
				url: 'https://solana-rpc.publicnode.com',
				transportType: 'Http',
				providerName: 'PublicNode',
			},
			{
				url: 'wss://solana-rpc.publicnode.com',
				transportType: 'WebSocket',
				providerName: 'PublicNode',
			},
		])
	})

	it('fails the shared recent-state snapshot when any requested block fails', async () => {
		const resolver = solanaJsonRpc.resolvers.find((candidate) => (
			candidate.entityType === EntityType.Network
			&& 'Solana' in candidate.projections
			&& '$$programs' in candidate.projections.Solana
		))
		if (resolver == null) throw new Error('Solana network state resolver is missing')

		vi.mocked(getBlocks).mockResolvedValueOnce([99, 100])
		vi.mocked(getBlock).mockRejectedValueOnce(new Error('pruned slot'))
		await expect(resolver.resolve['Caip2'].resolve(
			networkSelector,
			context
		)).rejects.toThrow('pruned slot')

		expect(getBlock).toHaveBeenCalledTimes(2)
	})

	it('embeds validator observations exclusively through canonical field addresses', async () => {
		const resolver = solanaJsonRpc.resolvers.find((candidate) => (
			candidate.entityType === EntityType.Network
			&& 'Solana' in candidate.projections
			&& '$$validators' in candidate.projections.Solana
			&& typeof candidate.projections.Solana.$$validators === 'function'
		))
		if (resolver == null) throw new Error('Solana validator resolver is missing')

		const validators = resolver.projections.Solana.$$validators(
			await resolver.resolve['Caip2'].resolve(networkSelector, context)
		)
		expect(validators).toHaveLength(1)
		expect(Object.keys(validators[0])).toEqual([
			EntityMetaKey.Selector,
			EntityMetaKey.Fields,
		])
		expect(validators[0][EntityMetaKey.Fields]).toEqual({
			[entityFieldAddressKey(EntityType.SolanaValidator, [], '$$timestamps')]: [expect.objectContaining({
				[EntityMetaKey.Fields]: expect.objectContaining({
					[entityFieldAddressKey(EntityType.SolanaValidator_Timestamp, [], 'nodePubkey')]: 'node-current',
					[entityFieldAddressKey(EntityType.SolanaValidator_Timestamp, [], 'activatedStakeLamports')]: 1_000n,
				}),
			})],
		})
		expect(Object.keys(validators[0][EntityMetaKey.Fields][
			entityFieldAddressKey(EntityType.SolanaValidator, [], '$$timestamps')
		][0])).toEqual([
			EntityMetaKey.Selector,
			EntityMetaKey.Fields,
		])
		const timestampFields = validators[0][EntityMetaKey.Fields][
			entityFieldAddressKey(EntityType.SolanaValidator, [], '$$timestamps')
		][0][EntityMetaKey.Fields]
		expect(timestampFields).not.toHaveProperty(entityFieldAddressKey(EntityType.SolanaValidator_Timestamp, [], '$validator'))
		expect(timestampFields).not.toHaveProperty(entityFieldAddressKey(EntityType.SolanaValidator_Timestamp, [], 'slot'))
		expect(timestampFields).not.toHaveProperty(entityFieldAddressKey(EntityType.SolanaValidator_Timestamp, [], 'source'))
	})
})

describe('Solana JSON-RPC account observation clocks use context.slot', () => {
	beforeEach(() => {
		getSlot.mockClear()
		getAccountInfo.mockReset()
		getParsedTokenAccountInfo.mockReset()
		getParsedTokenMintAccountInfo.mockReset()
	})

	it('SolanaAccount / SolanaTokenAccount / SolanaTokenMint tip slots come from RPC context, not getSlot', async () => {
		getAccountInfo.mockResolvedValueOnce({
			context: {
				slot: 777,
			},
			value: {
				lamports: 1,
				owner: '11111111111111111111111111111111',
				executable: false,
				rentEpoch: 0,
				data: ['AQ==', 'base64'],
			},
		})
		getParsedTokenAccountInfo.mockResolvedValueOnce({
			context: {
				slot: 888,
			},
			value: {
				data: {
					parsed: {
						info: {
							mint: 'mint-1',
							owner: 'owner-1',
							tokenAmount: {
								amount: '1',
								decimals: 0,
							},
						},
					},
				},
			},
		})
		getParsedTokenMintAccountInfo.mockResolvedValueOnce({
			context: {
				slot: 999,
			},
			value: {
				data: {
					parsed: {
						info: {
							supply: '1',
							decimals: 0,
						},
					},
				},
			},
		})

		const accountResolver = solanaJsonRpc.resolvers.find((candidate) => (
			candidate.entityType === EntityType.SolanaAccount
			&& 'NetworkPubkey' in candidate.resolve
		))
		const tokenAccountResolver = solanaJsonRpc.resolvers.find((candidate) => (
			candidate.entityType === EntityType.SolanaTokenAccount
			&& 'NetworkTokenAccountPubkey' in candidate.resolve
		))
		const tokenMintResolver = solanaJsonRpc.resolvers.find((candidate) => (
			candidate.entityType === EntityType.SolanaTokenMint
			&& 'NetworkMintAddress' in candidate.resolve
		))
		if (accountResolver == null || tokenAccountResolver == null || tokenMintResolver == null)
			throw new Error('Solana account/token resolvers missing')

		const account = await accountResolver.resolve.NetworkPubkey.resolve(
			{
				$network: networkSelector,
				pubkey: 'account-1',
			},
			context
		)
		const tokenAccount = await tokenAccountResolver.resolve.NetworkTokenAccountPubkey.resolve(
			{
				$network: networkSelector,
				tokenAccountPubkey: 'token-account-1',
			},
			context
		)
		const tokenMint = await tokenMintResolver.resolve.NetworkMintAddress.resolve(
			{
				$network: networkSelector,
				mintAddress: 'mint-1',
			},
			context
		)

		expect(account.$$timestamps[0][EntityMetaKey.Selector].slot).toBe(777n)
		expect(tokenAccount.$$timestamps[0][EntityMetaKey.Selector].slot).toBe(888n)
		expect(tokenMint.$$timestamps[0][EntityMetaKey.Selector].slot).toBe(999n)
		expect(getSlot).not.toHaveBeenCalled()
		expect(getTokenAccountsByOwner).not.toHaveBeenCalled()
	})
})

describe('SolanaAccount.$$tokenAccounts from getTokenAccountsByOwner', () => {
	beforeEach(() => {
		getTokenAccountsByOwner.mockReset()
	})

	it('projects owner-scoped token account refs with mint/owner and tip timestamps', async () => {
		getTokenAccountsByOwner.mockResolvedValueOnce({
			context: {
				slot: 4242,
			},
			value: [
				{
					pubkey: 'token-account-1',
					account: {
						data: {
							parsed: {
								info: {
									mint: 'mint-1',
									owner: 'account-1',
									delegate: 'delegate-1',
									closeAuthority: 'close-1',
									tokenAmount: {
										amount: '10',
										decimals: 6,
									},
								},
							},
						},
					},
				},
			],
		})

		const tokenAccountsResolver = solanaJsonRpc.resolvers.find((candidate) => (
			candidate.entityType === EntityType.SolanaAccount
			&& 'NetworkPubkey' in candidate.resolve
			&& 'projections' in candidate
			&& '$$tokenAccounts' in candidate.projections
		))
		if (tokenAccountsResolver == null)
			throw new Error('SolanaAccount.$$tokenAccounts resolver missing')

		const snapshot = await tokenAccountsResolver.resolve.NetworkPubkey.resolve(
			{
				$network: networkSelector,
				pubkey: 'account-1',
			},
			context
		)

		expect(getTokenAccountsByOwner).toHaveBeenCalledWith({
			owner: 'account-1',
			limit: expect.any(Number),
		})
		expect(snapshot.$$tokenAccounts).toHaveLength(1)
		expect(snapshot.$$tokenAccounts[0][EntityMetaKey.Selector]).toEqual({
			$network: networkSelector,
			tokenAccountPubkey: 'token-account-1',
		})
		expect(snapshot.$$tokenAccounts[0][EntityMetaKey.Fields]).toMatchObject({
			[entityFieldAddressKey(EntityType.SolanaTokenAccount, [], '$mint')]: {
				[EntityMetaKey.Selector]: {
					$network: networkSelector,
					mintAddress: 'mint-1',
				},
			},
			[entityFieldAddressKey(EntityType.SolanaTokenAccount, [], '$owner')]: {
				[EntityMetaKey.Selector]: {
					$network: networkSelector,
					pubkey: 'account-1',
				},
			},
			[entityFieldAddressKey(EntityType.SolanaTokenAccount, [], '$$timestamps')]: [
				{
					[EntityMetaKey.Selector]: {
						$tokenAccount: {
							$network: networkSelector,
							tokenAccountPubkey: 'token-account-1',
						},
						slot: 4242n,
						source: Source.Solana_JsonRpc,
					},
				},
			],
		})
	})
})

describe('Solana JSON-RPC Network slotSubscribe resolveLive canary', () => {
	const observedAtMs = 1_784_678_400_000

	it('declares slotStream publishing $$timestamps only', () => {
		expect(networkTimestampsResolver.resolveLive.slotStream).toMatchObject({
			facetPath: [],
			publishes: {
				'$$timestamps': true,
			},
		})
		expect(Object.keys(networkTimestampsResolver.resolveLive)).toEqual(['slotStream'])
	})

	it('publishes $$timestamps absoluteSlot from slotSubscribe push only', async () => {
		vi.spyOn(Date, 'now').mockReturnValue(observedAtMs)
		getSlot.mockClear()
		subscribeSlot.mockImplementation(async function* () {
			yield {
				slot: 373,
				parent: 372,
				root: 341,
			}
			yield {
				slot: 374,
				parent: 373,
				root: 341,
			}
		})

		const fields = liveFields()
		await startSlotStreamLive(fields)

		expect(subscribeSlot).toHaveBeenCalledTimes(1)
		expect(subscribeSlot.mock.calls[0][0]).toBeInstanceOf(AbortSignal)
		expect(getSlot).not.toHaveBeenCalled()
		expect(fields.$$timestamps.replaceRows).toHaveBeenCalledTimes(2)
		expect(fields.$$timestamps.replaceRows).toHaveBeenNthCalledWith(1, [{
			source: Source.Solana_JsonRpc,
			value: [{
				[EntityMetaKey.Selector]: {
					$network: networkSelector,
					timestampMs: observedAtMs,
					source: Source.Solana_JsonRpc,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.Network_Timestamp, ['Solana'], 'absoluteSlot')]: 373n,
				},
			}],
		}])
		expect(fields.$$timestamps.replaceRows).toHaveBeenNthCalledWith(2, [{
			source: Source.Solana_JsonRpc,
			value: [{
				[EntityMetaKey.Selector]: {
					$network: networkSelector,
					timestampMs: observedAtMs,
					source: Source.Solana_JsonRpc,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.Network_Timestamp, ['Solana'], 'absoluteSlot')]: 374n,
				},
			}],
		}])
		expect(fields.$$timestamps.invalidate).not.toHaveBeenCalled()
	})

	it('threads AbortSignal into subscribeSlot and stops publishing after abort', async () => {
		const fields = liveFields()
		const abortController = new AbortController()
		subscribeSlot.mockImplementation(async function* (signal) {
			yield {
				slot: 400,
				parent: 399,
				root: 380,
			}
			await new Promise<void>((resolve) => {
				signal.addEventListener('abort', () => resolve(), { once: true })
			})
			if (signal.aborted)
				return
			yield {
				slot: 401,
				parent: 400,
				root: 380,
			}
		})

		const liveResolution = startSlotStreamLive(fields, abortController.signal)
		await vi.waitFor(() => {
			expect(fields.$$timestamps.replaceRows).toHaveBeenCalledTimes(1)
		})
		abortController.abort()
		await liveResolution

		expect(subscribeSlot).toHaveBeenCalledWith(abortController.signal)
		expect(fields.$$timestamps.replaceRows).toHaveBeenCalledTimes(1)
		expect(getSlot).not.toHaveBeenCalled()
	})

	it('rejects unsupported networks before opening slotSubscribe', async () => {
		const fields = liveFields()
		subscribeSlot.mockClear()

		await expect(networkTimestampsResolver.resolveLive.slotStream.start({
			parentEntitySelector: {
				caip2: {
					namespace: 'solana',
					reference: 'devnet',
				},
			},
			queryClient: new QueryClient(),
			signal: new AbortController().signal,
			trigger: context,
			fields,
		})).rejects.toThrow('unsupported network')
		expect(subscribeSlot).not.toHaveBeenCalled()
		expect(getSlot).not.toHaveBeenCalled()
	})
})
