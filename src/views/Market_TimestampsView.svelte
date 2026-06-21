<script lang="ts">
	import { select } from '$/routes/+layout.svelte'
	import type { EntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import { stringify } from 'devalue'
	import { SvelteSet } from 'svelte/reactivity'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// Context
	// State
	let {
		title = 'Spot stream',
		open = $bindable(true),
		collapsible = true,
		selection,
		...EntitiesListProps
	}: WithRest<
		{
			title?: string
			open?: boolean
			collapsible?: boolean
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.Market_Timestamp>
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'href'
			| 'id'
			| 'CollapsibleProps'
		>
	> = $props()


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Market_TimestampView from '$/views/Market_TimestampView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	bind:open
	{collapsible}
	entityType={EntityType.Market_Timestamp}
	{title}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Each row is a timestamped spot or index observation for the quoted base/against pair.
		</p>
		<p>
			OHLC interval candles use separate entities with an explicit time bucket.
		</p>
	{/snippet}

	{#snippet Empty()}
		<p data-text="muted">
			No spot quotes yet.
		</p>
	{/snippet}

	{#snippet body({ open: _bodyOpen })}
		{#if open}
			<ResourceBoundary
				resource={selection({
						sources: [
							Source.Blockscout_Rest,
							Source.Coingecko_Rest,
							Source.Coingecko_OpenApi,
							Source.CoinMarketCap_Rest,
							Source.Coinpaprika_OpenApi,
							Source.Defillama_OpenApi,
							Source.TradingView_Rest,
						],
						limit: 2048,
					})}
				placeholderText="Loading spot quotes…"
			>
				{#snippet children(quotes)}
					<EntitiesList
						collapsible={false}
						showSummary={false}
						{...EntitiesListProps}
						entityType={EntityType.Market_Timestamp}
						getKey={(row) => stringify(row.entitySelector)}
						getSortValue={(row) => String(row.entitySelector.timestampMs)}
						placeholderKeys={new SvelteSet<string>()}
						items={quotes.entities}
						{title}
						open={true}
						UnorderedListProps={{ orientation: ListOrientation.Column }}
					>
						{#snippet Empty()}
							<p data-text="muted">
								No spot quotes yet.
							</p>
						{/snippet}

						{#snippet Item({ item })}
							<Market_TimestampView
								selection={select(EntityType.Market_Timestamp, item.entitySelector)}
								id={stringify(item.entitySelector)}
								layout={EntityLayout.Summary}

							/>
						{/snippet}
					</EntitiesList>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntitiesList>
