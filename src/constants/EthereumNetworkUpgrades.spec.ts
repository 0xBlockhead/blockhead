import { describe, expect, it } from 'vitest'
import {
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
	it('preserves every legacy ID and route-segment entry in insertion order', () => {
		for (const {
			rows,
			idIndex,
			routeIndex,
			groupIndex,
			aliases,
		} of [
			{
				rows: networkUpgrades,
				idIndex: networkUpgradeByChainIdAndUpgradeId,
				routeIndex: networkUpgradeByChainIdAndRouteSegment,
				groupIndex: networkUpgradesByChainId,
				aliases: legacyMarketingAliases,
			},
			{
				rows: networkExecutionUpgrades,
				idIndex: networkExecutionUpgradeByChainIdAndUpgradeId,
				routeIndex: networkExecutionUpgradeByChainIdAndRouteSegment,
				groupIndex: networkExecutionUpgradesByChainId,
				aliases: [],
			},
			{
				rows: networkConsensusUpgrades,
				idIndex: networkConsensusUpgradeByChainIdAndUpgradeId,
				routeIndex: networkConsensusUpgradeByChainIdAndRouteSegment,
				groupIndex: networkConsensusUpgradesByChainId,
				aliases: [],
			},
		]) {
			expect(Object.entries(idIndex)).toEqual(
				rows.map((row) => [
					`${row.chainId}:${row.upgradeId}`,
					row,
				])
			)
			expect(Object.entries(routeIndex)).toEqual(
				Object.entries(Object.fromEntries(rows.flatMap((row) => [
					...[
						row.upgradeId,
						row.slug,
						row.upgradeId.toLowerCase(),
						row.slug.toLowerCase(),
						routeSegment(row.upgradeId),
						routeSegment(row.slug),
					].map((segment) => [
						`${row.chainId}:${segment}`,
						row,
					]),
					...aliases.flatMap((alias) => (
						alias.umbrellaUpgradeId === row.upgradeId ?
							[
								[
									`${row.chainId}:${alias.segmentSlug}`,
									row,
								],
							]
						:
							[]
					)),
				])))
			)
			expect(groupIndex).toEqual(
				Object.groupBy(rows, (row) => row.chainId)
			)
			for (const chainId of new Set(rows.map((row) => row.chainId)))
				expect(groupIndex[chainId]).toEqual(
					rows.filter((row) => row.chainId === chainId)
				)
		}
		expect(networkUpgradeByChainIdAndConsensusUpgradeId).toEqual(
			Object.fromEntries(networkUpgrades.flatMap((networkUpgrade) => (
				networkUpgrade.consensusUpgradeId == null ?
					[]
				:
					[[
						`${networkUpgrade.chainId}:${networkUpgrade.consensusUpgradeId}`,
						networkUpgrade,
					]]
			)))
		)
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
