<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { stringify } from 'devalue'
	import { schema } from '$/schema/index.ts'
	import { formatMarketIdLabel } from '$/constants/Market.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


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
			entityId: EntityId<typeof schema, EntityType.MarketPrice>
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
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const marketPrice = useEntity(
		EntityType.MarketPrice,
		entityId,
		{
			$: [
				Source.Constants_Internal,
				Source.Coingecko_Rest,
				Source.Coingecko_OpenApi,
				Source.CoinMarketCap_Rest,
				Source.Coinpaprika_OpenApi,
				Source.Defillama_OpenApi,
				Source.TradingView_Rest,
				Source.Blockscout_Rest,
			],
			$$parentMarket: {},
			$$quotes: {
				$: [
					Source.Blockscout_Rest,
					Source.Coingecko_Rest,
					Source.Coingecko_OpenApi,
					Source.CoinMarketCap_Rest,
					Source.Coinpaprika_OpenApi,
					Source.Defillama_OpenApi,
					Source.TradingView_Rest,
				],
				$limit: 32,
			},
		},
	)


	// Components
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Tooltip from '$/components/Tooltip.svelte'
	import Market_TimestampView from '$/views/Market_TimestampView.svelte'
	import Market_TimestampsView from '$/views/Market_TimestampsView.svelte'
</script>


<EntityView
	entityType={EntityType.MarketPrice}
	{entityId}
	href={
		href
		?? resolve(
			'/(assets)/(markets)/market/[marketKey]',
			{
				marketKey: encodeURIComponent(stringify(entityId.$market)),
			},
		)
	}
	{open}
	title={formatMarketIdLabel(entityId.$market)}
	{...entityViewRest}
	summaryUsesHeading={true}
>
	{#snippet Heading()}
		{formatMarketIdLabel(entityId.$market)}
	{/snippet}

	{#snippet Title()}
		<span>
			{(
				entityId.feedKey != null && entityId.feedKey !== '' ?
					entityId.feedKey
				: entityId.$network != null ?
					`Chain ${String(entityId.$network.chainId)}`
				:
					'Quote stream'
			)}
		</span>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<dl data-column-item="center">
			<div>
				<dt>Latest quote</dt>
				<dd>
					<ResourceBoundary
						resource={marketPrice}
						placeholderText="Loading quotes…"
					>
						{#snippet children(marketPrice)}
							{@const headQuoteId = (
								(marketPrice.$$quotes ?? [])
									.toSorted((
										leftQuote,
										rightQuote,
									) => (
										rightQuote[EntityMetaKey.Id].timestampMs
											- leftQuote[EntityMetaKey.Id].timestampMs
									))[0]
									?.[EntityMetaKey.Id]
							)}
							{#if headQuoteId}
								<Market_TimestampView
									entityId={headQuoteId}
									layout={EntityLayout.Summary}
									open={false}
									showTypeAnnotation={false}
								/>
							{:else}
								<div data-row="wrap align-center gap-2">
									<p data-text="muted">
										No spot or index quote yet.
									</p>
									<Tooltip contentProps={{ side: 'top' }}>
										{#snippet Content()}
											<p>
												Quotes are timestamped rows on <code>Market_Timestamp</code>
												(<code>$$quotes</code>), not fields on this stream header.
											</p>
										{/snippet}
										<abbr
											class="entity-heading-tip"
											aria-label="Quote stream vs timestamp rows"
										>ⓘ</abbr>
									</Tooltip>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		<EntityDetails
			entityType={EntityType.MarketPrice}
			{entityId}
		/>

		<Market_TimestampsView
			collapsible={false}
			entityFieldReference={{
				entityType: EntityType.MarketPrice,
				entityId,
				fieldName: '$$quotes',
			}}
			open={false}
			title="Quotes"
		/>

		{#if children}
			{@render children()}
		{/if}
	{/snippet}
</EntityView>
