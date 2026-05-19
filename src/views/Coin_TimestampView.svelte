<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'

	import { EntityType } from '$/schema/$EntityType.ts'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'


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
			entityId: EntityId<typeof schema, EntityType.Coin_Timestamp>
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

	const snapshotKey = $derived(
		stringify(entityId),
	)

	const coinTimestamp = useEntity(
		EntityType.Coin_Timestamp,
		entityId,
		{
			$: [
				Source.Local_Internal,
			],
			marketCap: {},
			...(open ?
				{
					totalSupply: {},
				}
				:
				{}),
		},
	)


	const resolvedHref = (
		href
		?? resolve(
			'/(assets)/(coins)/coin/[coinId]',
			{
				coinId: entityId.$coin.coinId,
			},
		)
	)


	const timestampMs = (
		Number(entityId.timestampNs / 1_000_000n)
	)


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp, { TimestampFormat } from '$/components/Timestamp.svelte'
	import CoinView from '$/views/CoinView.svelte'
</script>


<EntityView
	entityType={EntityType.Coin_Timestamp}
	bind:open
	{entityId}
	href={resolvedHref}
	title={`${entityId.$coin.coinId} · local snapshot`}
	{...entityViewRest}
>
	{#snippet Heading()}

		<span data-text="font-monospace">
			{entityId.$coin.coinId}
		</span>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			<strong>Timestamped</strong>
			catalog snapshot for the owning coin: fundamental fields frozen at wall-clock <strong>quote time</strong>
			— the entity id keeps <strong>nanoseconds</strong>
			for stable ordering; pair with spot or OHLC market rows when auditing supply or market-cap moves, not with mempool calldata.
		</p>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<ResourceBoundary
			resource={coinTimestamp}
			placeholderText="Loading snapshot…"
		>
			{#snippet children(live)}
				<dl data-column-item="center">
					{#if live.marketCap !== undefined}
						<div>
							<dt>Market cap</dt>
							<dd>{String(live.marketCap)}</dd>
						</div>
					{/if}
					<div>
						<dt>Snapshot wall time</dt>
						<dd>
							<Timestamp
								timestamp={timestampMs}
								format={TimestampFormat.Both}
							/>
						</dd>
					</div>
					{#if open}
						{#if live.totalSupply !== undefined}
							<div>
								<dt>Recorded total supply</dt>
								<dd>{String(live.totalSupply)}</dd>
							</div>
						{/if}
						<div>
							<dt>Keyed timestamp (nanoseconds)</dt>
							<dd>{String(entityId.timestampNs)}</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		<EntityDetails
			entityType={EntityType.Coin_Timestamp}
			{entityId}
		/>

		<div
			class="entity-view-detail-carousels"
			data-column="gap-3"
		>
			<CollapsibleTabs
				id={`${snapshotKey}:carousel-related`}
				{...{ 'data-card': '' }}
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({ open: _isOpen })}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>
							Upstream coin
						</HeadingComponent>
					</header>
				{/snippet}

				{#snippet Markers({ open: _markersOpen })}
					<a
						data-scroll-marker-label="Coin"
						href={`#${snapshotKey}:coin-timestamp-coin`}
					>Logical coin</a>
					{#if children}
						<a
							data-scroll-marker-label="More"
							href={`#${snapshotKey}:coin-timestamp-more`}
						>More</a>
					{/if}
				{/snippet}

				{#snippet children(_childrenContext)}
					<section id={`${snapshotKey}:coin-timestamp-coin`}>
						<ResourceBoundary
							placeholderText="Loading coin…"
							resource={coinTimestamp}
						>
							{#snippet children()}
								<CoinView
									entityId={entityId.$coin}
									href={resolve(
										'/(assets)/(coins)/coin/[coinId]',
										{
											coinId: entityId.$coin.coinId,
										},
									)}
									id={`${snapshotKey}:coin`}
									open={false}
								/>
							{/snippet}
						</ResourceBoundary>
					</section>

					{#if children}
						<section id={`${snapshotKey}:coin-timestamp-more`}>
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
