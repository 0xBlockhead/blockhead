<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'
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
			entityId: EntityId<typeof schema, EntityType.Market_Timestamp>
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
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const entityIdKey = $derived(
		stringify(entityId),
	)

	const quoteLive = useEntity(
		EntityType.Market_Timestamp,
		entityId,
		{
			$: [Source.TradingView_Rest],
			price: {},
			...(open && {
				caip19: {},
				marketCap: {},
				volume24h: {},
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
	import Tooltip from '$/components/Tooltip.svelte'
	import MarketView from '$/views/MarketView.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.Market_Timestamp}
	{entityId}
	href={href ?? resolve(
		'/(assets)/coins/market/[marketKey]',
		{
			marketKey: encodeURIComponent(stringify(entityId.$market)),
		},
	)}
	{layout}
	bind:open
	title="Spot"
	{...entityViewRest}
>
	{#snippet Heading()}

		<span data-text="font-monospace">
			{String(entityId.timestampNs)}
		</span>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
<p>
					A timestamped spot or index observation for the quoted base/against pair.
				</p>
				<p>
					Fields like price, market cap, or volume appear when the upstream feed supplies them.
				</p>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<ResourceBoundary
			placeholderText="Loading quote…"
			resource={quoteLive}
		>
			{#snippet children(q)}
				<dl data-column-item="center">
					{#if q.price !== undefined}
						<div>
							<dt>Last (index, USD)</dt>
							<dd>
								<NumberValue
									value={Number(q.price) / 1e8}
									options={{
										maximumFractionDigits: 6,
										minimumFractionDigits: 2,
									}}
								/>
							</dd>
						</div>
					{/if}

					<div>
						<dt>Quote time</dt>
						<dd>
							<Timestamp
								format={TimestampFormat.Both}
								timestamp={Number(entityId.timestampNs / 1_000_000n)}
							/>
						</dd>
					</div>
					{#if open}
						{#if q.marketCap !== undefined}
							<div>
								<dt>Market cap</dt>
								<dd>{String(q.marketCap)}</dd>
							</div>
						{/if}

						{#if q.volume24h !== undefined}
							<div>
								<dt>24h volume</dt>
								<dd>{String(q.volume24h)}</dd>
							</div>
						{/if}

						<div>
							<dt>Sample time (ns)</dt>
							<dd>{String(entityId.timestampNs)}</dd>
						</div>

						{#if q.caip19 !== undefined}
							<div>
								<dt>CAIP-19</dt>
								<dd>
									<code>{q.caip19}</code>
								</dd>
							</div>
						{/if}
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details()}
		<EntityDetails
			entityType={EntityType.Market_Timestamp}
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
							Market
						</Heading>
					</header>
				{/snippet}

				{#snippet children(_ctx)}
					<section data-scroll-marker-label="Market">
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
