<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { MarketAssetKind } from '$/constants/Market.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import MarketPriceSchema from '$/schema/MarketPrice.ts'
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
			entityId: typeof MarketPriceSchema.id.infer | string
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
	const marketPriceIdKey = $derived(
		typeof entityId === 'string' ?
			entityId
		:	stringify(entityId),
	)

	const marketPriceQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({ row: entityCollectionByEntityType[EntityType.MarketPrice] })
				.where(({ row }) => (
					eq(
						row[EntityMetaKey.IdKey],
						marketPriceIdKey,
					)
				))
				.select(({ row }) => ({ row }))
		),
		[() => marketPriceIdKey],
	)

	const marketPriceRow = $derived(
		(
			marketPriceQuery.data === undefined
				? undefined
			:	(
					marketPriceQuery.data.find(
						(r) => r.row[EntityMetaKey.Source] === Source.Coingecko_Rest,
					)?.row
					?? marketPriceQuery.data[0]?.row
				)
		),
	)

	const marketPriceQuotesQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({ row: entityFieldCollections[EntityType.MarketPrice].$$quotes })
				.where(({ row }) => (
					eq(
						row[EntityMetaKey.ParentIdKey],
						marketPriceIdKey,
					)
				))
				.select(({ row }) => ({ row }))
		),
		[() => marketPriceIdKey],
	)

	const latestQuoteId = $derived(
		marketPriceQuotesQuery.data
			?.map((r) => r.row[EntityMetaKey.Value])
			.sort((a, b) => (
				a[EntityMetaKey.Id].timestampNs < b[EntityMetaKey.Id].timestampNs ?
					1
				: a[EntityMetaKey.Id].timestampNs > b[EntityMetaKey.Id].timestampNs ?
					-1
				:
					0
			))[0]
			?.[EntityMetaKey.Id],
	)

	const latestQuoteIdKey = $derived(
		latestQuoteId === undefined ?
			undefined
		:	stringify(latestQuoteId),
	)

	const latestQuoteQuery = useLiveQuery(
		(queryBuilder) => (
			latestQuoteIdKey === undefined ?
				queryBuilder
					.from({ row: entityCollectionByEntityType[EntityType.Market_Timestamp] })
					.orderBy(({ row }) => (
						row[EntityMetaKey.IdKey]
					), 'asc')
					.limit(0)
					.select(({ row }) => ({ row }))
			:
			queryBuilder
				.from({ row: entityCollectionByEntityType[EntityType.Market_Timestamp] })
				.where(({ row }) => (
					eq(
						row[EntityMetaKey.IdKey],
						latestQuoteIdKey,
					)
				))
				.select(({ row }) => ({ row }))
		),
		[() => latestQuoteIdKey],
	)

	const latestQuoteRow = $derived(
		(
			latestQuoteQuery.data === undefined
				? undefined
			:	(
					latestQuoteQuery.data.find(
						(r) => r.row[EntityMetaKey.Source] === Source.Coingecko_Rest,
					)?.row
					?? latestQuoteQuery.data[0]?.row
				)
		),
	)

	const wireId = $derived(
		typeof entityId === 'string' ?
			marketPriceRow?.[EntityMetaKey.Id]
		:
			entityId,
	)

	const catalogCoinId = $derived(
		wireId !== undefined && wireId.$market.$base.kind === MarketAssetKind.Coin ?
			wireId.$market.$base.$coin.coinId
		:	undefined,
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

	const marketPriceField = $derived(
		(() => {
			const bag = latestQuoteRow?.[EntityMetaKey.Fields]
			if (!(typeof bag === 'object' && bag !== null && !Array.isArray(bag))) {
				return null
			}
			const b = bag
			return {
				price: typeof b.price === 'bigint' ? b.price : undefined,
				caip19: typeof b.caip19 === 'string' ? b.caip19 : undefined,
			}
		})(),
	)

	const latestQuoteUpdatedAt = $derived(
		latestQuoteId === undefined ?
			undefined
		:	Number(latestQuoteId.timestampNs / 1_000_000n),
	)

	const usdFrom1e8 = $derived(
		marketPriceField?.price === undefined ?
			undefined
		:	Number(marketPriceField.price) / 1e8,
	)

	const marketPricePlaceholderText = 'Loading market price…'


	// Components
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import QueryBoundary from '$/components/QueryBoundary.svelte'
	import Timestamp, { TimestampFormat } from '$/components/Timestamp.svelte'
	import MarketView from '$/views/MarketView.svelte'
	import Market_TimestampsView from '$/views/Market_TimestampsView.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


{#if wireId === undefined}
	<span data-placeholder>
		…
	</span>
{:else}
	<EntityView
		entityType={EntityType.MarketPrice}
		entityId={wireId}
		href={hrefResolved}
		{open}
		{...entityViewRest}
		title={catalogCoinId ?? 'Market price'}
	>
		{#snippet Content()}
			{#if usdFrom1e8 !== undefined || latestQuoteUpdatedAt !== undefined || marketPriceField?.caip19 !== undefined}
				<dl>
					{#if usdFrom1e8 !== undefined}
						<div>
							<dt>USD (spot index)</dt>
							<dd>
								<NumberValue
									value={usdFrom1e8}
									options={{
										minimumFractionDigits: 2,
										maximumFractionDigits: 6,
									}}
								/>
							</dd>
						</div>
					{/if}
					{#if marketPriceField?.caip19 !== undefined}
						<div>
							<dt>CAIP-19</dt>
							<dd>
								<code>
									{marketPriceField.caip19}
								</code>
							</dd>
						</div>
					{/if}
					{#if latestQuoteUpdatedAt !== undefined && Number.isFinite(latestQuoteUpdatedAt)}
						<div>
							<dt>As of</dt>
							<dd>
								<Timestamp
									timestamp={latestQuoteUpdatedAt}
									format={TimestampFormat.Both}
								/>
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
				entityType={EntityType.MarketPrice}
				entityId={wireId}
			>
				<QueryBoundary
					placeholderText={marketPricePlaceholderText}
					query={latestQuoteQuery}
				>
					{#snippet children(_rows)}
						{#if latestQuoteRow === undefined}
							<p data-text="muted">
								No price point for this market yet.
							</p>
						{:else}
							<dl>
								{#if marketPriceField?.price !== undefined}
									<div>
										<dt>Price</dt>
										<dd>{String(marketPriceField.price)}</dd>
									</div>
								{/if}
								{#if latestQuoteId !== undefined}
									<div>
										<dt>Timestamp (ns)</dt>
										<dd>{String(latestQuoteId.timestampNs)}</dd>
									</div>
								{/if}
								{#if latestQuoteUpdatedAt !== undefined && Number.isFinite(latestQuoteUpdatedAt)}
									<div>
										<dt>Updated</dt>
										<dd>
											<Timestamp
												timestamp={latestQuoteUpdatedAt}
												format={TimestampFormat.Both}
											/>
										</dd>
									</div>
								{/if}
								{#if marketPriceField?.caip19 !== undefined}
									<div>
										<dt>CAIP-19</dt>
										<dd>
											<code>{marketPriceField.caip19}</code>
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
					Quotes
				</h2>
				<Market_TimestampsView
					collapsible={false}
					entityFieldReference={{
						entityType: EntityType.MarketPrice,
						entityId: wireId,
						fieldName: '$$quotes',
					}}
					href={resolve('/(assets)/coins/market/[marketKey]', {
						marketKey: encodeURIComponent(stringify(wireId.$market)),
					})}
					id={`${stringify(wireId)}:quotes`}
					title="Quotes"
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
