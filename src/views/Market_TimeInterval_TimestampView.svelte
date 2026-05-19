<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'
	import { formatMarketTimeIntervalLabel } from '$/constants/Market.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context
	import { resolve } from '$app/paths'


	// Props
	let {
		children,
		entityId,
		href,
		layout,
		open = $bindable(true),
		...entityViewRest
	}: WithRest<
		{
			children?: Snippet
			entityId: EntityId<typeof schema, EntityType.Market_TimeInterval_Timestamp>
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Omit<
			ComponentProps<typeof EntityView>,
			| 'entityType'
			| 'entityId'
			| 'href'
			| 'layout'
			| 'open'
			| 'title'
			| 'Details'
			| 'Heading'
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const entityIdKey = $derived(
		stringify(entityId),
	)

	const pointLive = useEntity(
		EntityType.Market_TimeInterval_Timestamp,
		entityId,
		{
			$: [
				Source.Coingecko_Rest,
				Source.Constants_Internal,
			],
			close: {},
			...(open && {
				open: {},
				high: {},
				low: {},
			}),
		},
	)


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import Heading from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp, { TimestampFormat } from '$/components/Timestamp.svelte'
	import MarketView from '$/views/MarketView.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.Market_TimeInterval_Timestamp}
	{entityId}
	href={href ?? resolve(
		'/(assets)/coins/market/[marketKey]',
		{
			marketKey: encodeURIComponent(stringify(entityId.$market)),
		},
	)}
	{layout}
	bind:open
	title={`Market interval OHLC · ${formatMarketTimeIntervalLabel(entityId.timeInterval)} · candle at interval boundary`}
	{...entityViewRest}
>
	{#snippet Id()}
		<span data-text="font-monospace">
			interval start (candle boundary)
		</span>
	{/snippet}

	{#snippet Heading()}
		{`${formatMarketTimeIntervalLabel(entityId.timeInterval)} OHLC`}
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<ResourceBoundary
			resource={pointLive}
			placeholderText="Loading OHLC candle…"
		>
			{#snippet children(pointLoaded)}
				<dl data-column-item="center">
					{#if pointLoaded.close !== undefined}
						<div>
							<dt>Close</dt>
							<dd>
								<NumberValue
									options={{
										maximumFractionDigits: 6,
										minimumFractionDigits: 2,
									}}
									value={Number(pointLoaded.close) / 1e8}
								/>
							</dd>
						</div>
					{/if}

					<div>
						<dt>Interval start</dt>
						<dd>
							<Timestamp
								format={TimestampFormat.Both}
								timestamp={Number(entityId.timestampNs / 1_000_000n)}
							/>
						</dd>
					</div>
					{#if open}
						{#if pointLoaded.open !== undefined}
							<div>
								<dt>Open (1e8)</dt>
								<dd>{String(pointLoaded.open)}</dd>
							</div>
						{/if}

						{#if pointLoaded.high !== undefined}
							<div>
								<dt>High (1e8)</dt>
								<dd>{String(pointLoaded.high)}</dd>
							</div>
						{/if}

						{#if pointLoaded.low !== undefined}
							<div>
								<dt>Low (1e8)</dt>
								<dd>{String(pointLoaded.low)}</dd>
							</div>
						{/if}

						<div>
							<dt>Candle boundary (interval start · ns)</dt>
							<dd>{String(entityId.timestampNs)}</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details()}
		<EntityDetails
			entityType={EntityType.Market_TimeInterval_Timestamp}
			{entityId}
		/>

		<div
			class="entity-view-detail-carousels"
			data-column="gap-3"
		>
			<CollapsibleTabs
				id={`${entityIdKey}:carousel-related`}
				{...{ 'data-card': '' }}
				scrollContainerProps={{
					'data-row': 'start align-start',
					style: '--carousel-basis: 40ch',
				}}
			>
				{#snippet Summary({
					open: _isOpen,
				})}
					<header
						data-row-item="flexible"
						data-row="wrap gap-4"
					>
						<Heading>
							Related pair market
						</Heading>
					</header>
				{/snippet}

				{#snippet children(_ctx)}
					<section data-scroll-marker-label="Pair market">
						<MarketView
							entityId={entityId.$market}
							href={resolve(
								'/(assets)/coins/market/[marketKey]',
								{
									marketKey: encodeURIComponent(stringify(entityId.$market)),
								},
							)}
							id={`${entityIdKey}:market`}
							layout={EntityLayout.Summary}
							open={false}
						/>
					</section>

					{#if children}
						<section data-scroll-marker-label="More">
							{@render children()}
						</section>
					{/if}
				{/snippet}
			</CollapsibleTabs>
		</div>
	{/snippet}
</EntityView>


<style>
	.entity-view-detail-carousels :global(.collapsible-tabs-scroll[data-scroll-container]) {
		&[data-scroll-container] {
			--scrollContainer-sizeBlock: calc(80cqb - 6rem);
			max-block-size: var(--scrollContainer-sizeBlock);

			&[data-scroll-container~='layout-carousel'] {
				--carousel-basis: 40ch;
			}
		}
	}
</style>
