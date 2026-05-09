<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import Market_TimestampSchema from '$/schema/Market_Timestamp.ts'


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
			entityId: typeof Market_TimestampSchema.id.infer | string
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
	const marketTimestampIdKey = $derived(
		typeof entityId === 'string' ?
			entityId
		:	stringify(entityId),
	)

	const marketTimestampQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({ row: entityCollectionByEntityType[EntityType.Market_Timestamp] })
				.where(({ row }) => (
					eq(
						row[EntityMetaKey.IdKey],
						marketTimestampIdKey,
					)
				))
				.select(({ row }) => ({ row }))
		),
		[() => marketTimestampIdKey],
	)

	const marketTimestampRow = $derived(
		marketTimestampQuery.data?.[0]?.row,
	)

	const wireId = $derived(
		typeof entityId === 'string' ?
			marketTimestampRow?.[EntityMetaKey.Id]
		:
			entityId,
	)

	const marketTimestampField = $derived(
		(() => {
			const bag = marketTimestampRow?.[EntityMetaKey.Fields]
			if (!(typeof bag === 'object' && bag !== null && !Array.isArray(bag))) return null
			const b = bag
			return {
				price: typeof b.price === 'bigint' ? b.price : undefined,
				marketCap: typeof b.marketCap === 'bigint' ? b.marketCap : undefined,
				volume24h: typeof b.volume24h === 'bigint' ? b.volume24h : undefined,
				caip19: typeof b.caip19 === 'string' ? b.caip19 : undefined,
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
	import NumberValue from '$/views/NumberValue.svelte'
</script>


{#if wireId === undefined}
	<span data-placeholder>
		…
	</span>
{:else}
	<EntityView
		entityType={EntityType.Market_Timestamp}
		entityId={wireId}
		href={href}
		{open}
		{...entityViewRest}
		title="Market quote"
	>
		{#snippet Content()}
			<dl>
				{#if marketTimestampField?.price !== undefined}
					<div>
						<dt>Price</dt>
						<dd>
							<NumberValue value={Number(marketTimestampField.price) / 1e8} />
						</dd>
					</div>
				{/if}

				{#if timestampMs !== undefined && Number.isFinite(timestampMs)}
					<div>
						<dt>As of</dt>
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
				entityType={EntityType.Market_Timestamp}
				entityId={wireId}
			>
				<QueryBoundary
					placeholderText="Loading market quote…"
					query={marketTimestampQuery}
				>
					{#snippet children(_rows)}
						<dl>
							{#if marketTimestampField?.marketCap !== undefined}
								<div>
									<dt>Market cap</dt>
									<dd>{String(marketTimestampField.marketCap)}</dd>
								</div>
							{/if}

							{#if marketTimestampField?.volume24h !== undefined}
								<div>
									<dt>24h volume</dt>
									<dd>{String(marketTimestampField.volume24h)}</dd>
								</div>
							{/if}

							<div>
								<dt>Timestamp (ns)</dt>
								<dd>{String(wireId.timestampNs)}</dd>
							</div>

							{#if marketTimestampField?.caip19 !== undefined}
								<div>
									<dt>CAIP-19</dt>
									<dd>
										<code>{marketTimestampField.caip19}</code>
									</dd>
								</div>
							{/if}
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
					id={`${marketTimestampIdKey}:market`}
					open={false}
				/>
			</section>

			{#if children}
				{@render children()}
			{/if}
		{/snippet}
	</EntityView>
{/if}
