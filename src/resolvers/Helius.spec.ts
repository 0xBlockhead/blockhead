import { base58 } from '@scure/base'
import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import { EntityMetaKey, entityFieldAddressKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

const getEnhancedTransactions = vi.hoisted(() => vi.fn())
const getAsset = vi.hoisted(() => vi.fn())
const getAssetsByOwner = vi.hoisted(() => vi.fn())

vi.mock('$/sources/Helius/Rest/queries.ts', () => ({
	getEnhancedTransactions,
}))

vi.mock('$/sources/Helius/Das/queries.ts', () => ({
	heliusDasQueries: vi.fn(() => ({
		getAsset,
		getAssetsByOwner,
	})),
}))

const { default: helius } = await import('$/resolvers/Helius.ts')

const transactionResolver = helius.resolvers.find((
	resolver
): resolver is Extract<
	typeof helius.resolvers[number],
	{ entityType: EntityType.SolanaTransaction }
> => resolver.entityType === EntityType.SolanaTransaction)

const tokenMintResolver = helius.resolvers.find((
	resolver
): resolver is Extract<
	typeof helius.resolvers[number],
	{ entityType: EntityType.SolanaTokenMint }
> => resolver.entityType === EntityType.SolanaTokenMint)

const tokenMintTimestampResolver = helius.resolvers.find((
	resolver
): resolver is Extract<
	typeof helius.resolvers[number],
	{ entityType: EntityType.SolanaTokenMint_Timestamp }
> => resolver.entityType === EntityType.SolanaTokenMint_Timestamp)

const accountResolver = helius.resolvers.find((
	resolver
): resolver is Extract<
	typeof helius.resolvers[number],
	{ entityType: EntityType.SolanaAccount }
> => resolver.entityType === EntityType.SolanaAccount)

if (transactionResolver == null)
	throw new Error('Helius transaction resolver is missing')
if (tokenMintResolver == null)
	throw new Error('Helius token mint resolver is missing')
if (tokenMintTimestampResolver == null)
	throw new Error('Helius token mint timestamp resolver is missing')
if (accountResolver == null)
	throw new Error('Helius account resolver is missing')

const context = {
	filters: [],
	sorts: [],
	pagination: {
		limit: 16,
	},
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [],
	publicEnv: {
		PUBLIC_HELIUS_API_KEY: 'helius-key',
	},
}

const network = {
	caip2: {
		namespace: 'solana',
		reference: '5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp',
	},
}

const address = (value: number) => base58.encode(new Uint8Array(32).fill(value))
const mintAddress = address(2)
const ownerAddress = address(1)

describe('Helius resolver source binding', () => {
	beforeEach(() => {
		getEnhancedTransactions.mockReset()
		getAsset.mockReset()
		getAssetsByOwner.mockReset()
		getEnhancedTransactions.mockResolvedValue([{
			signature: 'transaction-signature',
			slot: 123,
		}])
	})

	it('passes the exact canonical Solana HTTP binding to transport', async () => {
		await transactionResolver.resolve[
			'NetworkSignature'
		].resolve({
			$network: network,
			signature: 'transaction-signature',
		}, context)

		expect(getEnhancedTransactions).toHaveBeenCalledWith({
			binding: expect.objectContaining({
				source: Source.Helius,
			}),
			signatures: ['transaction-signature'],
			publicEnv: context.publicEnv,
		})
	})

	it('rejects non-mainnet selectors before transport', async () => {
		await expect(transactionResolver.resolve[
			'NetworkSignature'
		].resolve({
			$network: {
				caip2: {
					namespace: 'solana',
					reference: 'testnet',
				},
			},
			signature: 'transaction-signature',
		}, context)).rejects.toThrow('unsupported network')

		expect(getEnhancedTransactions).not.toHaveBeenCalled()
	})

	it('projects SolanaTokenMint tip fields from DAS getAsset', async () => {
		getAsset.mockResolvedValueOnce({
			interface: 'FungibleToken',
			id: mintAddress,
			last_indexed_slot: 365_750_800,
			burnt: false,
			mutable: true,
			token_info: {
				decimals: 6,
				supply: 1_000_000_000,
				token_program: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
				mint_authority: address(12),
				freeze_authority: null,
			},
		})

		const mint = await tokenMintResolver.resolve.NetworkMintAddress.resolve({
			$network: network,
			mintAddress,
		}, context)

		expect(getAsset).toHaveBeenCalledWith({
			id: mintAddress,
			publicEnv: context.publicEnv,
		})
		expect(mint.$$timestamps).toEqual([
			expect.objectContaining({
				[EntityMetaKey.Selector]: {
					$mint: {
						$network: network,
						mintAddress,
					},
					slot: 365_750_800n,
					source: Source.Helius,
				},
				supply: 1_000_000_000n,
				decimals: 6,
				isInitialized: true,
				mintAuthorityPubkey: address(12),
			}),
		])
		expect(tokenMintResolver.projections.$$timestamps(mint)).toEqual([
			expect.objectContaining({
				[EntityMetaKey.Selector]: {
					$mint: {
						$network: network,
						mintAddress,
					},
					slot: 365_750_800n,
					source: Source.Helius,
				},
				[EntityMetaKey.Fields]: expect.objectContaining({
					[entityFieldAddressKey(EntityType.SolanaTokenMint_Timestamp, [], 'supply')]: 1_000_000_000n,
					[entityFieldAddressKey(EntityType.SolanaTokenMint_Timestamp, [], 'decimals')]: 6,
					[entityFieldAddressKey(EntityType.SolanaTokenMint_Timestamp, [], 'isInitialized')]: true,
					[entityFieldAddressKey(EntityType.SolanaTokenMint_Timestamp, [], 'mintAuthorityPubkey')]: address(12),
				}),
			}),
		])
	})

	it('re-resolves SolanaTokenMint_Timestamp from DAS getAsset', async () => {
		getAsset.mockResolvedValueOnce({
			interface: 'FungibleToken',
			id: mintAddress,
			last_indexed_slot: 365_750_800,
			burnt: false,
			mutable: true,
			token_info: {
				decimals: 9,
				supply: 42,
				token_program: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
			},
		})

		await expect(tokenMintTimestampResolver.resolve.MintSlotSource.resolve({
			$mint: {
				$network: network,
				mintAddress,
			},
			slot: 365_750_800n,
			source: Source.Helius,
		}, context)).resolves.toMatchObject({
			supply: 42n,
			decimals: 9,
			isInitialized: true,
			source: Source.Helius,
		})
	})

	it('projects SolanaAccount DAS owner inventory clock from getAssetsByOwner', async () => {
		getAssetsByOwner.mockResolvedValueOnce({
			last_indexed_slot: 365_750_752,
			total: 2,
			limit: 16,
			page: 1,
			items: [
				{
					interface: 'V1_NFT',
					id: mintAddress,
					last_indexed_slot: 365_750_752,
					burnt: false,
					mutable: true,
					ownership: {
						owner: ownerAddress,
						delegated: false,
						frozen: false,
						ownership_model: 'single',
					},
				},
			],
		})

		const account = await accountResolver.resolve.NetworkPubkey.resolve({
			$network: network,
			pubkey: ownerAddress,
		}, context)

		expect(getAssetsByOwner).toHaveBeenCalledWith({
			ownerAddress,
			limit: 16,
			publicEnv: context.publicEnv,
		})
		expect(account.$$timestamps).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$account: {
						$network: network,
						pubkey: ownerAddress,
					},
					slot: 365_750_752n,
					source: Source.Helius,
				},
			},
		])
	})

	it('does not register a direct SolanaAccount_Timestamp resolver', () => {
		expect(helius.resolvers.some((resolver) => (
			resolver.entityType === EntityType.SolanaAccount_Timestamp
		))).toBe(false)
	})
})
