<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { formatMarketTimeIntervalLabel, MarketAssetKind } from '$/constants/Market.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import MarketPriceRangeSchema from '$/schema/MarketPriceRange.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context
	import { resolve } from '$app/paths'


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
			entityId: typeof MarketPriceRangeSchema.id.infer | string
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


	// State
	import { eq, useLiveQuery } from '@tanstack/svelte-db'
	import { stringify } from 'devalue'

	import {
		entityCollectionByEntityType,
		entityFieldCollections,
	} from '$/routes/+layout.svelte'


	// (Derived)
	const rangeIdKey = $derived(
		typeof entityId === 'string' ?
			entityId
		:	stringify(entityId),
	)

	const rangeQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({ row: entityCollectionByEntityType[EntityType.MarketPriceRange] })
				.where(({ row }) => (
					eq(
						row[EntityMetaKey.IdKey],
						rangeIdKey,
					)
				))
				.select(({ row }) => ({ row }))
		),
		[() => rangeIdKey],
	)

	const rangeRow = $derived(
		(
			rangeQuery.data === undefined
				? undefined
			:	(
					rangeQuery.data.find(
						(r) => r.row[EntityMetaKey.Source] === Source.Coingecko_Rest,
					)?.row
					?? rangeQuery.data[0]?.row
				)
		),
	)

	const pointsQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({ point: entityFieldCollections[EntityType.MarketPriceRange].$$points })
				.where(({ point }) => (
					eq(
						point[EntityMetaKey.ParentIdKey],
						rangeIdKey,
					)
				))
				.where(({ point }) => (
					eq(
						point[EntityMetaKey.Source],
						Source.Coingecko_Rest,
					)
				))
				.orderBy(({ point }) => (
					point[EntityMetaKey.Value][EntityMetaKey.Id].timestampNs
				), 'asc')
				.select(({ point }) => (
					{ value: point[EntityMetaKey.Value] }
				))
				.distinct()
		),
		[() => rangeIdKey],
	)

	const pointIdKeys = $derived(
		new Set(
			pointsQuery.data?.map(({ value }) => value[EntityMetaKey.IdKey]) ?? [],
		),
	)

	const pointRowsQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({ point: entityCollectionByEntityType[EntityType.Market_TimeInterval_Timestamp] })
				.where(({ point }) => (
					eq(
						point[EntityMetaKey.Source],
						Source.Coingecko_Rest,
					)
				))
				.where(({ point }) => (
					pointIdKeys.has(point[EntityMetaKey.IdKey])
				))
				.orderBy(({ point }) => (
					point[EntityMetaKey.Id].timestampNs
				), 'asc')
				.select(({ point }) => ({
					point,
				}))
		),
		[
			() => rangeIdKey,
			() => [...pointIdKeys].join('\n'),
		],
	)

	const pointRows = $derived(
		pointRowsQuery.data?.map(({ point }) => point) ?? [],
	)

	const chartMin = $derived(
		pointRows.length === 0 ?
			0
		:	Math.min(
				...pointRows.map((point) => Number(point.low ?? point.close ?? point.open ?? 0n) / 1e8),
			),
	)

	const chartMax = $derived(
		pointRows.length === 0 ?
			1
		:	Math.max(
				...pointRows.map((point) => Number(point.high ?? point.close ?? point.open ?? 1n) / 1e8),
			),
	)

	const latestPoint = $derived(
		pointRows.at(-1),
	)

	const wireId = $derived(
		typeof entityId === 'string' ?
			rangeRow?.[EntityMetaKey.Id]
		:
			entityId,
	)

	const catalogCoinId = $derived(
		wireId !== undefined && wireId.$market.$base.kind === MarketAssetKind.Coin ?
			wireId.$market.$base.$coin.coinId
		:	undefined,
	)

	const displayTitle = $derived(
		wireId === undefined
			? ''
		:	`${catalogCoinId ?? '—'} · ${formatMarketTimeIntervalLabel(wireId.timeInterval)} · ${wireId.rangeType}`,
	)

	const hrefResolved = $derived(
		href
		?? (catalogCoinId === undefined
			? undefined
		:	resolve(
				'/(assets)/(coins)/coin/[coinId]',
				{ coinId: catalogCoinId },
			)),
	)

	const marketPriceRangePlaceholderText = 'Loading market price range…'

	// Components
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import QueryBoundary from '$/components/QueryBoundary.svelte'
	import Market_TimeInterval_TimestampsView from '$/views/Market_TimeInterval_TimestampsView.svelte'
	import MarketTimeIntervalTimestampChart from '$/views/charts/Market_TimeInterval_Timestamp.svelte'
	import MarketView from '$/views/MarketView.svelte'
</script>


{#if wireId === undefined}
	<span data-placeholder>
		…
	</span>
{:else}
	<EntityView
		entityType={EntityType.MarketPriceRange}
		entityId={wireId}
		href={hrefResolved}
		{open}
		{...entityViewRest}
		title={displayTitle}
	>
		{#snippet Content()}
			{#if latestPoint === undefined}
				<p data-text="muted">
					No OHLC points loaded yet.
				</p>
			{:else}
				<dl>
					<div>
						<dt>Points</dt>
						<dd>
							{String(pointRows.length)}
						</dd>
					</div>

					{#if latestPoint.close !== undefined}
						<div>
							<dt>Latest close</dt>
							<dd>
								{String(Number(latestPoint.close) / 1e8)}
							</dd>
						</div>
					{/if}
				</dl>
			{/if}
		{/snippet}

		{#snippet Details({
			open: _open,
		})}
			<EntityDetails
				entityType={EntityType.MarketPriceRange}
				entityId={wireId}
			>
				<QueryBoundary
					placeholderText="Loading OHLC points…"
					query={pointRowsQuery}
				>
					{#snippet children(_rows)}
						{#if pointRows.length === 0}
							<p data-text="muted">
								No OHLC points for this range yet.
							</p>
						{:else}
							<MarketTimeIntervalTimestampChart
								max={chartMax}
								min={chartMin}
								points={pointRows}
								title={displayTitle}
							/>
						{/if}
					{/snippet}
				</QueryBoundary>

				<QueryBoundary
					placeholderText={marketPriceRangePlaceholderText}
					query={rangeQuery}
				>
					{#snippet children(_rows)}
						{#if rangeRow === undefined}
							<p data-text="muted">
								No range series for this id yet.
							</p>
						{:else}
							<dl>
								<div>
									<dt>Points</dt>
									<dd>
										{String(pointRows.length)}
									</dd>
								</div>

								{#if latestPoint !== undefined}
									<div>
										<dt>Latest timestamp (ns)</dt>
										<dd>
											{String(latestPoint[EntityMetaKey.Id].timestampNs)}
										</dd>
									</div>
								{/if}
							</dl>
						{/if}
					{/snippet}
				</QueryBoundary>
			</EntityDetails>

			<section>
				<h2>
					Points
				</h2>
				<Market_TimeInterval_TimestampsView
					collapsible={false}
					entityFieldReference={{
						entityType: EntityType.MarketPriceRange,
						entityId: wireId,
						fieldName: '$$points',
					}}
					href={resolve('/(assets)/coins/market/[marketKey]', {
						marketKey: encodeURIComponent(stringify(wireId.$market)),
					})}
					id={`${stringify(wireId)}:points`}
					title="Points"
				/>
			</section>

			<section>
				<h2>
					Market
				</h2>
				<MarketView
					entityId={wireId.$market}
					href={(
						resolve(
							'/(assets)/coins/market/[marketKey]',
							{
								marketKey: (
									encodeURIComponent(
										stringify(wireId.$market),
									)
								),
							},
						)
					)}
					id={`${stringify(wireId)}:parent-market`}
					layout={EntityLayout.Summary}
					open={false}
				/>
			</section>

			{#if children}
				{@render children()}
			{/if}
		{/snippet}
	</EntityView>
{/if}
