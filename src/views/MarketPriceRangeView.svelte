<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId, Entity } from '$/schema/$schema.ts'
	import { stringify } from 'devalue'
	import { schema } from '$/schema/index.ts'
	import { formatMarketTimeIntervalLabel, MarketAssetKind } from '$/constants/Market.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Context
	import { resolve } from '$app/paths'


	// Functions
	const ohlcRangePayloadToEntities = (
		rangePayload: string,
		rangeId: EntityId<typeof schema, EntityType.MarketPriceRange>,
	): Entity<typeof schema, EntityType.Market_TimeInterval_Timestamp>[] => {
		const parsedRangePayload: number[][] = JSON.parse(rangePayload)

		return parsedRangePayload.map(([t, o, h, l, c]) => {
			const timestampNs = BigInt(Math.floor(t)) * 1_000_000n
			const id = (
				{
					$market: rangeId.$market,
					timeInterval: rangeId.timeInterval,
					timestampNs,
				}
			)

			return (
				{
					[EntityMetaKey.Id]: id,
					[EntityMetaKey.IdKey]: stringify(id),
					open: BigInt(Math.round(o * 1e8)),
					high: BigInt(Math.round(h * 1e8)),
					low: BigInt(Math.round(l * 1e8)),
					close: BigInt(Math.round(c * 1e8)),
				}
			)
		})
	}


	// Components
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import MarketTimeIntervalTimestampChart from '$/views/charts/Market_TimeInterval_Timestamp.svelte'
	import MarketView from '$/views/MarketView.svelte'

	import { useEntity } from '$/collections/$queries.svelte.ts'


	// Props
	let {
		children,
		entityId,
		href,
		open = $bindable(true),
		...entityViewRest
	}: WithRest<
		{
			children?: Snippet
			entityId: EntityId<typeof schema, EntityType.MarketPriceRange>
			href?: string
			open?: boolean
		},
		Omit<
			ComponentProps<typeof EntityView>,
			| 'entityType'
			| 'entityId'
			| 'href'
			| 'open'
			| 'title'
			| 'Details'
		>
	> = $props()


	const rangeLive = useEntity(
		EntityType.MarketPriceRange,
		entityId,
		{
			$: [
				Source.Constants_Internal,
				Source.Coingecko_Rest,
			],
			$$parentMarket: {},
			pointCount: {},
			rangePayload: {},
		},
	)
</script>


<EntityView
	entityType={EntityType.MarketPriceRange}
	{entityId}
	href={href ?? (
		entityId.$market.$base.kind === MarketAssetKind.Coin ?
			resolve(
				'/(assets)/(coins)/coin/[coinId]',
				{ coinId: entityId.$market.$base.$coin.coinId },
			)
		:
			undefined
	)}
	{open}
	title={`${
		entityId.$market.$base.kind === MarketAssetKind.Coin ?
			entityId.$market.$base.$coin.coinId
		:
			'Market'
	} · ${formatMarketTimeIntervalLabel(entityId.timeInterval)} · ${entityId.rangeType}`}
	{...entityViewRest}
>
	{#snippet Content({ title: _title, href: _href })}
		<ResourceBoundary
			resource={rangeLive}
			placeholderText="Loading range…"
		>
			{#snippet children(r)}
				{@const ordered = (
					r.rangePayload === undefined ?
						[]
					:	ohlcRangePayloadToEntities(r.rangePayload, entityId)
				)}
				{@const latest = ordered.at(-1)}
				{@const hasDlRow = (
					r.pointCount !== undefined
					|| latest?.close !== undefined
					|| (
						open
						&& latest !== undefined
					)
				)}
				{#if hasDlRow}
					<dl>
						{#if r.pointCount !== undefined}
							<div>
								<dt>Points</dt>
								<dd>{String(r.pointCount)}</dd>
							</div>
						{/if}
						{#if latest?.close !== undefined}
							<div>
								<dt>Latest close</dt>
								<dd>{String(Number(latest.close) / 1e8)}</dd>
							</div>
						{/if}
						{#if open}
							{#if latest !== undefined}
								<div>
									<dt>Latest timestamp (ns)</dt>
									<dd>{String(latest[EntityMetaKey.Id].timestampNs)}</dd>
								</div>
							{/if}
						{/if}
					</dl>
				{:else}
					<p data-text="muted">
						No price range points yet.
					</p>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details()}
		<EntityDetails
			entityType={EntityType.MarketPriceRange}
			{entityId}
		/>
			<ResourceBoundary
				resource={rangeLive}
				placeholderText="Loading range…"
			>
				{#snippet children(r)}
					{@const ordered = (
						r.rangePayload === undefined ?
							[]
						:	ohlcRangePayloadToEntities(r.rangePayload, entityId)
					)}
					{@const chartMin = (
						ordered.length === 0 ?
							0
						:	Math.min(
								...ordered.map((point) => (
									Number(point.low ?? point.close ?? point.open ?? 0n) / 1e8
								)),
							)
					)}
					{@const chartMax = (
						ordered.length === 0 ?
							1
						:	Math.max(
								...ordered.map((point) => (
									Number(point.high ?? point.close ?? point.open ?? 1n) / 1e8
								)),
							)
					)}
					{#if ordered.length > 0}
						<MarketTimeIntervalTimestampChart
							max={chartMax}
							min={chartMin}
							points={ordered}
							title={`${
								entityId.$market.$base.kind === MarketAssetKind.Coin ?
									entityId.$market.$base.$coin.coinId
								:
									'Market'
							} · ${formatMarketTimeIntervalLabel(entityId.timeInterval)} · ${entityId.rangeType}`}
						/>
					{/if}
				{/snippet}
			</ResourceBoundary>

		<section>
			<h2>
				Market
			</h2>
			<MarketView
				entityId={entityId.$market}
				href={(
					resolve(
						'/(assets)/coins/market/[marketKey]',
						{
							marketKey: (
								encodeURIComponent(
									stringify(entityId.$market),
								)
							),
						},
					)
				)}
				id={`${stringify(entityId)}:parent-market`}
				layout={EntityLayout.Summary}
				open={false}
			/>
		</section>

		{#if children}
			{@render children()}
		{/if}
	{/snippet}
</EntityView>
