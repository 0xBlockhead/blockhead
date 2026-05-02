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
			/** Wire id, or `__idKey` string to resolve from the collection. */
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

	import { entityCollectionByEntityType } from '$/routes/+layout.svelte'


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

	const wireId = $derived.by(() => {
		if (typeof entityId === 'object' && entityId !== undefined) {
			return entityId
		}
		return rangeRow?.[EntityMetaKey.Id] as (
			| typeof MarketPriceRangeSchema.id.infer
			| undefined
		)
	})

	const rangeField = $derived(
		(() => {
			const bag = rangeRow?.[EntityMetaKey.Fields]
			if (bag === undefined || typeof bag !== 'object') {
				return null
			}
			const b = bag as Record<string, unknown>
			return {
				pointCount: typeof b.pointCount === 'number' ? b.pointCount : undefined,
			}
		})(),
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

	// Components
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import QueryBoundary from '$/components/QueryBoundary.svelte'
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
			{#if rangeField?.pointCount !== undefined}
				<dl data-definition-list="vertical">
					<div>
						<dt>Points</dt>
						<dd>
							{String(rangeField.pointCount)}
						</dd>
					</div>
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
										{rangeField?.pointCount === undefined ? '—' : String(rangeField.pointCount)}
									</dd>
								</div>
							</dl>
						{/if}
					{/snippet}
				</QueryBoundary>
			</EntityDetails>

			<section>
				<h2>
					Parent market
				</h2>
				<p data-text="muted">
					<code>$$parentMarket</code>
					—
					<code>entityId.$market</code>
					;
					<code>Market</code>
					aggregates
					<code>$$marketPriceRanges</code>
					.
				</p>
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
