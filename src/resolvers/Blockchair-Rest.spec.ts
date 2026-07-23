import { beforeEach, describe, expect, it, vi } from 'vitest'

import { networkBySlug } from '$/constants/Network.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { NetworkSelector } from '$/schema/Network.ts'
import { Network_TimestampSelector } from '$/schema/Network_Timestamp.ts'
import { Source } from '$/sources/Source.ts'

const getBlocks = vi.fn()

vi.mock('$/sources/Blockchair/Rest/queries.ts', () => ({
	getBlocks,
}))

const { default: blockchairResolvers } = await import('$/resolvers/Blockchair-Rest.ts')

const networkResolvers = blockchairResolvers.resolvers.filter((resolver) => (
	resolver.entityType === EntityType.Network
))
const blocksResolver = networkResolvers.find((resolver) => (
	'Utxo' in resolver.projections
	&& '$$blocks' in resolver.projections.Utxo
	&& typeof resolver.projections.Utxo.$$blocks === 'function'
))
const timestampResolver = blockchairResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.Network_Timestamp
))

if (blocksResolver == null)
	throw new Error('Blockchair-Rest spec missing Network.Utxo.$$blocks resolver')
if (timestampResolver == null)
	throw new Error('Blockchair-Rest spec missing Network_Timestamp resolver')

const resolverContext = {
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

describe('Blockchair Network selector applicability', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('covers both canonical CAIP-2 and preserved slug selectors for every Network projection', () => {
		for (const resolver of networkResolvers) {
			expect(resolver.resolve[NetworkSelector.Caip2].appliesTo).toContainEqual({
				caip2: networkBySlug.bitcoin.caip2,
			})
			expect(resolver.resolve[NetworkSelector.Slug].appliesTo).toContainEqual({
				slug: 'bitcoin',
			})
			expect(resolver.resolve[NetworkSelector.Caip2].appliesTo).not.toContainEqual({
				caip2: networkBySlug.ethereum.caip2,
			})
		}
	})

	it('limits observations to Blockchair-owned timestamps on supported networks', () => {
		const appliesTo = timestampResolver.resolve[
			Network_TimestampSelector.NetworkTimestampMsSource
		].appliesTo
		expect(appliesTo).toContainEqual({
			$network: {
				caip2: networkBySlug.bitcoin.caip2,
			},
			source: Source.Blockchair_Rest,
		})
		expect(appliesTo).not.toContainEqual(expect.objectContaining({
			source: Source.MempoolSpace_Rest,
		}))
	})

	it('issues Bitcoin list requests for canonical CAIP-2 and rejects unsupported networks before I/O', async () => {
		getBlocks.mockResolvedValue({
			data: [
				{
					id: 1,
					hash: 'a'.repeat(64),
				},
			],
		})

		await expect(blocksResolver.resolve[NetworkSelector.Caip2].resolve({
			caip2: networkBySlug.bitcoin.caip2,
		}, resolverContext)).resolves.toHaveLength(1)
		expect(getBlocks).toHaveBeenCalledWith({
			chain: 'bitcoin',
			params: {
				sort: 'id(desc)',
				limit: 1,
			},
		})

		await expect(blocksResolver.resolve[NetworkSelector.Caip2].resolve({
			caip2: networkBySlug.ethereum.caip2,
		}, resolverContext)).rejects.toThrow('unsupported UTXO network')
		expect(getBlocks).toHaveBeenCalledTimes(1)
	})
})
