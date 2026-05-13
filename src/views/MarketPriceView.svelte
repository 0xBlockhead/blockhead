<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { MarketAssetKind } from '$/constants/Market.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Context
	import { resolve } from '$app/paths'


	// Components
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp, { TimestampFormat } from '$/components/Timestamp.svelte'
	import MarketView from '$/views/MarketView.svelte'
	import Market_TimestampsView from '$/views/Market_TimestampsView.svelte'
	import NumberValue from '$/views/NumberValue.svelte'

	import { stringify } from 'devalue'

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


	const priceLive = useEntity(
		EntityType.MarketPrice,
		entityId,
		{
			$: [
				Source.Constants_Internal,
				Source.Coingecko_Rest,
				Source.CoinMarketCap_Rest,
				Source.Coinpaprika_OpenApi,
				Source.Defillama_Rest,
				Source.TradingView_Rest,
			],
			$$parentMarket: {},
			$$quotes: {
				$: [
					Source.TradingView_Rest,
				],
			},
			caip19: {},
			price: {},
			providerAssetId: {},
			timestampNs: {},
			transport: {},
			updatedAt: {},
		},
	)
</script>


<EntityView
	entityType={EntityType.MarketPrice}
	{entityId}
	href={
		href
		?? (
			entityId.$market.$base.kind !== MarketAssetKind.Coin ?
				undefined
			:	resolve(
					'/(assets)/(coins)/coin/[coinId]',
					{ coinId: entityId.$market.$base.$coin.coinId },
				)
		)
	}
	{open}
	title={
		(
			entityId.$market.$base.kind === MarketAssetKind.Coin ?
				entityId.$market.$base.$coin.coinId
			:
				undefined
		)
		?? 'Market price'
	}
	{...entityViewRest}
>
	{#snippet Content({ title: _title, href: _href })}
		<ResourceBoundary
			resource={priceLive}
			placeholderText="Loading price…"
		>
			{#snippet children(loaded)}
				<dl>
					{#if loaded.price !== undefined}
						<div>
							<dt>USD (spot index)</dt>
							<dd>
								<NumberValue
									value={Number(loaded.price) / 1e8}
									options={{
										minimumFractionDigits: 2,
										maximumFractionDigits: 6,
									}}
								/>
							</dd>
						</div>
					{/if}
					{#if loaded.caip19 !== undefined}
						<div>
							<dt>CAIP-19</dt>
							<dd>
								<code>{loaded.caip19}</code>
							</dd>
						</div>
					{/if}
					{#if loaded.timestampNs !== undefined}
						<div>
							<dt>As of</dt>
							<dd>
								<Timestamp
									timestamp={Number(loaded.timestampNs / 1_000_000n)}
									format={TimestampFormat.Both}
								/>
							</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details()}
		<EntityDetails
			entityType={EntityType.MarketPrice}
			{entityId}
		>
			<ResourceBoundary
				resource={priceLive}
				placeholderText="Loading price…"
			>
				{#snippet children(loaded)}
					<dl>
						{#if loaded.price !== undefined}
							<div>
								<dt>Price</dt>
								<dd>{String(loaded.price)}</dd>
							</div>
						{/if}
						{#if loaded.timestampNs !== undefined}
							<div>
								<dt>Timestamp (ns)</dt>
								<dd>{String(loaded.timestampNs)}</dd>
							</div>
						{/if}
						{#if loaded.updatedAt !== undefined}
							<div>
								<dt>Updated</dt>
								<dd>
									<Timestamp
										timestamp={loaded.updatedAt}
										format={TimestampFormat.Both}
									/>
								</dd>
							</div>
						{/if}
						{#if loaded.transport !== undefined}
							<div>
								<dt>Transport</dt>
								<dd>{loaded.transport}</dd>
							</div>
						{/if}
						{#if loaded.providerAssetId !== undefined && loaded.providerAssetId !== null}
							<div>
								<dt>Provider asset id</dt>
								<dd>{loaded.providerAssetId}</dd>
							</div>
						{/if}
					</dl>
				{/snippet}
			</ResourceBoundary>
		</EntityDetails>

		<section>
			<h2>
				Quotes
			</h2>
			<Market_TimestampsView
				collapsible={false}
				entityFieldReference={{
					entityType: EntityType.MarketPrice,
					entityId,
					fieldName: '$$quotes',
				}}
				href={resolve('/(assets)/coins/market/[marketKey]', {
					marketKey: encodeURIComponent(stringify(entityId.$market)),
				})}
				id={`${stringify(entityId)}:quotes`}
				title="Quotes"
			/>
		</section>

		<section>
			<h2>
				Market
			</h2>
			<MarketView
				entityId={entityId.$market}
				href={resolve(
					'/(assets)/coins/market/[marketKey]',
					{
						marketKey: (
							encodeURIComponent(
								stringify(entityId.$market),
							)
						),
					},
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
