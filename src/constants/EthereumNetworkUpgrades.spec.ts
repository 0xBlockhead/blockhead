import { describe, expect, it } from 'vitest'
import {
	activeNetworkUpgradeAtEvmHead,
	ethereumMainnetNetworkUpgradeSlugAliasBySegmentSlug,
	ethereumNetworkMarketingUmbrellas,
	networkConsensusUpgradeByChainIdAndRouteSegment,
	networkConsensusUpgradeByChainIdAndUpgradeId,
	networkConsensusUpgrades,
	networkConsensusUpgradesByChainId,
	networkExecutionUpgradeByChainIdAndRouteSegment,
	networkExecutionUpgradeByChainIdAndUpgradeId,
	networkExecutionUpgrades,
	networkExecutionUpgradesByChainId,
	networkUpgradeByChainIdAndConsensusUpgradeId,
	networkUpgradeByChainIdAndRouteSegment,
	networkUpgradeByChainIdAndUpgradeId,
	networkUpgrades,
	networkUpgradesByChainId,
	type NetworkUpgradeRow,
} from '$/constants/EthereumNetworkUpgrades.ts'


const legacyMarketingAliases = [
	{ segmentSlug: 'paris', umbrellaUpgradeId: 'Merge' },
	{ segmentSlug: 'bellatrix', umbrellaUpgradeId: 'Merge' },
	{ segmentSlug: 'merge', umbrellaUpgradeId: 'Merge' },
	{ segmentSlug: 'the-merge', umbrellaUpgradeId: 'Merge' },
	{ segmentSlug: 'the merge', umbrellaUpgradeId: 'Merge' },
	{ segmentSlug: 'shanghai', umbrellaUpgradeId: 'Shapella' },
	{ segmentSlug: 'capella', umbrellaUpgradeId: 'Shapella' },
	{ segmentSlug: 'cancun', umbrellaUpgradeId: 'Dencun' },
	{ segmentSlug: 'deneb', umbrellaUpgradeId: 'Dencun' },
	{ segmentSlug: 'prague', umbrellaUpgradeId: 'Pectra' },
	{ segmentSlug: 'electra', umbrellaUpgradeId: 'Pectra' },
	{ segmentSlug: 'osaka', umbrellaUpgradeId: 'Fusaka' },
	{ segmentSlug: 'fulu', umbrellaUpgradeId: 'Fusaka' },
] as const

const routeSegment = (value: string) => (
	value.toLowerCase().replace(/\s+/g, '-')
)


describe('Ethereum network upgrade indexes', () => {
	it('indexes every canonical upgrade identity without collisions and preserves chain grouping', () => {
		for (const {
			rows,
			idIndex,
			routeIndex,
			groupIndex,
		} of [
			{
				rows: networkUpgrades,
				idIndex: networkUpgradeByChainIdAndUpgradeId,
				routeIndex: networkUpgradeByChainIdAndRouteSegment,
				groupIndex: networkUpgradesByChainId,
			},
			{
				rows: networkExecutionUpgrades,
				idIndex: networkExecutionUpgradeByChainIdAndUpgradeId,
				routeIndex: networkExecutionUpgradeByChainIdAndRouteSegment,
				groupIndex: networkExecutionUpgradesByChainId,
			},
			{
				rows: networkConsensusUpgrades,
				idIndex: networkConsensusUpgradeByChainIdAndUpgradeId,
				routeIndex: networkConsensusUpgradeByChainIdAndRouteSegment,
				groupIndex: networkConsensusUpgradesByChainId,
			},
		]) {
			const canonicalIdentityKeys = rows.map((row) => `${row.chainId}:${row.upgradeId}`)
			expect(new Set(canonicalIdentityKeys).size).toBe(rows.length)

			for (const row of rows) {
				expect(idIndex[`${row.chainId}:${row.upgradeId}`]).toBe(row)
				expect(routeIndex[`${row.chainId}:${row.slug}`]).toBe(row)
				expect(routeIndex[`${row.chainId}:${routeSegment(row.upgradeId)}`]).toBe(row)
				expect(groupIndex[row.chainId]).toContain(row)
			}

			expect(Object.values(groupIndex).flat()).toHaveLength(rows.length)
		}

		for (const networkUpgrade of networkUpgrades) {
			if (networkUpgrade.consensusUpgradeId != null)
				expect(networkUpgradeByChainIdAndConsensusUpgradeId[
					`${networkUpgrade.chainId}:${networkUpgrade.consensusUpgradeId}`
				]).toBe(networkUpgrade)
		}
	})

	it('derives codenames from umbrella activation IDs and retains only exceptional spellings', () => {
		for (const umbrella of ethereumNetworkMarketingUmbrellas) {
			expect(umbrella.slug).toBe(routeSegment(umbrella.upgradeId))
			expect(
				networkExecutionUpgrades
					.filter((upgrade) => upgrade.upgradeId === umbrella.executionUpgradeId)
					.every((upgrade) => upgrade.slug === routeSegment(upgrade.upgradeId))
			).toBe(true)
			expect(
				networkConsensusUpgrades
					.filter((upgrade) => upgrade.upgradeId === umbrella.consensusUpgradeId)
					.every((upgrade) => upgrade.slug === routeSegment(upgrade.upgradeId))
			).toBe(true)
		}

		for (const chainId of [
			1,
			11_155_111,
			17_000,
		])
			for (const alias of legacyMarketingAliases)
				expect(
					networkUpgradeByChainIdAndRouteSegment[
						`${chainId}:${alias.segmentSlug}`
					]?.upgradeId
				).toBe(alias.umbrellaUpgradeId)
	})
})

describe('active network upgrade at an EVM head', () => {
	const at = (
		chainId: number,
		blockNumber: bigint,
		timestampMs: number,
		epoch?: number
	) => activeNetworkUpgradeAtEvmHead(
		networkUpgradesByChainId[chainId] ?? [],
		{ blockNumber, timestampMs, ...(epoch == null ? {} : { epoch }) }
	)

	it('crosses block and timestamp activation boundaries without selecting a scheduled future row', () => {
		expect(at(1, 0n, 0)).toBeUndefined()
		expect(at(1, 1n, 0)?.upgradeId).toBe('Frontier')

		const parisTimestampMs = 1_663_224_162_000
		expect(at(1, 15_537_394n, parisTimestampMs - 1)?.upgradeId).toBe('Gray Glacier')
		expect(at(1, 15_537_394n, parisTimestampMs)?.upgradeId).toBe('Merge')

		const osakaTimestampMs = 1_764_798_551_000
		expect(at(1, 30_000_000n, osakaTimestampMs - 1)?.upgradeId).toBe('Pectra')
		expect(at(1, 30_000_000n, osakaTimestampMs)?.upgradeId).toBe('Fusaka')
		expect(at(10, 150_000_000n, 1_764_691_201_000)?.upgradeId).toBe('Jovian')
		expect(at(8_453, 40_000_000n, 1_764_691_201_000)?.upgradeId).toBe('Jovian')
	})

	it('requires every declared coordinate and never treats block time as an epoch', () => {
		const scheduled = [
			{
				chainId: 1,
				upgradeId: 'Prior',
				name: 'Prior',
				slug: 'prior',
				executionUpgradeId: 'Prior',
				activationTimestampMs: 1_000,
			},
			{
				chainId: 1,
				upgradeId: 'Scheduled',
				name: 'Scheduled',
				slug: 'scheduled',
				executionUpgradeId: 'Scheduled',
				activationTimestampMs: 2_000,
				activationEpoch: 5,
			},
		] satisfies readonly NetworkUpgradeRow[]

		expect(activeNetworkUpgradeAtEvmHead(
			scheduled,
			{ blockNumber: 10n, timestampMs: 2_000 }
		)?.upgradeId).toBe('Prior')
		expect(activeNetworkUpgradeAtEvmHead(
			scheduled,
			{ blockNumber: 10n, timestampMs: 2_000, epoch: 4 }
		)?.upgradeId).toBe('Prior')
		expect(activeNetworkUpgradeAtEvmHead(
			scheduled,
			{ blockNumber: 10n, timestampMs: 2_000, epoch: 5 }
		)?.upgradeId).toBe('Scheduled')
	})

	it('keeps unscheduled proposals in the catalog but excludes them from active state', () => {
		const unscheduled = [{
			chainId: 1,
			upgradeId: 'Proposal',
			name: 'Proposal',
			slug: 'proposal',
			executionUpgradeId: 'Proposal',
		}] satisfies readonly NetworkUpgradeRow[]

		expect(activeNetworkUpgradeAtEvmHead(
			unscheduled,
			{ blockNumber: 99_999_999n, timestampMs: Number.MAX_SAFE_INTEGER }
		)).toBeUndefined()
	})
})
