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
			/** Wire id, or `__idKey` string to resolve from the collection. */
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

	import { entityCollectionByEntityType } from '$/routes/+layout.svelte'


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

	const wireId = $derived.by(() => {
		if (typeof entityId === 'object' && entityId !== undefined) {
			return entityId
		}
		return marketPriceRow?.[EntityMetaKey.Id] as (
			| typeof MarketPriceSchema.id.infer
			| undefined
		)
	})

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
			const bag = marketPriceRow?.[EntityMetaKey.Fields]
			if (bag === undefined || typeof bag !== 'object') {
				return null
			}
			const b = bag as Record<string, unknown>
			return {
				price: typeof b.price === 'bigint' ? b.price : undefined,
				timestampNs: typeof b.timestampNs === 'bigint' ? b.timestampNs : undefined,
				updatedAt: typeof b.updatedAt === 'number' ? b.updatedAt : undefined,
				transport: typeof b.transport === 'string' ? b.transport : undefined,
				providerAssetId: typeof b.providerAssetId === 'string' ? b.providerAssetId : undefined,
				caip19: typeof b.caip19 === 'string' ? b.caip19 : undefined,
			}
		})(),
	)

	const usdFrom1e8 = $derived(
		marketPriceField?.price === undefined ?
			undefined
		:	Number(marketPriceField.price) / 1e8,
	)


	// Components
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import QueryBoundary from '$/components/QueryBoundary.svelte'
	import Timestamp, { TimestampFormat } from '$/components/Timestamp.svelte'
	import MarketView from '$/views/MarketView.svelte'
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
			{#if usdFrom1e8 !== undefined || marketPriceField?.updatedAt !== undefined || marketPriceField?.caip19 !== undefined}
				<dl data-definition-list="vertical">
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
							<dt>CAIP-19 (EVM mainnet id)</dt>
							<dd>
								<code>
									{marketPriceField.caip19}
								</code>
							</dd>
						</div>
					{/if}
					{#if marketPriceField?.updatedAt !== undefined && Number.isFinite(marketPriceField.updatedAt)}
						<div>
							<dt>As of (quote time)</dt>
							<dd>
								<Timestamp
									timestamp={marketPriceField.updatedAt}
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
					query={marketPriceQuery}
				>
					{#snippet children(_rows)}
						{#if marketPriceRow === undefined}
							<p data-text="muted">
								No quote for this market id yet.
							</p>
						{:else}
							<dl>
								{#if marketPriceField?.price !== undefined}
									<div>
										<dt>Price (fixed 1e8)</dt>
										<dd>{String(marketPriceField.price)}</dd>
									</div>
								{/if}
								{#if marketPriceField?.timestampNs !== undefined}
									<div>
										<dt>Timestamp (ns)</dt>
										<dd>{String(marketPriceField.timestampNs)}</dd>
									</div>
								{/if}
								{#if marketPriceField?.updatedAt !== undefined && typeof marketPriceField.updatedAt === 'number' && Number.isFinite(marketPriceField.updatedAt)}
									<div>
										<dt>Updated</dt>
										<dd>
											<Timestamp
												timestamp={marketPriceField.updatedAt}
												format={TimestampFormat.Both}
											/>
										</dd>
									</div>
								{/if}
								{#if marketPriceField?.transport !== undefined}
									<div>
										<dt>Transport</dt>
										<dd>{marketPriceField.transport}</dd>
									</div>
								{/if}
								{#if marketPriceField?.providerAssetId !== undefined}
									<div>
										<dt>Provider asset id</dt>
										<dd>{marketPriceField.providerAssetId}</dd>
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
					Parent market
				</h2>
				<p data-text="muted">
					<code>$$parentMarket</code>
					—
					<code>entityId.$market</code>
					;
					<code>Market</code>
					aggregates
					<code>$$marketPrices</code>
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
