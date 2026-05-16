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

	const pointLive = useEntity(
		EntityType.Market_TimeInterval_Timestamp,
		entityId,
		{
			$: [
				Source.Coingecko_Rest,
				Source.Constants_Internal,
			],
			open: {},
			high: {},
			low: {},
			close: {},
		},
	)


	// Components
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp, { TimestampFormat } from '$/components/Timestamp.svelte'
	import MarketView from '$/views/MarketView.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	{...entityViewRest}
	entityType={EntityType.Market_TimeInterval_Timestamp}
	{entityId}
	href={href ?? resolve(
		'/(assets)/coins/market/[marketKey]',
		{
			marketKey: encodeURIComponent(stringify(entityId.$market)),
		},
	)}
	{layout}
	{open}
>
	{#snippet Id()}
		<span data-text="font-monospace">
			timestamp
		</span>
	{/snippet}

	{#snippet Heading()}
		{`OHLC ${formatMarketTimeIntervalLabel(entityId.timeInterval)}`}
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<ResourceBoundary
			resource={pointLive}
			placeholderText="Loading OHLC point…"
		>
			{#snippet children(pointLoaded)}
				<dl>
			<div>
				<dt>Id</dt>
				<dd data-text="mono">
					{@render Id()}
				</dd>
			</div>

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
						<dt>At</dt>
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
								<dt>Open</dt>
								<dd>{String(pointLoaded.open)}</dd>
							</div>
						{/if}

						{#if pointLoaded.high !== undefined}
							<div>
								<dt>High</dt>
								<dd>{String(pointLoaded.high)}</dd>
							</div>
						{/if}

						{#if pointLoaded.low !== undefined}
							<div>
								<dt>Low</dt>
								<dd>{String(pointLoaded.low)}</dd>
							</div>
						{/if}

						<div>
							<dt>Timestamp (ns)</dt>
							<dd>{String(entityId.timestampNs)}</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details({ open: _open })}
		<EntityDetails
			entityType={EntityType.Market_TimeInterval_Timestamp}
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
