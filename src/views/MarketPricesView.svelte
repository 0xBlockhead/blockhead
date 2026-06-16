<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'

	import {
		MarketAssetKind,
	} from '$/constants/Market.ts'
	import {
		marketCatalogFieldSources,
		marketSpotPriceSources,
	} from '$/sources/Source.ts'

	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { stringify } from 'devalue'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// Context
	import { subscribe } from '$/routes/+layout.svelte'
	// State
	let {
		title = 'Spot quote index',
		open = $bindable(true),
		collapsible = true,
		limit = 400,
		entityFieldReference,
		...EntitiesListProps
	}: WithRest<
		{
			title?: string
			open?: boolean
			collapsible?: boolean
			limit?: number
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.MarketPrice>
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'href'
			| 'id'
			| 'CollapsibleProps'
		>
	> = $props()
	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import MarketPriceView from '$/views/MarketPriceView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	bind:open
	{collapsible}
	entityType={EntityType.MarketPrice}
	{title}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Each row is one spot or index quote stream for a market pair, venue, provider, and optional feed key.
		</p>
		<p>
			Open the row for timestamped quote prints on <code>$$quotes</code>. Interval candles live on the market OHLC index.
		</p>
	{/snippet}

	{#snippet Empty()}
		<p data-text="muted">
			No spot or index quote streams in this context yet.
		</p>
	{/snippet}

	{#snippet body({ open: _bodyOpen })}
		{#if open}
			{@const market = subscribe(entityFieldReference.entityType,
				entityFieldReference.selector,({ sources: [
						...marketCatalogFieldSources,
					], fields: { [entityFieldReference.fieldName]: {
						sources: marketSpotPriceSources,
						limit: limit,
					},
				} }),
			)}
			<ResourceBoundary
				resource={market}
			>
				{#snippet children(market)}
					{@const marketPrices: readonly Entity<typeof schema, EntityType.MarketPrice>[] = (
						market.fields[entityFieldReference.fieldName]?.values ?? []
					)}
					<EntitiesList
						collapsible={false}
						showSummary={false}
						entityType={EntityType.MarketPrice}
						getKey={(row) => stringify(
							row.value[EntityMetaKey.Selector],
						)}
						getSortValue={(row) => (
							row.value[EntityMetaKey.Selector].$market.$base.kind === MarketAssetKind.Coin ?
								row.value[EntityMetaKey.Selector].$market.$base.$coin.coinId
							:
								''
						)}
						open={true}
						items={Object.values(
							Object.groupBy(
								marketPrices,
								(price) => stringify(price[EntityMetaKey.Selector]),
							),
						)
							.flatMap((group) => (
								group == null ?
									[]
								:
									[group[0]]
							))
							.map((value) => ({
								value,
							}))}
						{title}
						UnorderedListProps={{ orientation: ListOrientation.Column }}
					>
						{#snippet Empty()}
							<p data-text="muted">
								No spot or index quotes in this context yet.
							</p>
						{/snippet}

						{#snippet Item({ item })}
							<MarketPriceView
								selector={item.value[EntityMetaKey.Selector]}
								id={stringify(item.value[EntityMetaKey.Selector])}
								layout={EntityLayout.Summary}
								open={false}
							/>
						{/snippet}
					</EntitiesList>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntitiesList>
