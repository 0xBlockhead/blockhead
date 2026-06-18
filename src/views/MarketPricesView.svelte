<script lang="ts">
	import type { EntityFieldName, EntityType as EntityTypeName } from '$/schema/$schema.ts'
	import type { EntityProxyFieldResource } from '$/client/$proxy.svelte.ts'
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { WithRest } from '$/typescript/WithRest.ts'

	import {
		MarketAssetKind,
	} from '$/constants/Market.ts'
	import {
		marketCatalogFieldSources,
		marketSpotPriceSources,
	} from '$/sources/Source.ts'

	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { stringify } from 'devalue'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		title = 'Spot quote index',
		open = $bindable(true),
		collapsible = true,
		limit = 400,
		selection,
		...EntitiesListProps
	}: WithRest<
		{
			title?: string
			open?: boolean
			collapsible?: boolean
			limit?: number
			selection: EntityProxyFieldResource<
				typeof schema,
				EntityTypeName<typeof schema>,
				EntityFieldName<typeof schema, EntityTypeName<typeof schema>>
			>
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
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
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
			Each row is one spot or index quote stream for a market pair and venue.
		</p>
		<p>
			Provider feed identity lives on timestamped quote prints under <code>$$quotes</code>. Interval candles live on the market OHLC index.
		</p>
	{/snippet}

	{#snippet Empty()}
		<p data-text="muted">
			No spot or index quote streams in this context yet.
		</p>
	{/snippet}

	{#snippet body({ open: _bodyOpen })}
		{#if open}
			<ResourceBoundary resource={selection({
					sources: marketSpotPriceSources,
					limit,
				})}>
				{#snippet children(prices)}
					<EntitiesList
						collapsible={false}
						showSummary={false}
						entityType={EntityType.MarketPrice}
						getKey={(price) => stringify(price.entitySelector)}
						getSortValue={(price) => (
							price.entitySelector.$market.$base.kind === MarketAssetKind.Coin ?
								price.entitySelector.$market.$base.$coin.coinId
							:
								''
						)}
						open={true}
						items={Object.values(
							Object.groupBy(
								prices.entities,
								(price) => stringify(price.entitySelector),
							),
						)
							.flatMap((group) => (
								group == null ?
									[]
								:
									[group[0]]
							))}
						{title}
						UnorderedListProps={{ orientation: ListOrientation.Column }}
					>
						{#snippet Empty()}
							<p data-text="muted">
								No spot or index quotes in this context yet.
							</p>
						{/snippet}

						{#snippet Item({ item })}
							{@const marketPriceLabel = `${item.entitySelector.$market.$marketVenue.marketVenueId}:${
								item.entitySelector.$market.$base.kind === MarketAssetKind.Coin ?
									item.entitySelector.$market.$base.$coin.coinId
								:
									item.entitySelector.$market.$base.kind
							}/${item.entitySelector.$market.$quote.kind === MarketAssetKind.Coin ?
								item.entitySelector.$market.$quote.$coin.coinId
							:
								item.entitySelector.$market.$quote.kind
							}`}
							<a
								href={resolve('/(assets)/(markets)/market/[marketKey]', {
									marketKey: stringify(item.entitySelector.$market),
								})}
							>
								<TruncatedValue
									value={marketPriceLabel}
									format={TruncatedValueFormat.Visual}
								/>
							</a>
						{/snippet}
					</EntitiesList>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntitiesList>
