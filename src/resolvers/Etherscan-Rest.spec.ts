import { beforeEach, describe, expect, it, vi } from 'vitest'

import { EntityMetaKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'

const getTokenTransfersByAddress = vi.hoisted(() => vi.fn())
const getTokenTransfersByTransaction = vi.hoisted(() => vi.fn())

vi.mock('$/sources/Etherscan/Rest/queries.ts', async (importOriginal) => ({
	...await importOriginal<typeof import('$/sources/Etherscan/Rest/queries.ts')>(),
	getTokenTransfersByAddress,
	getTokenTransfersByTransaction,
}))

const { default: etherscanRest } = await import('$/resolvers/Etherscan-Rest.ts')

const context = {
	filters: [],
	sorts: [],
	pagination: {
		limit: 1,
	},
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [],
	publicEnv: {},
}
const address = '0x1111111111111111111111111111111111111111'
const txHash = '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'

describe('Etherscan Network selectors', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('derives the chain from the catalog slug and preserves that selector in references', async () => {
		getTokenTransfersByAddress.mockResolvedValue([{
			standard: 'erc20',
			row: {
				hash: txHash,
				logIndex: '7',
			},
		}])
		const resolver = etherscanRest.resolvers.find((candidate) => (
			candidate.entityType === EntityType.EvmNetworkAccount
			&& '$$tokenTransfers' in candidate.projections
			&& 'EvmNetworkEvmAccount' in candidate.resolve
		))
		if (
			resolver == null
			|| !('EvmNetworkEvmAccount' in resolver.resolve)
		)
			throw new Error('Etherscan_Rest: missing EvmNetworkAccount token-transfer resolver')

		const $network = {
			slug: 'ethereum',
		} as const
		const references = await resolver.resolve.EvmNetworkEvmAccount.resolve({
			$actor: {
				address,
			},
			$network,
		}, context)

		expect(getTokenTransfersByAddress).toHaveBeenCalledWith(expect.objectContaining({
			chainId: 1,
			address,
		}))
		expect(references).toEqual([{
			[EntityMetaKey.Selector]: {
				$log: {
					$transaction: {
						$network,
						txHash,
					},
					indexInTransaction: 7,
				},
				indexInLog: 0,
			},
		}])
	})

	it('rejects an NFT projection when its required token id is absent', async () => {
		getTokenTransfersByTransaction.mockResolvedValue([{
			standard: 'erc721',
			row: {
				hash: txHash,
				logIndex: '7',
			},
		}])
		const resolver = etherscanRest.resolvers.find((candidate) => (
			candidate.entityType === EntityType.EvmTokenTransfer
			&& 'LogIndexInLog' in candidate.resolve
			&& 'Nft' in candidate.projections
		))
		const resolve = (
			resolver != null
			&& 'LogIndexInLog' in resolver.resolve ?
				resolver.resolve.LogIndexInLog.resolve
			:
				undefined
		)
		const projectTokenId = (
			resolver != null
			&& 'Nft' in resolver.projections ?
				resolver.projections.Nft.tokenId
			:
				undefined
		)
		if (
			resolver == null
			|| resolve == null
			|| projectTokenId == null
		)
			throw new Error('Etherscan_Rest: missing EvmTokenTransfer resolver')

		const entitySelector = {
			$log: {
				$transaction: {
					$network: {
						slug: 'ethereum',
					},
					txHash,
				},
				indexInTransaction: 7,
			},
			indexInLog: 0,
		} as const
		const entity = await resolve(
			entitySelector,
			context
		)

		expect(() => projectTokenId(entity)).toThrow('NFT transfer missing token id')
	})
})
