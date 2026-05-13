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


	// Components
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp, { TimestampFormat } from '$/components/Timestamp.svelte'
	import MarketView from '$/views/MarketView.svelte'
	import NumberValue from '$/views/NumberValue.svelte'

	import { useEntity } from '$/collections/$queries.svelte.ts'


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


	const quoteLive = useEntity(
		EntityType.Market_Timestamp,
		entityId,
		{
			$: [Source.TradingView_Rest],
			caip19: {},
			marketCap: {},
			price: {},
			volume24h: {},
		},
	)
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
	{open}
	title="Market quote"
	{...entityViewRest}
>
	{#snippet Content({ title: _title, href: _href })}
		<ResourceBoundary
			placeholderText="Loading quote…"
			resource={quoteLive}
		>
			{#snippet children(q)}
				<dl>
					{#if q.price !== undefined}
						<div>
							<dt>Price</dt>
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
						<dt>As of</dt>
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
							<dt>Timestamp (ns)</dt>
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

		<section>
			<h2>
				Market
			</h2>
			<MarketView
				entityId={entityId.$market}
				href={resolve(
					'/(assets)/coins/market/[marketKey]',
					{
						marketKey: encodeURIComponent(stringify(entityId.$market)),
					},
				)}
				id={`${stringify(entityId)}:market`}
				layout={EntityLayout.Summary}
				open={false}
			/>
		</section>

		{#if children}
			{@render children()}
		{/if}
	{/snippet}
</EntityView>
