<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { formatMarketTimeIntervalLabel } from '$/constants/Market.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import Market_TimeInterval_TimestampSchema from '$/schema/Market_TimeInterval_Timestamp.ts'


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
			entityId: typeof Market_TimeInterval_TimestampSchema.id.infer | string
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
	const pointIdKey = $derived(
		typeof entityId === 'string' ?
			entityId
		:	stringify(entityId),
	)

	const pointQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({ row: entityCollectionByEntityType[EntityType.Market_TimeInterval_Timestamp] })
				.where(({ row }) => (
					eq(
						row[EntityMetaKey.IdKey],
						pointIdKey,
					)
				))
				.select(({ row }) => ({ row }))
		),
		[() => pointIdKey],
	)

	const pointRow = $derived(
		pointQuery.data?.[0]?.row,
	)

	const wireId = $derived(
		typeof entityId === 'string' ?
			pointRow?.[EntityMetaKey.Id]
		:
			entityId,
	)

	const pointField = $derived(
		(() => {
			const bag = pointRow?.[EntityMetaKey.Fields]
			if (!(typeof bag === 'object' && bag !== null && !Array.isArray(bag))) return null
			const b = bag
			return {
				open: typeof b.open === 'bigint' ? b.open : undefined,
				high: typeof b.high === 'bigint' ? b.high : undefined,
				low: typeof b.low === 'bigint' ? b.low : undefined,
				close: typeof b.close === 'bigint' ? b.close : undefined,
			}
		})(),
	)

	const timestampMs = $derived(
		wireId === undefined ?
			undefined
		:	Number(wireId.timestampNs / 1_000_000n),
	)


	// Components
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import QueryBoundary from '$/components/QueryBoundary.svelte'
	import Timestamp, { TimestampFormat } from '$/components/Timestamp.svelte'
	import MarketView from '$/views/MarketView.svelte'
</script>


{#if wireId === undefined}
	<span data-placeholder>
		…
	</span>
{:else}
	<EntityView
		entityType={EntityType.Market_TimeInterval_Timestamp}
		entityId={wireId}
		href={href}
		{open}
		{...entityViewRest}
		title={`OHLC ${formatMarketTimeIntervalLabel(wireId.timeInterval)}`}
	>
		{#snippet Content()}
			<dl>
				{#if pointField?.close !== undefined}
					<div>
						<dt>Close</dt>
						<dd>{String(pointField.close)}</dd>
					</div>
				{/if}

				{#if timestampMs !== undefined && Number.isFinite(timestampMs)}
					<div>
						<dt>At</dt>
						<dd>
							<Timestamp
								timestamp={timestampMs}
								format={TimestampFormat.Both}
							/>
						</dd>
					</div>
				{/if}
			</dl>
		{/snippet}

		{#snippet Details({
			open: _open,
		})}
			<EntityDetails
				entityType={EntityType.Market_TimeInterval_Timestamp}
				entityId={wireId}
			>
				<QueryBoundary
					placeholderText="Loading OHLC point…"
					query={pointQuery}
				>
					{#snippet children(_rows)}
						<dl>
							{#if pointField?.open !== undefined}
								<div>
									<dt>Open</dt>
									<dd>{String(pointField.open)}</dd>
								</div>
							{/if}

							{#if pointField?.high !== undefined}
								<div>
									<dt>High</dt>
									<dd>{String(pointField.high)}</dd>
								</div>
							{/if}

							{#if pointField?.low !== undefined}
								<div>
									<dt>Low</dt>
									<dd>{String(pointField.low)}</dd>
								</div>
							{/if}

							<div>
								<dt>Timestamp (ns)</dt>
								<dd>{String(wireId.timestampNs)}</dd>
							</div>
						</dl>
					{/snippet}
				</QueryBoundary>
			</EntityDetails>

			<section>
				<h2>
					Market
				</h2>
				<MarketView
					entityId={wireId.$market}
					href={resolve(
						'/(assets)/coins/market/[marketKey]',
						{
							marketKey: encodeURIComponent(stringify(wireId.$market)),
						},
					)}
					id={`${pointIdKey}:market`}
					open={false}
				/>
			</section>

			{#if children}
				{@render children()}
			{/if}
		{/snippet}
	</EntityView>
{/if}
